"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Sun, Cloud, CloudRain } from 'lucide-react';

interface WeatherData {
  temperature: number;
  condition: 'sunny' | 'cloudy' | 'rainy';
}

const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    // Mock API call
    const fetchWeather = async () => {
      // In a real scenario, you'd fetch this data from a weather API
      const mockWeather: WeatherData = {
        temperature: Math.floor(Math.random() * (30 - 10 + 1)) + 10, // Random temp between 10-30
        condition: ['sunny', 'cloudy', 'rainy'][Math.floor(Math.random() * 3)] as WeatherData['condition'],
      };
      setWeather(mockWeather);
    };

    fetchWeather();
  }, []);

  if (!weather) return null;

  const WeatherIcon = () => {
    switch (weather.condition) {
      case 'sunny': return <Sun className="h-8 w-8 text-yellow-400" />;
      case 'cloudy': return <Cloud className="h-8 w-8 text-gray-400" />;
      case 'rainy': return <CloudRain className="h-8 w-8 text-blue-400" />;
    }
  };

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Today's Weather</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Perfect for golfing!</p>
          </div>
          <WeatherIcon />
        </div>
        <div className="mt-4">
          <p className="text-3xl font-bold text-gray-800 dark:text-white">{weather.temperature}°C</p>
          <p className="text-sm text-gray-600 dark:text-gray-300 capitalize">{weather.condition}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;