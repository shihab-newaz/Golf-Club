// app/api/weather/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const url = 'https://weatherapi-com.p.rapidapi.com/current.json?q=41.1439,-81.3365';
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_WEATHER_API_KEY || '',
      'x-rapidapi-host': 'weatherapi-com.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    
    return NextResponse.json({
      temperature: result.current.temp_c,
      condition: result.current.condition.text.toLowerCase()
    });
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return NextResponse.json({ error: 'Failed to fetch weather data' }, { status: 500 });
  }
}