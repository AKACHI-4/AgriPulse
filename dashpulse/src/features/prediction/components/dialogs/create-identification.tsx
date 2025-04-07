"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "$/src/components/ui/tabs";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "$/src/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { convertToBase64 } from "@/lib/utils";
import { ModelEndpointsInterface } from "$/types";
import { useMutation, useQuery } from "convex/react";
import { api } from "$/convex/_generated/api";
import { Dialog } from "@/components/ui/dialog";
import { SingleImageDropzone } from "$/src/components/single-image-dropzone";
import * as Sentry from "@sentry/nextjs";

export default function PlantIdentificationDialog({ endpoint }: ModelEndpointsInterface) {
  const COOLDOWN_PERIOD_MS = 60 * 1000;

  const [image, setImage] = useState<File | undefined>();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showResultDialog, setShowResultDialog] = useState(false);

  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  const user = useQuery(api.users.getCurrentUser);
  const userId = user?._id;

  const saveIdentification = useMutation(api.identifications.createIdentification);

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

      const response = await fetch(
        `/api/plantid?endpoint=${endpoint.url}&details=common_names,url,description,taxonomy,rank,gbif_id,inaturalist_id,image,synonyms,edible_parts,watering,propagation_methods`,
        {
          method: endpoint.method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            images: [base64String],
            latitude: user?.latitude,
            longitude: user?.longitude,
            similar_images: true
          }),
        }
      );
      const data = await response.json();
      // const data = identification_data;
      // console.log(data);

      setImage(undefined);
      setResult(data);
      setShowResultDialog(true);
      localStorage.setItem("lastAnalysis", Date.now().toString());
      startCooldown();

      const identificationData = {
        user_id: userId,
        model_version: data.model_version,
        latitude: data.input.latitude,
        longitude: data.input.longitude,
        image_url: data.input.images[0] || "",
        is_plant: data.result.is_plant.binary,
        plant_name: data.result.classification.suggestions[0]?.name || "Unknown",
        probability: data.result.is_plant.probability || 0,
        details: {
          taxonomy: data.result.classification.suggestions[0]?.details?.taxonomy || {},
          common_names: data.result.classification.suggestions[0]?.details?.common_names || [],
          synonyms: data.result.classification.suggestions[0]?.details?.synonyms || [],
          rank: data.result.classification.suggestions[0]?.details?.rank || "",
          description: {
            value: data.result.classification.suggestions[0]?.details?.description?.value || "",
            citation: data.result.classification.suggestions[0]?.details?.description?.citation || "",
          },
          external_links: {
            wikipedia: data.result.classification.suggestions[0]?.details?.url || "",
            gbif_id: data.result.classification.suggestions[0]?.details?.gbif_id || 0,
            inaturalist_id: data.result.classification.suggestions[0]?.details?.inaturalist_id || 0,
          },
          image: {
            value: data.result.classification.suggestions[0]?.details?.image?.value || "",
            citation: data.result.classification.suggestions[0]?.details?.image?.citation || "",
          },
        },
        similar_images: data.result.classification.suggestions[0]?.similar_images.map(
          (image: {
            id: string;
            url: string;
            similarity: number;
            url_small: string;
            license_name?: string;
            license_url?: string;
            citation?: string;
          }) => ({
            url: image.url || "",
            similarity: image.similarity || 0,
            citation: image.citation ?? "",
          })
        )
      };

      await saveIdentification(identificationData);

    } catch (error) {
      // console.error("Error identifying plant:", error);
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
            Plant Identification
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

      {/* Result Dialog */}
      {showResultDialog && result && (
        <Dialog open={showResultDialog} onOpenChange={setShowResultDialog}>
          <DialogContent className="max-w-3xl p-8 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center mb-4">
                Plant Identification
              </DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="grid w-full grid-cols-2 h-fit">
                <TabsTrigger value="summary" className="text-base font-medium">Summary</TabsTrigger>
                <TabsTrigger value="details" className="text-base font-medium">Classification</TabsTrigger>
              </TabsList>

              {/* Summary Tab */}
              <TabsContent value="summary">
                <Card>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                      {/* Text Summary */}
                      <div className="space-y-3 text-base text-gray-800">
                        <p><strong>Is Plant :</strong>{result.result.is_plant.binary ? "🌱 Yes" : "🚫 No"}</p>
                        <p><strong>Plant Confidence :</strong> {(result.result.is_plant.probability * 100).toFixed(2)}%</p>
                        <p><strong>Latitude :</strong> {result.input.latitude}</p>
                        <p><strong>Longitude :</strong> {result.input.longitude}</p>
                        <p><strong>Model :</strong> {result.model_version}</p>
                      </div>

                      {/* Image */}
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

              {/* classification Tab */}
              <TabsContent value="details">
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                  {result.result.classification.suggestions.map((classification: any, index: number) => (
                    <Card key={index}>
                      <CardHeader className="p-4">
                        <CardTitle className="text-lg text-gray-900 capitalize">
                          {classification.name || "Unknown Plant"}
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="space-y-3 pt-0 p-4 text-base text-gray-800">
                        {/* Description */}
                        {classification.details.description?.value && (
                          <div>
                            <p className="font-semibold">Description:</p>
                            <p>{classification.details.description.value}</p>

                            {classification.details.description.citation && (
                              <p className="mt-1 text-gray-800">
                                <strong>Source :</strong>{" "}
                                <a href={classification.details.description.citation} target="_blank" rel="noreferrer" className="underline text-blue-600">
                                  {classification.details.description.citation}
                                </a>
                              </p>
                            )}
                          </div>
                        )}

                        {/* Taxonomy */}
                        {classification.details.taxonomy && (
                          <div>
                            <p className="font-semibold">Taxonomy</p>
                            <ul className="list-disc pl-6 capitalize">
                              {Object.entries(classification.details.taxonomy).map(([key, value]) => (
                                <li key={key}><strong>{key} :</strong> {String(value)}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Common Names */}
                        {classification.details.common_names?.length > 0 && (
                          <div>
                            <strong>Common Names :</strong>{" "}
                            <span className="capitalize">{classification.details.common_names.join(", ")}</span>
                          </div>
                        )}

                        {/* Synonyms */}
                        {classification.details.synonyms?.length > 0 && (
                          <div>
                            <strong>Synonyms :</strong>{" "}
                            <span className="capitalize">{classification.details.synonyms.join(", ")}</span>
                          </div>
                        )}

                        {/* External Links */}
                        {classification.details.url && (
                          <div>
                            <strong>External Links :</strong>{" "}
                            <span><a href={classification.details.url} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                              Wikipedia
                            </a></span>
                          </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-6 text-base">
                          {/* Main Image */}
                          {classification.details.image?.value && (
                            <div className="flex-1 max-w-4xl">
                              <p className="font-semibold mb-2">Reference Image</p>
                              <a
                                href={classification.details.image.citation}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <img
                                  src={classification.details.image.value}
                                  alt="Plant reference"
                                  className="rounded-md shadow w-full h-auto max-h-64 object-cover"
                                />
                              </a>
                            </div>
                          )}

                          {/* Similar Images */}
                          {classification.similar_images.length > 0 && (
                            <div className="flex-1">
                              <p className="font-semibold mb-2">Similar Images:</p>
                              <div className="space-y-4">
                                {classification.similar_images.map(
                                  (
                                    img: any,
                                    i: number
                                  ) => (
                                    <div key={i}>
                                      <a
                                        href={img.license_url || "#"}
                                        target="_blank"
                                        rel="noreferrer"
                                      >
                                        <img
                                          src={img.url}
                                          alt={`Similar ${i}`}
                                          className="rounded-md object-cover w-full h-28 shadow cursor-pointer hover:opacity-90 transition"
                                        />
                                      </a>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          )}
                        </div>
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
