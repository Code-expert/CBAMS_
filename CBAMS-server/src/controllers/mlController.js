import axios from 'axios';
import FormData from 'form-data';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import { analyzeImageWithGemini } from '../services/geminiService.js';
import { uploadToCloudinary } from '../config/cloudinary.js';

const prisma = new PrismaClient();
const ML_SERVICE_URL = 'http://localhost:5001/api/ml';

// ========== CROP RECOMMENDATION ==========
export const getCropRecommendation = async (req, res) => {
  try {
    const { nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall } = req.body;
    
    const response = await axios.post(`${ML_SERVICE_URL}/crop-recommendation`, {
      nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall
    });
    
    // Save recommendation to database
    await prisma.cropRecommendation.create({
      data: {
        userId: req.user.id,
        recommendations: response.data.recommendations,
        inputData: req.body
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('❌ ML Error:', error.message);
    res.status(500).json({ error: 'Failed to get crop recommendation' });
  }
};

// ========== CROP HEALTH ANALYSIS ==========
export const uploadCropImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }
    
    const { cropType, farmId } = req.body;
    
    // Create form data for ML service
    const formData = new FormData();
    
    if (req.file.buffer) {
      formData.append('image', req.file.buffer, {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
      });
    } else {
      formData.append('image', fs.createReadStream(req.file.path));
    }
    
    formData.append('userId', req.user.id);
    formData.append('cropType', cropType || 'unknown');
    formData.append('farmId', farmId || 'default');
    
    // Send to ML service
    const response = await axios.post(`${ML_SERVICE_URL}/analyze-crop-health`, formData, {
      headers: formData.getHeaders()
    });
    
    // Save to database
    const cropImage = await prisma.cropImage.create({
      data: {
        userId: req.user.id,
        farmId: farmId || 'default',
        imageUrl: response.data.imageUrl,
        cropType: cropType || 'unknown',
        healthScore: response.data.analysis.healthScore,
        status: response.data.analysis.status,
        analysisData: response.data.analysis,
        uploadDate: new Date()
      }
    });
    
    // Clean up temp file (only if using disk storage)
    if (req.file.path) {
      fs.unlinkSync(req.file.path);
    }
    
    res.json({
      success: true,
      imageId: cropImage.id,
      analysis: response.data.analysis
    });
    
  } catch (error) {
    console.error('❌ Upload Error:', error.message);
    res.status(500).json({ error: 'Failed to analyze crop image' });
  }
};

// ========== DISEASE DETECTION ==========
export const detectDisease = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }
    
    const formData = new FormData();
    
    if (req.file.buffer) {
      formData.append('image', req.file.buffer, {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
      });
    } else {
      formData.append('image', fs.createReadStream(req.file.path));
    }
    
    const response = await axios.post(`${ML_SERVICE_URL}/detect-disease`, formData, {
      headers: formData.getHeaders()
    });
    
    // Clean up
    if (req.file.path) {
      fs.unlinkSync(req.file.path);
    }
    
    return res.json(response.data);
    
  } catch (error) {
    console.error('⚠️ Local ML Service inaccessible, attempting expert fallback to Gemini:', error.message);
    
    try {
      // 1. Upload to Cloudinary to get a permanent URL for Gemini
      const cloudinaryResult = await uploadToCloudinary(
        req.file.buffer || fs.readFileSync(req.file.path),
        'cbams-expert-fallback'
      );
      
      // 2. Call Gemini for analysis
      // Note: We're passing a mock crop object for context
      const geminiResult = await analyzeImageWithGemini(
        cloudinaryResult.secure_url,
        'fallback_' + Date.now(),
        { type: 'Unknown', plantedDate: new Date() }
      );
      
      // 3. Map Gemini result to expected detection format
      const formattedResult = {
        success: true,
        detection: {
          diseaseDetected: geminiResult.diseaseDetected,
          disease: {
            name: geminiResult.diseaseName || 'Healthy',
            description: geminiResult.overallAssessment,
            treatment: geminiResult.treatment || 'No specific treatment needed'
          },
          severity: {
            level: geminiResult.diseaseRisk,
            score: geminiResult.healthScore,
          },
          recommendations: geminiResult.recommendations,
          confidence: geminiResult.diseaseConfidence || 90,
          analysisTier: 'Gemini Expert (Fallback Tier)'
        },
        timestamp: new Date().toISOString()
      };
      
      // Clean up local file if exists
      if (req.file.path) {
        fs.unlinkSync(req.file.path);
      }
      
      return res.json(formattedResult);
      
    } catch (fallbackError) {
      console.error('❌ Both ML and Gemini fallback failed:', fallbackError.message);
      
      if (req.file.path) {
        fs.unlinkSync(req.file.path);
      }
      
      return res.status(500).json({ 
        error: 'Analysis failed. Both local ML and expert fallback services are unavailable.',
        details: fallbackError.message 
      });
    }
  }
};

// ========== CROP YIELD PREDICTION ==========
export const getYieldPrediction = async (req, res) => {
  try {
    const { nitrogen, phosphorus, potassium, temperature, rainfall, area } = req.body;
    
    // Call ML service
    const response = await axios.post(`${ML_SERVICE_URL}/predict-yield`, {
      nitrogen, phosphorus, potassium, temperature, rainfall, area
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('❌ Yield Prediction Error:', error.message);
    res.status(500).json({ error: 'Failed to get yield prediction' });
  }
};

// ========== MARKET PRICE FORECAST ==========
export const getPriceForecast = async (req, res) => {
  try {
    const { crop } = req.query; // e.g., ?crop=Rice
    
    if (!crop) {
      return res.status(400).json({ error: 'Crop type is required' });
    }
    
    // Call ML service
    const response = await axios.post(`${ML_SERVICE_URL}/predict-price`, {
      crop
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('❌ Price Forecast Error:', error.message);
    res.status(500).json({ error: 'Failed to get price forecast' });
  }
};

// ========== GET CROP PROGRESS ==========
export const getCropProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { farmId } = req.params;
    
    // Get all crop images for this farm
    const images = await prisma.cropImage.findMany({
      where: {
        userId,
        farmId: farmId || 'default'
      },
      orderBy: {
        uploadDate: 'asc'
      }
    });
    
    // Calculate progress metrics
    const progress = images.map((img, index) => ({
      day: (index + 1) * 10,
      healthScore: img.healthScore,
      status: img.status,
      date: img.uploadDate,
      imageUrl: img.imageUrl
    }));
    
    // Calculate improvement
    const improvement = images.length > 1 
      ? ((images[images.length - 1].healthScore - images[0].healthScore) / images[0].healthScore) * 100
      : 0;
    
    res.json({
      success: true,
      progress,
      totalSubmissions: images.length,
      improvementScore: improvement.toFixed(2),
      currentHealth: images[images.length - 1]?.healthScore || 0
    });
    
  } catch (error) {
    console.error('❌ Progress Error:', error.message);
    res.status(500).json({ error: 'Failed to get crop progress' });
  }
};
