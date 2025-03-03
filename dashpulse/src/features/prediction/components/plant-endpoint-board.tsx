import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { modelEndpoints } from '../utils/data';
import PlantIdDialog from './plant-id-dialog';
import { cn } from '@/lib/utils';

export default function PlantIdEndpointsBoard() {
  const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
      case 'GET': return 'bg-green-500 text-white';
      case 'POST': return 'bg-yellow-500 text-white';
      case 'DELETE': return 'bg-red-500 text-white';
      case 'UPDATE': return 'bg-blue-500 text-white';
      default: return 'bg-gray-400 text-white';
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {modelEndpoints.map((endpoint, index) => (
        <PlantIdDialog key={index} endpoint={endpoint}>
          <Card className="px-4 py-2 hover:shadow-xl transition-all duration-300 border border-gray-200 rounded-xl cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-lg font-semibold">
                {endpoint.title}
              </CardTitle>
              <span className={cn("text-xs font-semibold px-3 py-1 rounded-md", getMethodColor(endpoint.method))}>
                {endpoint.method}
              </span>
            </CardHeader>
            <CardContent>
              <div className="text-md text-gray-600 space-y-4">
                <p>{endpoint.description}</p>
                <p>
                  🔗 Source : {" "}
                  <a href={endpoint.source} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {endpoint.source}
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </PlantIdDialog>
      ))}
    </div>
  );
}
