'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Cloud, CloudRain, Snowflake } from 'lucide-react';
import { useTheme } from 'next-themes';
import { getWeatherData } from '@/app/actions/fetchWeather';

interface WeatherData {
  temperature: number;
  condition: string;
  timestamp: number;
}

const CACHE_DURATION = 3600000; // 1 hour in milliseconds

const WeatherWidget: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchWeather = async () => {
      // Check localStorage for cached data
      const cachedData = localStorage.getItem('weatherData');
      if (cachedData) {
        const parsedData: WeatherData = JSON.parse(cachedData);
        if (Date.now() - parsedData.timestamp < CACHE_DURATION) {
          setWeatherData(parsedData);
          return;
        }
      }

      // If no valid cached data, fetch new data
      const newData = await getWeatherData();
      if (newData) {
        const weatherWithTimestamp = { ...newData, timestamp: Date.now() };
        setWeatherData(weatherWithTimestamp);
        localStorage.setItem('weatherData', JSON.stringify(weatherWithTimestamp));
      }
    };

    fetchWeather();
  }, []);

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
      case 'clear':
        return <Sun className="h-5 w-5 text-yellow-400" />;
      case 'cloudy':
      case 'partly cloudy':
        return <Cloud className="h-5 w-5 text-gray-400" />;
      case 'rainy':
      case 'rain':
        return <CloudRain className="h-5 w-5 text-blue-400" />;
      case 'snowy':
      case 'snow':
        return <Snowflake className="h-5 w-5 text-blue-200" />;
      default:
        return <Sun className="h-5 w-5 text-yellow-400" />;
    }
  };

  if (!weatherData) {
    return null; // Or you could return a loading state here
  }

  return (
    <div className={`flex items-center space-x-2 p-2 rounded-full bg-inherit shadow-md`}>
      {getWeatherIcon(weatherData.condition)}
      <span className={`text-sm font-semibold text-foreground`}>
        {weatherData.temperature}°C
      </span>
    </div>
  );
};

export default WeatherWidget;