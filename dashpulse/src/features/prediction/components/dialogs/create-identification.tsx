"use client";

import { useState, useEffect } from "react";
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { convertToBase64 } from "@/lib/utils";
import { ModelEndpointsInterface } from "$/types";
import { useMutation, useQuery } from "convex/react";
import { api } from "$/convex/_generated/api";
import { Dialog } from "@/components/ui/dialog";
import { SingleImageDropzone } from "$/src/components/single-image-dropzone";
import * as Sentry from "@sentry/nextjs";
import Image from "next/image";
// import data from "$/data/response.json";

export default function PlantIdentificationDialog({ endpoint }: ModelEndpointsInterface) {
  const [image, setImage] = useState<File>();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [isCooldown, setIsCooldown] = useState(false);

  const user = useQuery(api.users.getCurrentUser);
  const userId = user?._id;

  const saveIdentification = useMutation(api.identifications.createIdentification);

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
      // console.log(data);

      setResult(data);
      setShowResultDialog(true);
      localStorage.setItem("lastAnalysis", Date.now().toString());
      setIsCooldown(true);

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

      {/* Result Dialog */}
      {showResultDialog && result && (
        <Dialog open={showResultDialog} onOpenChange={setShowResultDialog}>
          <DialogContent className="max-w-5xl w-full p-8">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center">
                Plant Identification
              </DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-12 gap-8 mt-6">
              {/* Left Panel: Key Info */}
              <div className="col-span-3 space-y-3 border-r pr-4">
                <p className="text-md text-gray-700">
                  <span className="font-semibold text-black">Common Name :</span>{" "}
                  {result.result.classification.suggestions[0]?.details?.common_names?.[0] || "N/A"}
                </p>
                <p className="text-md text-gray-700">
                  <span className="font-semibold text-black">Scientific Name :</span>{" "}
                  {result.result.classification.suggestions[0]?.name || "N/A"}
                </p>
                <p className="text-md text-gray-700">
                  <span className="font-semibold text-black">Probability:</span>{" "}
                  {(result.result.is_plant.probability * 100).toFixed(2)}%
                </p>
                <p className="text-md text-gray-700">
                  <span className="font-semibold text-black">Genus:</span>{" "}
                  {result.result.classification.suggestions[0]?.details?.taxonomy?.genus || "N/A"}
                </p>
                <p className="text-md text-gray-700">
                  <span className="font-semibold text-black">Family:</span>{" "}
                  {result.result.classification.suggestions[0]?.details?.taxonomy?.family || "N/A"}
                </p>
                <p className="text-md text-gray-700">
                  <span className="font-semibold text-black">Rank:</span>{" "}
                  {result.result.classification.suggestions[0]?.details?.rank || "N/A"}
                </p>
                <p className="text-md text-gray-700">
                  <span className="font-semibold text-black">Learn More:</span>{" "}
                  <a
                    href={result.result.classification.suggestions[0]?.details?.url || "#"}
                    target="_blank"
                    className="text-blue-600 hover:underline"
                  >
                    Wikipedia
                  </a>
                </p>
              </div>

              {/* Center Panel: Main Image */}
              <div className="col-span-5">
                <Image
                  src={result.result.classification.suggestions[0]?.details?.image?.value || ""}
                  alt="Plant"
                  className="overflow-hidden rounded-lg w-full max-h-72 object-cover shadow-lg"
                />
              </div>

              {/* Right Panel: Similar Images */}
              <div className="col-span-4 space-y-6">
                {result.result.classification.suggestions[0]?.similar_images.map(
                  (img: any, index: number) => (
                    <div key={index} className="overflow-hidden rounded-lg object-cover shadow-lg">
                      <Image
                        src={img.url}
                        alt={`Similar Plant ${index}`}
                        className="w-full max-h-32 object-cover transform hover:scale-105 transition duration-200"
                      />
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Description Footer */}
            <div className="border-t">
              <p className="mt-4 text-md text-gray-700">
                {result.result.classification.suggestions[0]?.details?.description?.value ||
                  "No description available"}
              </p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
