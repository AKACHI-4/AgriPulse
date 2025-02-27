"use client";

import { useState } from "react";
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { convertToBase64 } from "@/lib/utils";
import { PlantIdDialogProps } from "$/types";
import { useMutation, useQuery } from "convex/react";
import { api } from "$/convex/_generated/api";
import data from "$/data/response.json"

export default function PlantIdentificationDialog({ endpoint }: PlantIdDialogProps) {
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const user = useQuery(api.users.getCurrentUser);
  const userId = user?._id;
  // console.log("userId : ", userId);

  const saveIdentification = useMutation(api.identifications.createIdentification);

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
      // console.log("data : ", data);

      setResult(data);

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
            url: string;
            similarity: number;
            citation: string;
          }) => ({
            url: image.url || "",
            similarity: image.similarity || 0,
            citation: image.citation || "",
          })
        )
      };

      await saveIdentification(identificationData);

      // console.log("Plant identification saved!");
    } catch (error) {
      console.error("Error identifying plant:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Identify Plant</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <Label>Select Image</Label>
        <Input type="file" accept="image/*" onChange={handleFileChange} />
        <Button onClick={handleAnalyze} disabled={loading || !image}>
          {loading ? <Loader2 className="animate-spin" /> : "Analyze"}
        </Button>
      </div>
      {loading && <p>Analyzing...</p>}
      {result && (
        <div className="mt-4 border p-4 rounded">
          <p>
            <strong>Plant Name:</strong> {result.classification?.suggestions?.[0]?.name || "N/A"}
          </p>
          <p>
            <strong>Scientific Name:</strong> {result.classification?.suggestions?.[0]?.details?.entity_id || "N/A"}
          </p>
          <p>
            <strong>Probability:</strong> {result.probability || "No description available"}
          </p>
        </div>
      )}
      <DialogFooter>
        <Button>Okay</Button>
      </DialogFooter>
    </DialogContent>
  );
}
