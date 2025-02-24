import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { plantIdEndpoints } from '../utils/data';
import PlantIdDialog from './plant-id-dialog';
import { cn } from '@/lib/utils';

export default function PlantIdEndpointsBoard() {
  const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
      case 'GET': return 'bg-green-400 border-green-400';
      case 'POST': return 'bg-yellow-400 border-yellow-400';
      case 'DELETE': return 'bg-red-400 border-red-400';
      case 'UPDATE': return 'bg-blue-400 border-blue-400';
      default: return 'bg-gray-400 border-gray-400';
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {plantIdEndpoints.map((endpoint, index) => (
        <PlantIdDialog key={index} endpoint={endpoint}>
          <Card className="hover:shadow-lg transition border cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-medium">{endpoint.title}</CardTitle>
              <span className={cn("text-xs font-bold px-2 py-1 bg-gray-200 rounded", getMethodColor(endpoint.method))}>
                {endpoint.method}
              </span>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">{endpoint.description}</p>
            </CardContent>
          </Card>
        </PlantIdDialog>
      ))}
    </div>
  );
}
