'use client';

import { useState, useEffect } from 'react';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter, Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { convertToBase64 } from '@/lib/utils';
import { useMutation, useQuery } from "convex/react";
import { api } from "$/convex/_generated/api";
import { ModelEndpointsInterface } from '$/types';
import { SingleImageDropzone } from '$/src/components/single-image-dropzone';
import { Card, CardContent } from '$/src/components/ui/card';

export default function PlantIdentificationDialog({ endpoint }: ModelEndpointsInterface) {
  const [image, setImage] = useState<File>();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [isCooldown, setIsCooldown] = useState(false);

  const user = useQuery(api.users.getCurrentUser);
  const userId = user?._id;

  const saveAssessment = useMutation(api.assessments.createAssessment);

  useEffect(() => {
    const lastAnalysis = localStorage.getItem("lastAnalysis");
    if (lastAnalysis && Date.now() - parseInt(lastAnalysis) < 0) {
      setIsCooldown(true);
    }
  }, []);

  const handleImageChange = (file?: File) => {
    if (!loading) setImage(file || undefined);
  };

  const handleAnalyze = async () => {
    if (!userId || !image || isCooldown) return;
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
      // console.log(data);

      setResult(data);
      setShowResultDialog(true);
      localStorage.setItem("lastAnalysis", Date.now().toString());
      setIsCooldown(true);

      // const assessmentData = {
      //   user_id: userId,
      //   model_version: data.model_version,
      //   image_url: data.input.images[0] || "",
      //   latitude: data.input.latitude,
      //   longitude: data.input.longitude,
      //   is_plant: data.result.is_plant.binary,
      //   plant_probability: data.result.is_plant.probability || 0,
      //   is_healthy: data.result.is_healthy.binary,
      //   health_probability: data.result.is_healthy.probability || 0,

      //   diseases: data.result.disease.suggestions.map((suggestion:
      //     {
      //       name: any;
      //       probability: any;
      //       details: {
      //         description: any;
      //         classification: any;
      //         common_names: any;
      //         cause: any;
      //         treatment: Record<string, string[] | undefined>;
      //       };
      //       similar_images: {
      //         id: string;
      //         url: string;
      //         url_small: string;
      //         license_name: string;
      //         license_url: string;
      //         citation: string;
      //         similarity: number;
      //       }[];
      //     }
      //   ) => ({
      //     name: suggestion.name,
      //     probability: suggestion.probability,
      //     description: suggestion.details?.description || "",
      //     classification: suggestion.details?.classification || [],
      //     common_names: suggestion.details?.common_names || [],
      //     cause: suggestion.details?.cause || "",

      //     treatment: {
      //       ...suggestion.details?.treatment?.biological && { biological: suggestion.details.treatment["biological"] },
      //       ...suggestion.details?.treatment?.chemical && { chemical: suggestion.details.treatment["chemical"] },
      //       ...suggestion.details?.treatment?.cultural && { cultural: suggestion.details.treatment["cultural"] },
      //       ...suggestion.details?.treatment?.prevention && { prevention: suggestion.details.treatment["prevention"] },
      //     },

      //     similar_images: suggestion.similar_images.map((img:
      //       {
      //         id: string;
      //         url: string;
      //         url_small: string;
      //         license_name: string;
      //         license_url: string;
      //         citation: string;
      //         similarity: number;
      //       }
      //     ) => ({
      //       id: img.id,
      //       url: img.url,
      //       url_small: img.url_small || "",
      //       license_name: img.license_name || "",
      //       license_url: img.license_url || "",
      //       citation: img.citation || "",
      //       similarity: img.similarity || 0,
      //     })),
      //   })),
      //   completed_at: data.completed,
      // };


      // await saveAssessment(assessmentData);
    } catch (error) {
      console.error('Error identifying plant:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DialogContent className="max-w-md mx-auto p-6">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold text-center">
            Plant Health Assessment
          </DialogTitle>
        </DialogHeader>
        <div className="my-2">
          <SingleImageDropzone
            value={image}
            onChange={handleImageChange}
            disabled={loading}
            dropzoneOptions={{ maxSize: 5 * 1024 * 1024 }}
          />
        </div>
        <div className="flex justify-center">
          <Button
            onClick={handleAnalyze}
            disabled={loading || !image || isCooldown}
            className="max-w-base mt-2 text-md"
          >
            {loading ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : isCooldown ? (
              "Try Again Later"
            ) : (
              "Analyze"
            )}
          </Button>
        </div>

        {loading && <p className="mt-4 text-center text-gray-600">Analyzing...</p>}
        {/* <DialogFooter className="mt-6 flex justify-center">
            <Button>Close</Button>
          </DialogFooter> */}
      </DialogContent>

      {showResultDialog && result && (
        <Dialog open={showResultDialog} onOpenChange={setShowResultDialog}>
          <DialogContent className="max-w-5xl w-full p-8">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center">
                Plant Health Assessment
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Overview */}
              <Card>
                <CardContent className="p-4">
                  <p><strong>Health probability:</strong> {result.result.is_healthy.probability}</p>
                  <p><strong>Health Status:</strong> {result.result.is_healthy.binary ? "Healthy" : "Unhealthy"}</p>
                </CardContent>
              </Card>

              {/* Diseases */}
              {result.result.disease.suggestions.map((disease: any, index: any) => (
                <Card key={index} className="mb-4">
                  <CardContent className="p-4">
                    <h3 className="text-lg font-bold">{disease.details.local_name}</h3>
                    <p>{disease.details.description}</p>
                    <h4 className="mt-2 font-semibold">Treatment:</h4>
                    <ul className="list-disc pl-5">
                      {disease.details.treatment.prevention.map((step: any, i: any) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

