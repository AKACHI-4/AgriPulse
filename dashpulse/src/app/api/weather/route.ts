import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');
    const address = searchParams.get('q');
    const apiKey = process.env.OPENWEATHERMAPS_API_KEY;

    if (!lat || !lon) {
      return NextResponse.json({ error: 'Latitude and longitude are required' }, { status: 400 });
    }

    const url = `http://api.openweathermap.org/data/2.5/weather?q=${address}&lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const { data } = await axios.get(url);

    return NextResponse.json({
      temp: data.main.temp,
      main: data.weather[0].main,
      description: data.weather[0].description,
      location: data.name,
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || 'Failed to fetch weather data' }, { status: 500 });
  }
}
  