import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const cropRecommendationService = {
  
  // Fetch all required data for location
  fetchLocationData: async (latitude, longitude) => {
    try {
      console.log('📍 Fetching data for:', latitude, longitude);
      
      // Parallel fetch for speed
      const [weatherData, soilData, elevationData] = await Promise.all([
        cropRecommendationService.fetchWeatherData(latitude, longitude),
        cropRecommendationService.fetchSoilData(latitude, longitude),
        cropRecommendationService.fetchElevation(latitude, longitude)
      ]);

      return {
        weather: weatherData,
        soil: soilData,
        elevation: elevationData,
        location: { latitude, longitude }
      };
    } catch (error) {
      console.error('Error fetching location data:', error);
      throw error;
    }
  },

  // Fetch weather data (Open-Meteo)
  fetchWeatherData: async (latitude, longitude) => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    // Calculate average values
    const avgTemp = (data.daily.temperature_2m_max[0] + data.daily.temperature_2m_min[0]) / 2;
    const avgRainfall = data.daily.precipitation_sum.reduce((a, b) => a + b, 0) / data.daily.precipitation_sum.length;
    
    return {
      temperature: avgTemp,
      humidity: data.current.relative_humidity_2m,
      rainfall: avgRainfall * 30, // Monthly estimate
      source: 'Open-Meteo'
    };
  },

  // Fetch soil data (SoilGrids API)
  fetchSoilData: async (latitude, longitude) => {
    try {
      // SoilGrids API for soil properties
      const properties = ['nitrogen', 'phh2o', 'soc', 'sand', 'clay'];
      const depth = '0-5cm';
      
      const url = `https://rest.isric.org/soilgrids/v2.0/properties/query?lon=${longitude}&lat=${latitude}&property=${properties.join('&property=')}&depth=${depth}&value=mean`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      // Extract values
      const nitrogen = data.properties.layers.find(l => l.name === 'nitrogen')?.depths[0]?.values?.mean || 20;
      const ph = (data.properties.layers.find(l => l.name === 'phh2o')?.depths[0]?.values?.mean || 65) / 10;
      const soc = data.properties.layers.find(l => l.name === 'soc')?.depths[0]?.values?.mean || 15;
      
      // Estimate NPK from soil organic carbon
      const N = Math.round(nitrogen / 10); // Approximate N content
      const P = Math.round(soc / 3); // Approximate P from SOC
      const K = Math.round(soc / 2); // Approximate K from SOC
      
      return {
        N: N,
        P: P,
        K: K,
        ph: ph,
        source: 'SoilGrids'
      };
    } catch (error) {
      console.error('SoilGrids error, using defaults:', error);
      // Fallback to average Indian soil values
      return {
        N: 20,
        P: 25,
        K: 30,
        ph: 6.5,
        source: 'Default'
      };
    }
  },

  // Fetch elevation data
  fetchElevation: async (latitude, longitude) => {
    try {
      const url = `https://api.open-elevation.com/api/v1/lookup?locations=${latitude},${longitude}`;
      const response = await fetch(url);
      const data = await response.json();
      
      return data.results[0].elevation;
    } catch (error) {
      console.error('Elevation error:', error);
      return 500; // Default elevation
    }
  },

  // AI-based crop recommendation using Gemini
  recommendCropWithAI: async (locationData) => {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `You are an agricultural expert. Based on the following data, recommend the TOP 5 most suitable crops for cultivation.

**Location Data:**
- Latitude: ${locationData.location.latitude}
- Longitude: ${locationData.location.longitude}
- Elevation: ${locationData.elevation}m

**Soil Data:**
- Nitrogen (N): ${locationData.soil.N}
- Phosphorus (P): ${locationData.soil.P}
- Potassium (K): ${locationData.soil.K}
- pH: ${locationData.soil.ph}

**Weather Data:**
- Average Temperature: ${locationData.weather.temperature}°C
- Humidity: ${locationData.weather.humidity}%
- Monthly Rainfall: ${locationData.weather.rainfall}mm

Return your response in this EXACT JSON format (no markdown, no extra text):

{
  "recommendations": [
    {
      "crop": "Crop Name",
      "suitabilityScore": 95,
      "reason": "Brief explanation why this crop is suitable",
      "seasonalTips": "Best planting season and tips",
      "expectedYield": "Estimated yield per acre",
      "marketDemand": "High/Medium/Low"
    }
  ],
  "soilHealth": "Overall soil health assessment",
  "irrigationNeeds": "Irrigation requirements for this location",
  "recommendations": "General farming recommendations for this area"
}

Provide exactly 5 crop recommendations, ordered by suitability score (highest first).`;

      const result = await model.generateContent(prompt);
      let responseText = result.response.text();

      // Clean response
      responseText = responseText
        .replace(/```/g, '')
        .trim();

      const analysis = JSON.parse(responseText);
      
      console.log('✅ AI recommendation generated');
      return analysis;

    } catch (error) {
      console.error('AI recommendation error:', error);
      throw error;
    }
  }
};
