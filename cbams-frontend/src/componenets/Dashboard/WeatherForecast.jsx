import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Cloud, 
  Sun, 
  CloudRain,
  CloudDrizzle,
  CloudSnow,
  Wind,
  Droplets,
  Eye,
  Gauge,
  CloudFog,
  Zap,
  Loader
} from 'lucide-react';
import { translations } from '../../constants/languages';

const WeatherForecast = ({ currentLanguage }) => {
  const t = (key) => translations[currentLanguage]?.[key] || translations.en[key];
  
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState({ lat: null, lon: null, city: 'Your Location' });

  // Get weather icon based on code
  const getWeatherIcon = (code) => {
    if (code === 0) return Sun;
    if ([1, 2].includes(code)) return Cloud;
    if ([3].includes(code)) return Cloud;
    if ([45, 48].includes(code)) return CloudFog;
    if ([51, 53, 55, 56, 57].includes(code)) return CloudDrizzle;
    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return CloudRain;
    if ([71, 73, 75, 77, 85, 86].includes(code)) return CloudSnow;
    if ([95, 96, 99].includes(code)) return Zap;
    return Sun;
  };

  const getWeatherDescription = (code) => {
    const descriptions = {
      0: 'Clear Sky', 1: 'Mainly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
      45: 'Foggy', 48: 'Foggy', 51: 'Light Drizzle', 53: 'Drizzle',
      55: 'Heavy Drizzle', 61: 'Light Rain', 63: 'Rain', 65: 'Heavy Rain',
      71: 'Light Snow', 73: 'Snow', 75: 'Heavy Snow', 80: 'Light Showers',
      81: 'Showers', 82: 'Heavy Showers', 95: 'Thunderstorm',
      96: 'Thunderstorm with Hail', 99: 'Heavy Thunderstorm'
    };
    return descriptions[code] || 'Unknown';
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(prev => ({ ...prev, lat: latitude, lon: longitude }));
          
          try {
            const geoResponse = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const geoData = await geoResponse.json();
            setLocation(prev => ({ 
              ...prev, 
              city: geoData.address.city || geoData.address.town || geoData.address.village || 'Your Location'
            }));
          } catch (error) {
            console.error('Error getting city name:', error);
          }

          try {
            const response = await fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`
            );
            const data = await response.json();
            setWeather(data);
            setLoading(false);
          } catch (error) {
            console.error('Error fetching weather:', error);
            setLoading(false);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocation({ lat: 28.6139, lon: 77.2090, city: 'New Delhi' });
          fetchWeatherForLocation(28.6139, 77.2090);
        }
      );
    } else {
      setLocation({ lat: 28.6139, lon: 77.2090, city: 'New Delhi' });
      fetchWeatherForLocation(28.6139, 77.2090);
    }
  }, []);

  const fetchWeatherForLocation = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`
      );
      const data = await response.json();
      setWeather(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching weather:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 shadow-xl border border-blue-100"
      >
        <div className="flex items-center justify-center gap-3">
          <Loader className="w-6 h-6 text-blue-600 animate-spin" />
          <p className="text-gray-600">Loading weather data...</p>
        </div>
      </motion.div>
    );
  }

  if (!weather) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 shadow-xl border border-red-100"
      >
        <p className="text-gray-600">Unable to load weather data</p>
      </motion.div>
    );
  }

  const CurrentIcon = getWeatherIcon(weather.current.weather_code);
  const currentTemp = Math.round(weather.current.temperature_2m);
  const feelsLike = Math.round(weather.current.apparent_temperature);
  const humidity = weather.current.relative_humidity_2m;
  const windSpeed = Math.round(weather.current.wind_speed_10m);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-8 shadow-2xl text-white overflow-hidden relative"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>

      {/* Header */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold mb-1">{location.city}</h3>
            <p className="text-blue-100 text-sm">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <CurrentIcon className="w-16 h-16 text-yellow-300 drop-shadow-lg" />
        </div>

        {/* Current Weather */}
        <div className="mb-8">
          <div className="flex items-baseline gap-2">
            <span className="text-7xl font-bold">{currentTemp}°</span>
            <span className="text-2xl text-blue-100">C</span>
          </div>
          <p className="text-xl text-blue-100 mt-2">
            {getWeatherDescription(weather.current.weather_code)}
          </p>
          <p className="text-sm text-blue-200 mt-1">
            Feels like {feelsLike}°C
          </p>
        </div>

        {/* Weather Details - ✅ FIXED CONTRAST */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <Droplets className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Humidity</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{humidity}%</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <Wind className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Wind Speed</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{windSpeed} km/h</p>
          </div>
        </div>

        {/* 3-Day Forecast - ✅ FIXED CONTRAST */}
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((dayOffset, index) => {
            const ForecastIcon = getWeatherIcon(weather.daily.weather_code[dayOffset]);
            const maxTemp = Math.round(weather.daily.temperature_2m_max[dayOffset]);
            const minTemp = Math.round(weather.daily.temperature_2m_min[dayOffset]);
            const date = new Date();
            date.setDate(date.getDate() + dayOffset);
            
            return (
              <div 
                key={index} 
                className="bg-white rounded-xl p-4 text-center shadow-md"
              >
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  {date.toLocaleDateString('en-US', { weekday: 'short' })}
                </p>
                <ForecastIcon className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                <div className="flex items-center justify-center gap-2 text-base">
                  <span className="font-bold text-gray-900">{maxTemp}°</span>
                  <span className="text-gray-600">{minTemp}°</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Powered by Open-Meteo */}
      <p className="text-xs text-blue-200 mt-6 text-center opacity-70">
        Powered by Open-Meteo API
      </p>
    </motion.div>
  );
};

export default WeatherForecast;
