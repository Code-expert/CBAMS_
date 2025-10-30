import axios from 'axios';
import FormData from 'form-data';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';

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
    formData.append('image', fs.createReadStream(req.file.path));
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
    
    // Clean up temp file
    fs.unlinkSync(req.file.path);
    
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
    formData.append('image', fs.createReadStream(req.file.path));
    
    const response = await axios.post(`${ML_SERVICE_URL}/detect-disease`, formData, {
      headers: formData.getHeaders()
    });
    
    // Clean up
    fs.unlinkSync(req.file.path);
    
    res.json(response.data);
    
  } catch (error) {
    console.error('❌ Disease Detection Error:', error.message);
    res.status(500).json({ error: 'Failed to detect disease' });
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
