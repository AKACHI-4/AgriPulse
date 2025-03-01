"use client";

import { api } from '$/convex/_generated/api';
import { Id } from '$/convex/_generated/dataModel';
import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from "convex/react";
import React from 'react';

type WeatherDataInterface = {
  temp: number;
  main: string;
  description: string;
  location: string;
};

export default function OverViewLayout({
  sales,
  pie_stats,
  bar_stats,
  area_stats
}: {
  sales: React.ReactNode;
  pie_stats: React.ReactNode;
  bar_stats: React.ReactNode;
  area_stats: React.ReactNode;
}) {
  const user = useQuery(api.users.getCurrentUser);
  // console.log("user : ", user);

  const cropData = useQuery(api.crops.getCropYieldAndFieldRevenue, {
    user_id: user?._id as Id<"users">,
  });
  const cropYield = cropData?.cropYield ?? 0;
  const fieldRevenue = cropData?.fieldRevenue ?? 0;

  const [weatherData, setWeatherData] = React.useState<WeatherDataInterface>();

  React.useEffect(() => {
    if (!user || !user.latitude || !user.longitude) return;

    async function fetchWeatherData() {
      try {
        const response = await fetch(
          `/api/weather?q=${user?.address}&lat=${user?.latitude}&lon=${user?.longitude}`
        );
        if (!response.ok) throw new Error('Failed to fetch weather data');

        const data = await response.json();
        setWeatherData(data);
      } catch (error) {
        console.error('Error fetching forecast:', error);
      }
    }

    fetchWeatherData();
  }, []);

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-center justify-between space-y-2'>
          <h2 className='text-2xl font-bold tracking-tight'>
            Welcome back, {user?.name}! 🌱 Let’s check your crops.
          </h2>
        </div>
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Total Crop Yield
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-x-1'>
                <span className='text-2xl font-bold'>
                  {cropYield}
                </span>
                <span className='text-gray-800 font-semibold text-md'>kg/ha</span>
              </div>
              <p className='text-xs text-muted-foreground'>
                +5% from last season
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Active IoT Sensors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>+1</div>
              <p className='text-xs text-muted-foreground'>
                60% uptime this month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Field Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>₹ {fieldRevenue}</div>
              <p className='text-xs text-muted-foreground'>
                +5.2% since last update
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Temperature</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{weatherData?.temp}°C</div>
              <p className='text-xs text-muted-foreground'>
                +3°C compared to last month
              </p>
            </CardContent>
          </Card>
        </div>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7'>
          <div className='col-span-4'>{bar_stats}</div>
          <div className='col-span-4 md:col-span-3'>
            {sales}
          </div>
          <div className='col-span-4'>{area_stats}</div>
          <div className='col-span-4 md:col-span-3'>{pie_stats}</div>
        </div>
      </div>
    </PageContainer>
  );
}
