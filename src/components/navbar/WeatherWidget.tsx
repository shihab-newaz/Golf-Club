'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Cloud, CloudRain, Snowflake } from 'lucide-react';
import { useTheme } from 'next-themes';
import { getWeatherData } from '@/app/actions/weather';

interface WeatherData {
  temperature: number;
  condition: string;
  lastUpdated: string;
}

const WeatherWidget: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setIsLoading(true);
        const data = await getWeatherData();
        if (data) {
          setWeatherData(data);
        }
      } catch (error) {
        console.error('Failed to fetch weather data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeather();

    // Refresh weather data every hour
    const intervalId = setInterval(fetchWeather, 3600000);
    return () => clearInterval(intervalId);
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

  if (isLoading) {
    return <div className="animate-pulse flex items-center space-x-2 p-2 rounded-full bg-inherit shadow-md">
      <div className="h-5 w-5 bg-gray-200 rounded-full" />
      <div className="h-4 w-12 bg-gray-200 rounded" />
    </div>;
  }

  if (!weatherData) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2 p-2 rounded-full bg-inherit shadow-md">
      {getWeatherIcon(weatherData.condition)}
      <span className="text-sm font-semibold text-foreground">
        {weatherData.temperature}°C
      </span>
      <span className="sr-only">
        Last updated: {new Date(weatherData.lastUpdated).toLocaleTimeString()}
      </span>
    </div>
  );
};

export default WeatherWidget;