'use client';

import * as React from 'react';
import { Label, Pie, PieChart, Cell } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { useQuery } from 'convex/react';
import { api } from '$/convex/_generated/api';
import { Id } from '$/convex/_generated/dataModel';

const chartConfig = {
  area: { label: 'Cultivated Area' }
};

export function PieGraph() {
  const colorPalette = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
    'hsl(var(--chart-6))'
  ];

  const user = useQuery(api.users.getCurrentUser);
  const crops = useQuery(api.crops.getCropsByUser, {
    user_id: user?._id as Id<"users">
  });

  const chartData = React.useMemo(() => {
    return crops?.map((crop, index) => ({
      crop: crop.name,
      area: crop.area,
      color: colorPalette[index % colorPalette.length]
    })) ?? [];
  }, [crops]);

  const totalArea = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.area, 0);
  }, [chartData]);

  return (
    <Card className='flex flex-col'>
      <CardHeader className='items-center pb-0'>
        <CardTitle>Crop Distribution by Field</CardTitle>
        <CardDescription>Percentage of cultivated land</CardDescription>
      </CardHeader>
      <CardContent className='flex-1 pb-0'>
        <ChartContainer
          config={chartConfig}
          className='mx-auto aspect-square max-h-[357px]'
        >
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey='area' nameKey='crop' innerRadius={60} strokeWidth={5}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} className='opacity-75' />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor='middle'
                        dominantBaseline='middle'
                      >
                        <tspan x={viewBox.cx} y={viewBox.cy} className='fill-foreground text-3xl font-bold'>
                          {totalArea.toLocaleString()} ha
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className='fill-muted-foreground text-base'>
                          Total Area
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
