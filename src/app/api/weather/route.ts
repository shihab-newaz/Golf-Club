// app/api/weather/route.ts
import { NextResponse } from 'next/server';

const WEATHER_API_URL = 'https://weatherapi-com.p.rapidapi.com/current.json';
const DEFAULT_LOCATION = '24.8526,89.3730'; // Default coordinates

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get('location') || DEFAULT_LOCATION;

  const url = `${WEATHER_API_URL}?q=${encodeURIComponent(location)}`;
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_WEATHER_API_KEY || '',
      'x-rapidapi-host': 'weatherapi-com.p.rapidapi.com'
    }
  };

  try {
    if (!process.env.RAPIDAPI_WEATHER_API_KEY) {
      throw new Error('RAPIDAPI_WEATHER_API_KEY is not set');
    }

    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`Weather API responded with status: ${response.status}`);
    }

    const result = await response.json();
    
    return NextResponse.json({
      temperature: result.current.temp_c,
      condition: result.current.condition.text.toLowerCase()
    });
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data', details: (error as Error).message },
      { status: 500 }
    );
  }
}