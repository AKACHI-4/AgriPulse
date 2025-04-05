'use client';

import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

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
import { useQuery } from 'convex/react';
import { api } from '$/convex/_generated/api';
import { Id } from '$/convex/_generated/dataModel';

const chartConfig = {
  production: {
    label: 'Production (kg)',
    color: 'hsl(var(--chart-1))'
  },
  revenue: {
    label: 'Revenue (₹)',
    color: 'hsl(var(--chart-2))'
  }
} satisfies ChartConfig;

export function AreaGraph() {
  const user = useQuery(api.users.getCurrentUser);
  const crops = useQuery(api.crops.getCropsByUser, {
    user_id: user?._id as Id<'users'>
  });

  const chartData = crops?.map(crop => ({
    crop: crop.name,
    production: crop.production,
    revenue: crop.revenue,
  })) ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crop Production & Revenue</CardTitle>
        <CardDescription>
          Visual representation of production (kg) and revenue (₹) by crop
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className='aspect-auto h-[310px] w-full'>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 10, left: 24, right: 24, bottom: 30 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey='crop'
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              interval={0}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator='dot' />} />
            <Area
              dataKey='revenue'
              type='monotone'
              fill='hsl(var(--chart-1))'
              fillOpacity={0.3}
              stroke='hsl(var(--chart-1))'
              strokeWidth={2}
            />
            <Area
              dataKey='production'
              type='monotone'
              fill='hsl(var(--chart-2))'
              fillOpacity={0.3}
              stroke='hsl(var(--chart-2))'
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter>
        <div className='flex w-full items-start gap-2 text-sm'>
          <div className='grid gap-2'>
            <div className='flex items-center gap-2 font-medium leading-none'>
              Trending up by 5.2% this month <TrendingUp className='h-4 w-4' />
            </div>
            <div className='text-muted-foreground'>January - June 2024</div>
          </div>
        </div>
      </CardFooter> */}
    </Card>
  );
}
