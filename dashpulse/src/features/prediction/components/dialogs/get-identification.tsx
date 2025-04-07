'use client';

import { useState } from 'react';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { convertToBase64 } from '@/lib/utils';
import { useMutation, useQuery } from "convex/react";
import { api } from "$/convex/_generated/api";
import { ModelEndpointsInterface } from '$/types';

export default function PlantIdentificationDialog({ endpoint }: ModelEndpointsInterface) {
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const user = useQuery(api.users.getCurrentUser);
  const userId = user?._id;
  // console.log("userId : ", userId);

  const saveAssessment = useMutation(api.assessments.createAssessment);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!userId || !image) return;
    setLoading(true);
    setResult(null);

    try {
      const base64String = await convertToBase64(image);

      const response = await fetch(`/api/plantid?endpoint=${endpoint.url}&details=local_name,description,url,treatment,classification,common_names,cause`, {
        method: endpoint.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images: [base64String], similar_images: true }),
      });
      if (!response.ok) throw new Error("Failed to fetch plant health assessment results.");

      const data = await response.json();
      console.log(data);

      setResult(data);

      const assessmentData = {
        user_id: userId,
        model_version: data.model_version,
        image_url: data.input.images[0] || "",
        latitude: data.input.latitude,
        longitude: data.input.longitude,
        is_plant: data.result.is_plant.binary,
        plant_probability: data.result.is_plant.probability || 0,
        is_healthy: data.result.is_healthy.binary,
        health_probability: data.result.is_healthy.probability || 0,

        diseases: data.result.disease.suggestions.map((suggestion:
          {
            name: any;
            probability: any;
            details: {
              description: any;
              classification: any;
              common_names: any;
              cause: any;
              treatment: Record<string, string[] | undefined>;
            };
            similar_images: {
              id: string;
              url: string;
              url_small: string;
              license_name: string;
              license_url: string;
              citation: string;
              similarity: number;
            }[];
          }
        ) => ({
          name: suggestion.name,
          probability: suggestion.probability,
          description: suggestion.details?.description || "",
          classification: suggestion.details?.classification || [],
          common_names: suggestion.details?.common_names || [],
          cause: suggestion.details?.cause || "",

          treatment: {
            ...suggestion.details?.treatment?.biological && { biological: suggestion.details.treatment["biological"] },
            ...suggestion.details?.treatment?.chemical && { chemical: suggestion.details.treatment["chemical"] },
            ...suggestion.details?.treatment?.cultural && { cultural: suggestion.details.treatment["cultural"] },
            ...suggestion.details?.treatment?.prevention && { prevention: suggestion.details.treatment["prevention"] },
          },

          similar_images: suggestion.similar_images.map((img:
            {
              id: string;
              url: string;
              url_small: string;
              license_name: string;
              license_url: string;
              citation: string;
              similarity: number;
            }
          ) => ({
            id: img.id,
            url: img.url,
            url_small: img.url_small || "",
            license_name: img.license_name || "",
            license_url: img.license_url || "",
            citation: img.citation || "",
            similarity: img.similarity || 0,
          })),
        })),
        completed_at: data.completed,
      };


      await saveAssessment(assessmentData);
    } catch (error) {
      console.error('Error identifying plant:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Plant Health Assessment</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <Label>Select Image</Label>
        <Input type="file" accept="image/*" onChange={handleFileChange} />
        <Button onClick={handleAnalyze} disabled={loading || !image}>
          {loading ? <Loader2 className="animate-spin" /> : 'Analyze'}
        </Button>
      </div>
      {loading && <p>Analyzing...</p>}
      {result ? (
        <pre className="text-sm mt-4 border p-2 rounded">{JSON.stringify(result, null, 2)}</pre>
      ) : (
        <p className="mt-4 text-muted-foreground">No results available</p>
      )}
      <DialogFooter>
        <Button>Okay</Button>
      </DialogFooter>
    </DialogContent>
  );
}