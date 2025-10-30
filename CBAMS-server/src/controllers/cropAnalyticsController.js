import { PrismaClient } from '@prisma/client';
import { analyzeImageWithGemini } from '../services/geminiService.js';
import { uploadToCloudinary } from '../config/cloudinary.js';


const prisma = new PrismaClient();

// Get all crops with analytics for a farmer
export const getCropsAnalytics = async (req, res) => {
  try {
    const farmerId = req.user.id;

    const crops = await prisma.crop.findMany({
      where: {
        farmerId,
        status: 'ACTIVE'
      },
      include: {
        _count: {
          select: { images: true }
        },
        images: {
          orderBy: { uploadedAt: 'desc' },
          take: 1,
          select: { uploadedAt: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const cropsWithAnalytics = crops.map(crop => {
      const daysSincePlanting = Math.floor(
        (new Date() - new Date(crop.plantedDate)) / (1000 * 60 * 60 * 24)
      );

      return {
        id: crop.id,
        name: crop.name,
        type: crop.type,
        plantedDate: crop.plantedDate,
        expectedHarvest: crop.expectedHarvest,
        totalImages: crop._count.images,
        lastImageDate: crop.images[0]?.uploadedAt || null,
        daysTracked: daysSincePlanting,
        visualHealthScore: crop.latestHealthScore || 0,
        currentStage: crop.latestGrowthStage || 'Not analyzed yet',
        diseaseDetected: crop.latestDiseaseDetected,
        diseaseName: crop.latestDiseaseName,
        diseaseConfidence: crop.latestDiseaseConfidence,
        pestActivity: crop.latestPestActivity || 'None detected',
        leafColorHealth: crop.latestColorAnalysis || {
          greenness: 0,
          yellowingLevel: 0,
          browningLevel: 0
        },
        geminiInsights: crop.latestGeminiInsights || {
          overallAssessment: 'No analysis yet',
          diseaseRisk: 'Unknown',
          recommendations: [],
          visualObservations: []
        }
      };
    });

    const totalImages = await prisma.cropAnalysisImage.count({
      where: { farmerId }
    });

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const imagesThisWeek = await prisma.cropAnalysisImage.count({
      where: {
        farmerId,
        uploadedAt: { gte: oneWeekAgo }
      }
    });

    const avgHealthScore = cropsWithAnalytics.reduce(
      (sum, crop) => sum + (crop.visualHealthScore || 0),
      0
    ) / cropsWithAnalytics.length || 0;

    const cropsWithDiseases = cropsWithAnalytics.filter(
      crop => crop.diseaseDetected
    ).length;

    res.json({
      crops: cropsWithAnalytics,
      overallStats: {
        totalCrops: cropsWithAnalytics.length,
        totalImages,
        imagesThisWeek,
        avgVisualHealth: Math.round(avgHealthScore),
        cropsWithDiseases,
        cropsWithPests: 0
      }
    });
  } catch (error) {
    console.error('Error fetching crop analytics:', error);
    res.status(500).json({
      message: 'Error fetching crop analytics',
      error: error.message
    });
  }
};

// Get single crop details
export const getCropDetails = async (req, res) => {
  try {
    const { cropId } = req.params;
    const farmerId = req.user.id;

    const crop = await prisma.crop.findFirst({
      where: {
        id: cropId,
        farmerId
      },
      include: {
        images: {
          orderBy: { uploadedAt: 'desc' },
          take: 20,
          select: {
            id: true,
            imageUrl: true,
            uploadedAt: true,
            healthScore: true
          }
        },
        analysisHistory: {
          orderBy: { analyzedAt: 'desc' },
          take: 20
        },
        _count: {
          select: { images: true }
        }
      }
    });

    if (!crop) {
      return res.status(404).json({ message: 'Crop not found' });
    }

    const daysSincePlanting = Math.floor(
      (new Date() - new Date(crop.plantedDate)) / (1000 * 60 * 60 * 24)
    );

    res.json({
      id: crop.id,
      name: crop.name,
      type: crop.type,
      plantedDate: crop.plantedDate,
      expectedHarvest: crop.expectedHarvest,
      totalImages: crop._count.images,
      lastImageDate: crop.images[0]?.uploadedAt || null,
      daysTracked: daysSincePlanting,
      visualHealthScore: crop.latestHealthScore || 0,
      currentStage: crop.latestGrowthStage || 'Not analyzed yet',
      diseaseDetected: crop.latestDiseaseDetected,
      diseaseName: crop.latestDiseaseName,
      diseaseConfidence: crop.latestDiseaseConfidence,
      pestActivity: crop.latestPestActivity || 'None detected',
      leafColorHealth: crop.latestColorAnalysis || {
        greenness: 0,
        yellowingLevel: 0,
        browningLevel: 0
      },
      growthTimeline: crop.analysisHistory.map(history => ({
        week: history.weekNumber,
        date: history.analyzedAt,
        visualHealth: history.healthScore,
        leafCondition: history.leafCondition,
        heightEstimate: history.heightEstimate,
        diseaseStatus: history.diseaseStatus
      })),
      geminiInsights: crop.latestGeminiInsights || {
        overallAssessment: 'No analysis yet',
        diseaseRisk: 'Unknown',
        recommendations: [],
        visualObservations: []
      },
      recentImages: crop.images
    });
  } catch (error) {
    console.error('Error fetching crop details:', error);
    res.status(500).json({
      message: 'Error fetching crop details',
      error: error.message
    });
  }
};

// Create new crop
export const createCrop = async (req, res) => {
  try {
    const { name, type, plantedDate, expectedHarvest, location, area } = req.body;
    const farmerId = req.user.id;

    const crop = await prisma.crop.create({
      data: {
        farmerId,
        name,
        type,
        plantedDate: new Date(plantedDate),
        expectedHarvest: new Date(expectedHarvest),
        location,
        area: area ? parseFloat(area) : null
      }
    });

    res.status(201).json({
      message: 'Crop created successfully',
      crop
    });
  } catch (error) {
    console.error('Error creating crop:', error);
    res.status(500).json({
      message: 'Error creating crop',
      error: error.message
    });
  }
};

// Upload and analyze crop image
export const uploadCropImage = async (req, res) => {
  try {
    const { cropId } = req.params;
    const farmerId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    // Verify crop belongs to farmer
    const crop = await prisma.crop.findFirst({
      where: { id: cropId, farmerId }
    });

    if (!crop) {
      return res.status(404).json({ message: 'Crop not found' });
    }

    // Upload to Cloudinary
    const cloudinaryResult = await uploadToCloudinary(
      req.file.buffer,
      'cbams-crop-analytics'
    );

    // Create image record
    const cropImage = await prisma.cropAnalysisImage.create({
      data: {
        cropId,
        farmerId,
        imageUrl: cloudinaryResult.secure_url,
        cloudinaryId: cloudinaryResult.public_id,
        processingStatus: 'PROCESSING'
      }
    });

    // Analyze image with Gemini AI (async)
    analyzeImageWithGemini(cloudinaryResult.secure_url, cropImage.id, crop)
      .catch(err => console.error('Gemini analysis error:', err));

    res.status(201).json({
      message: 'Image uploaded successfully. Analysis in progress.',
      image: {
        id: cropImage.id,
        url: cloudinaryResult.secure_url,
        status: 'processing'
      }
    });
  } catch (error) {
    console.error('Error uploading crop image:', error);
    res.status(500).json({
      message: 'Error uploading image',
      error: error.message
    });
  }
};

// Get analysis status
export const getAnalysisStatus = async (req, res) => {
  try {
    const { imageId } = req.params;
    const farmerId = req.user.id;

    const image = await prisma.cropAnalysisImage.findFirst({
      where: {
        id: imageId,
        farmerId
      }
    });

    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    res.json({
      status: image.processingStatus,
      analysis: image.processingStatus === 'COMPLETED' ? {
        healthScore: image.healthScore,
        growthStage: image.growthStage,
        diseaseDetected: image.diseaseDetected,
        diseaseName: image.diseaseName,
        diseaseConfidence: image.diseaseConfidence,
        pestActivity: image.pestActivity,
        leafCondition: image.leafCondition,
        colorAnalysis: image.colorAnalysis,
        observations: image.observations,
        recommendations: image.recommendations,
        diseaseRisk: image.diseaseRisk,
        overallAssessment: image.overallAssessment
      } : null,
      error: image.errorMessage
    });
  } catch (error) {
    console.error('Error fetching analysis status:', error);
    res.status(500).json({
      message: 'Error fetching status',
      error: error.message
    });
  }
};

// Delete crop
export const deleteCrop = async (req, res) => {
  try {
    const { cropId } = req.params;
    const farmerId = req.user.id;

    await prisma.crop.deleteMany({
      where: {
        id: cropId,
        farmerId
      }
    });

    res.json({ message: 'Crop deleted successfully' });
  } catch (error) {
    console.error('Error deleting crop:', error);
    res.status(500).json({
      message: 'Error deleting crop',
      error: error.message
    });
  }
};
