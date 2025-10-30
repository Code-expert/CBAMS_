import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// OpenWeatherMap API (Free tier)
const WEATHER_API_KEY = process.env.WEATHER_API_KEY || 'your_api_key_here';
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Get real-time farm metrics based on location
export const getFarmMetrics = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user profile with location
    const profile = await prisma.user.findUnique({
      where: { id: userId },
      select: { location: true, name: true }
    });

    if (!profile || !profile.location) {
      return res.status(400).json({ 
        error: 'Location not set in profile. Please update your location in settings.' 
      });
    }

    // Get coordinates from location name (geocoding)
    const geoResponse = await axios.get(`http://api.openweathermap.org/geo/1.0/direct`, {
      params: {
        q: profile.location,
        limit: 1,
        appid: WEATHER_API_KEY
      }
    });

    if (!geoResponse.data || geoResponse.data.length === 0) {
      return res.status(404).json({ error: 'Location not found' });
    }

    const { lat, lon } = geoResponse.data[0];

    // Fetch weather data
    const weatherResponse = await axios.get(WEATHER_API_URL, {
      params: {
        lat,
        lon,
        appid: WEATHER_API_KEY,
        units: 'metric'
      }
    });

    const weather = weatherResponse.data;

    // Calculate farm metrics
    const metrics = {
      temperature: {
        value: Math.round(weather.main.temp),
        unit: '°C',
        trend: weather.main.temp > 25 ? '+3°C' : '-2°C',
        status: getTemperatureStatus(weather.main.temp)
      },
      humidity: {
        value: weather.main.humidity,
        unit: '%',
        trend: weather.main.humidity > 60 ? '+5%' : '-3%',
        status: getHumidityStatus(weather.main.humidity)
      },
      soilMoisture: {
        value: calculateSoilMoisture(weather.main.humidity, weather.rain?.['1h'] || 0),
        unit: '%',
        trend: weather.rain ? '+8%' : '-2%',
        status: 'optimal'
      },
      cropHealth: {
        value: calculateCropHealth(weather.main.temp, weather.main.humidity),
        unit: '%',
        trend: '+5%',
        status: 'excellent'
      },
      growthRate: {
        value: calculateGrowthRate(weather.main.temp, weather.main.humidity),
        unit: '%',
        trend: '+8%',
        status: 'high'
      },
      weatherCondition: {
        main: weather.weather[0].main,
        description: weather.weather[0].description,
        icon: weather.weather[0].icon
      },
      wind: {
        speed: weather.wind.speed,
        direction: weather.wind.deg
      },
      pressure: weather.main.pressure,
      sunrise: new Date(weather.sys.sunrise * 1000).toLocaleTimeString(),
      sunset: new Date(weather.sys.sunset * 1000).toLocaleTimeString(),
      location: {
        name: weather.name,
        country: weather.sys.country,
        lat,
        lon
      },
      lastUpdated: new Date()
    };

    // Store in database for history tracking
    await storeFarmMetrics(userId, metrics);

    res.json(metrics);
  } catch (error) {
    console.error('❌ FARM METRICS ERROR:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch farm metrics',
      details: error.response?.data?.message || error.message 
    });
  }
};

// Helper: Calculate soil moisture based on humidity and rainfall
function calculateSoilMoisture(humidity, rainfall) {
  // Simple algorithm: base on humidity and recent rainfall
  const baseFromHumidity = humidity * 0.7; // 70% weight from humidity
  const rainfallBonus = rainfall > 0 ? 20 : 0;
  const soilMoisture = Math.min(100, baseFromHumidity + rainfallBonus);
  return Math.round(soilMoisture);
}

// Helper: Calculate crop health score
function calculateCropHealth(temp, humidity) {
  let healthScore = 100;
  
  // Optimal temperature: 20-30°C
  if (temp < 15 || temp > 35) healthScore -= 20;
  else if (temp < 20 || temp > 30) healthScore -= 10;
  
  // Optimal humidity: 40-70%
  if (humidity < 30 || humidity > 80) healthScore -= 15;
  else if (humidity < 40 || humidity > 70) healthScore -= 5;
  
  return Math.max(50, healthScore);
}

// Helper: Calculate growth rate
function calculateGrowthRate(temp, humidity) {
  // Ideal conditions give higher growth rate
  let growthRate = 0;
  
  if (temp >= 20 && temp <= 30) growthRate += 50;
  else if (temp >= 15 && temp <= 35) growthRate += 30;
  else growthRate += 10;
  
  if (humidity >= 50 && humidity <= 70) growthRate += 50;
  else if (humidity >= 40 && humidity <= 80) growthRate += 30;
  else growthRate += 10;
  
  return Math.min(100, growthRate);
}

// Helper: Temperature status
function getTemperatureStatus(temp) {
  if (temp < 10) return 'too_cold';
  if (temp < 20) return 'cool';
  if (temp <= 30) return 'optimal';
  if (temp <= 35) return 'warm';
  return 'too_hot';
}

// Helper: Humidity status
function getHumidityStatus(humidity) {
  if (humidity < 30) return 'too_dry';
  if (humidity < 50) return 'dry';
  if (humidity <= 70) return 'optimal';
  if (humidity <= 80) return 'humid';
  return 'too_humid';
}

// Store metrics in database for tracking
async function storeFarmMetrics(userId, metrics) {
  try {
    // Check if FarmProfile exists
    let farmProfile = await prisma.farmProfile.findUnique({
      where: { userId }
    });

    if (!farmProfile) {
      // Create default farm profile
      farmProfile = await prisma.farmProfile.create({
        data: {
          userId,
          farmName: 'My Farm',
          location: metrics.location.name,
          area: 5.0,
          soilType: 'Loamy',
          latitude: metrics.location.lat,
          longitude: metrics.location.lon
        }
      });
    }

    // Create sensor reading
    await prisma.sensorReading.create({
      data: {
        farmProfileId: farmProfile.id,
        soilMoisture: metrics.soilMoisture.value,
        soilTemp: metrics.temperature.value,
        airTemp: metrics.temperature.value,
        humidity: metrics.humidity.value
      }
    });

    // Update farm profile with latest data
    await prisma.farmProfile.update({
      where: { id: farmProfile.id },
      data: {
        avgTemperature: metrics.temperature.value,
        humidity: metrics.humidity.value,
        moisture: metrics.soilMoisture.value,
        lastUpdated: new Date()
      }
    });
  } catch (error) {
    console.error('Error storing farm metrics:', error);
  }
}

// Get historical metrics
export const getHistoricalMetrics = async (req, res) => {
  try {
    const userId = req.user.id;
    const { days = 7 } = req.query;

    const farmProfile = await prisma.farmProfile.findUnique({
      where: { userId }
    });

    if (!farmProfile) {
      return res.status(404).json({ error: 'Farm profile not found' });
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const readings = await prisma.sensorReading.findMany({
      where: {
        farmProfileId: farmProfile.id,
        timestamp: { gte: startDate }
      },
      orderBy: { timestamp: 'asc' }
    });

    res.json(readings);
  } catch (error) {
    console.error('❌ HISTORICAL METRICS ERROR:', error);
    res.status(500).json({ error: 'Failed to fetch historical data' });
  }
};
