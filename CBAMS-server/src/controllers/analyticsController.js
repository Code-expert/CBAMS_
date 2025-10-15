import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5001';

// Predict crop yield
export const predictYield = async (req, res) => {
  try {
    const { crop, area, rainfall, temperature, humidity, ph, fertilizer } = req.body;
    
    const response = await axios.post(`${ML_SERVICE_URL}/predict/yield`, {
      crop,
      area,
      rainfall,
      temperature,
      humidity,
      ph,
      fertilizer
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('❌ YIELD PREDICTION ERROR:', error.message);
    res.status(500).json({ error: 'Failed to predict yield' });
  }
};

// Forecast price
export const forecastPrice = async (req, res) => {
  try {
    const { crop, current_price, supply_index, demand_index, weather_index } = req.body;
    
    const response = await axios.post(`${ML_SERVICE_URL}/predict/price`, {
      crop,
      current_price,
      supply_index,
      demand_index,
      weather_index
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('❌ PRICE FORECAST ERROR:', error.message);
    res.status(500).json({ error: 'Failed to forecast price' });
  }
};

// Analyze soil
export const analyzeSoil = async (req, res) => {
  try {
    const { ph, nitrogen, phosphorus, potassium, organic_carbon, moisture } = req.body;
    
    const response = await axios.post(`${ML_SERVICE_URL}/analyze/soil`, {
      ph,
      nitrogen,
      phosphorus,
      potassium,
      organic_carbon,
      moisture
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('❌ SOIL ANALYSIS ERROR:', error.message);
    res.status(500).json({ error: 'Failed to analyze soil' });
  }
};

// Optimize resources
export const optimizeResources = async (req, res) => {
  try {
    const { crop, area, soil_type, current_moisture, growth_stage } = req.body;
    
    const response = await axios.post(`${ML_SERVICE_URL}/optimize/resources`, {
      crop,
      area,
      soil_type,
      current_moisture,
      growth_stage
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('❌ RESOURCE OPTIMIZATION ERROR:', error.message);
    res.status(500).json({ error: 'Failed to optimize resources' });
  }
};

// Get dashboard analytics
export const getDashboardAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user's farm data
    const tasks = await prisma.task.count({ where: { userId } });
    const crops = await prisma.task.groupBy({
      by: ['category'],
      where: { userId },
      _count: true
    });
    
    res.json({
      total_tasks: tasks,
      crops_grown: crops.length,
      crop_distribution: crops,
      last_updated: new Date()
    });
  } catch (error) {
    console.error('❌ DASHBOARD ANALYTICS ERROR:', error.message);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
};
