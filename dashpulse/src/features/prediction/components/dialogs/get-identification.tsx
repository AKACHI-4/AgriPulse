'use client';

import { useState, useEffect } from 'react';
import { DialogContent, DialogHeader, DialogTitle, Dialog } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '$/src/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { convertToBase64 } from '@/lib/utils';
import { useMutation, useQuery } from "convex/react";
import { api } from "$/convex/_generated/api";
import { ModelEndpointsInterface } from '$/types';
import { SingleImageDropzone } from '$/src/components/single-image-dropzone';
import { Card, CardHeader, CardTitle, CardContent } from '$/src/components/ui/card';
import * as Sentry from "@sentry/nextjs";
// import assessment_data from "$/data/response.json";

export default function PlantIdentificationDialog({ endpoint }: ModelEndpointsInterface) {
  const COOLDOWN_PERIOD_MS = 60 * 1000;

  const [image, setImage] = useState<File | undefined>();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showResultDialog, setShowResultDialog] = useState(false);

  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  const user = useQuery(api.users.getCurrentUser);
  const userId = user?._id;

  const saveAssessment = useMutation(api.assessments.createAssessment);

  useEffect(() => {
    const lastAnalysis = localStorage.getItem("lastAnalysis");
    if (lastAnalysis) {
      const timePassed = Date.now() - parseInt(lastAnalysis);
      const remaining = COOLDOWN_PERIOD_MS - timePassed;

      if (remaining > 0) {
        setCooldownSeconds(Math.ceil(remaining / 1000));
        startCooldown(remaining);
      }
    }
  }, []);

  const startCooldown = (remainingMs = COOLDOWN_PERIOD_MS) => {
    const totalSeconds = Math.ceil(remainingMs / 1000);
    setCooldownSeconds(totalSeconds);

    const interval = setInterval(() => {
      setCooldownSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleImageChange = (file?: File) => {
    if (!loading) setImage(file || undefined);
  };

  const handleAnalyze = async () => {
    if (!userId || !image || cooldownSeconds > 0) return;
    setLoading(true);
    setResult(null);

    try {
      const base64String = await convertToBase64(image);

      const response = await fetch(`/api/plantid?endpoint=${endpoint.url}&details=local_name,description,url,treatment,classification,common_names,cause`, {
        method: endpoint.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          images: [base64String],
          latitude: user?.latitude,
          longitude: user?.longitude,
          similar_images: true
        }),
      });
      if (!response.ok) throw new Error("Failed to fetch plant health assessment results.");

      const data = await response.json();
      // const data = assessment_data;
      // console.log(data);

      setImage(undefined);
      setResult(data);
      setShowResultDialog(true);
      localStorage.setItem("lastAnalysis", Date.now().toString());
      startCooldown();

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
      Sentry.captureException(`error identifying plant : ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DialogContent className="max-w-md mx-auto p-6">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold text-center">
            Health Assessment
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
            disabled={loading || !image || cooldownSeconds > 0}
            className="max-w-base mt-2 text-md"
          >
            {loading ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : cooldownSeconds > 0 ? (
              `${cooldownSeconds}s`
            ) : (
              "Analyze"
            )}
          </Button>
        </div>

        {/* {loading && <p className="mt-4 text-center text-gray-600">Analyzing...</p>} */}
        {/* <DialogFooter className="mt-6 flex justify-center">
            <Button>Close</Button>
          </DialogFooter> */}
      </DialogContent>

      {showResultDialog && result && (
        <Dialog open={showResultDialog} onOpenChange={setShowResultDialog}>
          <DialogContent className="max-w-3xl p-8 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center mb-4">
                Health Assessment
              </DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="grid w-full grid-cols-2 h-fit">
                <TabsTrigger value="summary" className='text-base font-medium'>Summary</TabsTrigger>
                <TabsTrigger value="diseases" className='text-base font-medium'>Diseases / Suggestions</TabsTrigger>
              </TabsList>

              {/* Summary Tab */}
              <TabsContent value="summary">
                <Card>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                      {/* Left Side: Text Summary */}
                      <div className="space-y-3 text-base text-gray-800">
                        <p><strong>Health Status :</strong> {result.result.is_healthy.binary ? "🌿 Healthy" : "⚠️ Unhealthy"}</p>
                        <p><strong>Health Confidence :</strong> {(result.result.is_healthy.probability * 100).toFixed(2)}%</p>
                        <p><strong>Plant Confidence :</strong> {(result.result.is_plant.probability * 100).toFixed(2)}%</p>
                        <p><strong>Latitude :</strong> {result.input.latitude}</p>
                        <p><strong>Longitude :</strong> {result.input.longitude}</p>
                        <p><strong>Model :</strong> {result.model_version}</p>
                      </div>

                      {/* Right Side: Image Preview */}
                      <div>
                        <div className="rounded-lg overflow-hidden shadow">
                          <img
                            src={result.input.images[0]}
                            alt="Captured plant"
                            className="object-cover w-full"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="diseases">
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                  {result.result.disease.suggestions.map((disease: any, index: number) => (
                    <Card key={index}>
                      <CardHeader className="p-4">
                        <CardTitle className="text-lg text-gray-900 capitalize">
                          {disease.details.local_name || "Unknown Disease"}
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="p-4 pt-0 space-y-3 text-base text-gray-800">
                        {/* Description */}
                        <p className="leading-relaxed">{disease.details.description || "No description available."}</p>

                        {/* Prevention Tips */}
                        {disease.details.treatment?.prevention?.length > 0 && (
                          <div>
                            <p className="font-semibold text-gray-900 mb-1">Prevention Tips :</p>
                            <ul className="list-disc pl-6 space-y-1">
                              {disease.details.treatment.prevention.map((step: string, i: number) => (
                                <li key={i}>{step}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Similar Images */}
                        {disease.similar_images?.length > 0 && (
                          <div>
                            <p className="font-semibold text-gray-900 mb-2">Related Images :</p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                              {disease.similar_images.map((img: any, i: number) => (
                                <img
                                  key={i}
                                  src={img.url}
                                  alt={`Disease ${index} Image ${i}`}
                                  className="rounded-md object-cover w-full h-32 shadow"
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}