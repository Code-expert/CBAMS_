export const farmMetricsService = {
  // Fetch real-time farm metrics based on location
  fetchRealTimeMetrics: async (latitude, longitude) => {
    try {
      // Fetch weather and soil data in parallel
      const [weatherData, soilData] = await Promise.all([
        farmMetricsService.fetchWeatherData(latitude, longitude),
        farmMetricsService.fetchSoilData(latitude, longitude)
      ]);

      return {
        temperature: weatherData.temperature,
        humidity: weatherData.humidity,
        soilMoisture: soilData.moisture,
        rainfall: weatherData.rainfall,
        location: { latitude, longitude }
      };
    } catch (error) {
      console.error('Error fetching farm metrics:', error);
      throw error;
    }
  },

  // Fetch weather data from Open-Meteo
  fetchWeatherData: async (latitude, longitude) => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation&hourly=soil_moisture_0_to_1cm&timezone=auto`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    return {
      temperature: data.current.temperature_2m,
      humidity: data.current.relative_humidity_2m,
      rainfall: data.current.precipitation
    };
  },

  // Fetch soil moisture data
  fetchSoilData: async (latitude, longitude) => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=soil_moisture_0_to_1cm,soil_moisture_1_to_3cm&current_weather=true`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    // Get current hour
    const currentHour = new Date().getHours();
    const soilMoisture = data.hourly.soil_moisture_0_to_1cm[currentHour];
    
    // Convert to percentage
    const moisturePercentage = (soilMoisture * 100).toFixed(0);
    
    return {
      moisture: moisturePercentage
    };
  }
};
