'use client';

import { TrendingUp } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';

const chartData = [
  { month: 'January', wheat: 2.5, corn: 3.2 },
  { month: 'February', wheat: 2.8, corn: 3.5 },
  { month: 'March', wheat: 3.0, corn: 3.8 },
  { month: 'April', wheat: 2.7, corn: 3.4 },
  { month: 'May', wheat: 3.1, corn: 3.9 },
  { month: 'June', wheat: 3.3, corn: 4.0 }
];

const chartConfig = {
  wheat: {
    label: 'Wheat Yield (tons/ha)',
    color: 'hsl(var(--chart-1))'
  },
  corn: {
    label: 'Corn Yield (tons/ha)',
    color: 'hsl(var(--chart-2))'
  }
} satisfies ChartConfig;

export function AreaGraph() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Crop Yield Forecast</CardTitle>
        <CardDescription>
          Estimated production for the next 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className='aspect-auto h-[310px] w-full'
        >
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='month'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator='dot' />}
            />
            <Area
              dataKey='wheat'
              type='natural'
              fill='var(--color-wheat)'
              fillOpacity={0.4}
              stroke='var(--color-wheat)'
              stackId='a'
            />
            <Area
              dataKey='corn'
              type='natural'
              fill='var(--color-corn)'
              fillOpacity={0.4}
              stroke='var(--color-corn)'
              stackId='a'
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className='flex w-full items-start gap-2 text-sm'>
          <div className='grid gap-2'>
            <div className='flex items-center gap-2 font-medium leading-none'>
              Trending up by 5.2% this month <TrendingUp className='h-4 w-4' />
            </div>
            <div className='flex items-center gap-2 leading-none text-muted-foreground'>
              January - June 2024
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
