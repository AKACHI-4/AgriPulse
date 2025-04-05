'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import * as Sentry from "@sentry/nextjs";

export const description = 'An interactive bar chart';

type ForecastData = {
  date: string;
  moisture: number;
  temperature: number;
};

const chartConfig = {
  moisture: {
    label: 'Soil Moisture',
    color: 'hsl(var(--chart-1))'
  },
  temperature: {
    label: 'Soil Temperature',
    color: 'hsl(var(--chart-2))'
  }
} satisfies ChartConfig;

export function BarGraph() {
  const [chartData, setChartData] = React.useState<ForecastData[]>([]);
  const [activeChart, setActiveChart] = React.useState<'moisture' | 'temperature'>('moisture');
  const [isClient, setIsClient] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  const total = React.useMemo(
    () => ({
      moisture: chartData.reduce((acc, curr) => acc + curr.moisture, 0),
      temperature: chartData.reduce((acc, curr) => acc + curr.temperature, 0)
    }),
    [chartData]
  );

  React.useEffect(() => {
    async function fetchForecastData() {
      setIsLoading(true);
      try {
        const response = await fetch('/api/forecast');
        if (!response.ok) throw new Error('Failed to fetch forecast data');

        const data = await response.json();
        setChartData(
          data.map((day: any) => ({
            date: day.datetime,
            moisture: day.soilmoisture04 ?? 0, // Handle missing data
            temperature: day.soiltemp04 ?? 0
          }))
        );
      } catch (error) {
        // console.error('Error fetching forecast:', error);
        Sentry.captureException(`error fetching forecast : ${error}`);
      } finally {
        setIsLoading(false);
      }
    }

    fetchForecastData();
  }, []);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  if (!isClient || isLoading)
    return (
      <Card className='p-6 flex justify-center items-center'>
        <p className='text-muted-foreground'>Loading data...</p>
      </Card>
    );

  return (
    <Card>
      <CardHeader className='flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row'>
        <div className='flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6'>
          <CardTitle>Soil Forecast - Interactive</CardTitle>
          <CardDescription>
            Predicted Soil Moisture & Temperature for Next Quarter
          </CardDescription>
        </div>
        <div className='flex'>
          {['moisture', 'temperature'].map((key) => {
            const chart = key as keyof typeof chartConfig;
            if (!chart || total[key as keyof typeof total] === 0) return null;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className='relative flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6'
                onClick={() => setActiveChart(chart)}
              >
                <span className='text-lg'>
                  {chartConfig[chart].label}
                </span>
                {/* <span className='text-lg font-bold leading-none sm:text-3xl'>
                  {total[key as keyof typeof total]?.toLocaleString()}
                </span> */}
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className='px-2 sm:p-6'>
        <ChartContainer
          config={chartConfig}
          className='aspect-auto h-[280px] w-full'
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='date'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className='w-[150px]'
                  nameKey={activeChart}
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    });
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
