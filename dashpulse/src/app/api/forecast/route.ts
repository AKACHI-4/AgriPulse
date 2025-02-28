import { NextResponse } from 'next/server';
import axios from 'axios';
import dayjs from 'dayjs';

export async function GET() {
  try {
    const apiKey = process.env.VISUALCROSSING_API_KEY;
    const city = 'Dehradun,India';
    const baseUrl = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline';

    // Calculate end date as the 1st day of the next*2 month
    const endDate = dayjs().add(15, 'days').format('YYYY-MM-DD');

    // Start date should be exactly 1 year before the end date
    const startDate = dayjs(endDate).subtract(2, 'month').format('YYYY-MM-DD');

    const queryParams = [
      `unitGroup=us`,
      `elements=datetime,datetimeEpoch,soiltemp01,soiltemp04,soiltemp10,soiltemp20,soilmoisture01,soilmoisture04,soilmoisture10,soilmoisture20`,
      `key=${apiKey}`,
      `contentType=json`
    ].join('&');

    const url = `${baseUrl}/${encodeURIComponent(city)}/${startDate}/${endDate}?${queryParams}`;
    const { data } = await axios.get(url);

    // console.log(data.days);
    return NextResponse.json(data.days, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || 'Failed to fetch data' }, { status: 500 });
  }
}
