import { PrismaClient } from '@prisma/client';
import { cropRecommendationService } from '../services/cropRecommendationService.js';

const prisma = new PrismaClient();

export const getCropRecommendation = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;
    const userId = req.user.id;

    if (!latitude || !longitude) {
      return res.status(400).json({ 
        message: 'Latitude and longitude are required' 
      });
    }

    console.log('🌾 Generating crop recommendation for:', latitude, longitude);

    // Fetch all location data
    const locationData = await cropRecommendationService.fetchLocationData(
      parseFloat(latitude),
      parseFloat(longitude)
    );

    // Get AI recommendation
    const recommendation = await cropRecommendationService.recommendCropWithAI(locationData);

    // Save to database
    const savedRecommendation = await prisma.cropRecommendation.create({
      data: {
        userId: userId,
        recommendations: recommendation,
        inputData: locationData,
      }
    });

    res.json({
      success: true,
      data: {
        location: locationData.location,
        elevation: locationData.elevation,
        soil: locationData.soil,
        weather: locationData.weather,
        recommendations: recommendation.recommendations,
        soilHealth: recommendation.soilHealth,
        irrigationNeeds: recommendation.irrigationNeeds,
        generalRecommendations: recommendation.recommendations
      },
      savedId: savedRecommendation.id
    });

  } catch (error) {
    console.error('Error generating recommendation:', error);
    res.status(500).json({
      message: 'Error generating crop recommendation',
      error: error.message
    });
  }
};

// Get user's recommendation history
export const getRecommendationHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const history = await prisma.cropRecommendation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    res.json({ history });

  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({
      message: 'Error fetching recommendation history',
      error: error.message
    });
  }
};
