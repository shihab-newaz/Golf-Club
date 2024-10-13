// app/courses/WeatherSection.tsx
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Sun, Cloud, CloudRain } from 'lucide-react';

interface WeatherData {
  temperature: number;
  condition: string;
}

interface WeatherSectionProps {
  weatherData: WeatherData;
}

const WeatherSection: React.FC<WeatherSectionProps> = ({ weatherData }) => {
  if (!weatherData) {
    return <p>Weather data currently unavailable</p>; 
  }
  const WeatherIcon = () => {
    if (weatherData.condition.includes('sun') || weatherData.condition.includes('clear')) {
      return <Sun className="h-8 w-8 text-yellow-400" />;
    } else if (weatherData.condition.includes('cloud')) {
      return <Cloud className="h-8 w-8 text-gray-400" />;
    } else if (weatherData.condition.includes('rain')) {
      return <CloudRain className="h-8 w-8 text-blue-400" />;
    }
    return <Cloud className="h-8 w-8 text-gray-400" />; // Default icon
  };

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-green-800 dark:text-white">Today's Weather</h2>
      <Card className="bg-white dark:bg-gray-800 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold text-gray-800 dark:text-white">Current Conditions</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Perfect for golfing!</p>
            </div>
            <WeatherIcon />
          </div>
          <div className="mt-4">
            <p className="text-3xl font-bold text-gray-800 dark:text-white">{weatherData.temperature}°C</p>
            <p className="text-sm text-gray-600 dark:text-gray-300 capitalize">{weatherData.condition}</p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default WeatherSection;