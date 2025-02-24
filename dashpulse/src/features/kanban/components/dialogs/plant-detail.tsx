"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

export default function PlantDetail() {
  const searchParams = useSearchParams();
  const accessToken = searchParams.get("access_token");
  const [loading, setLoading] = useState(false);
  const [plantData, setPlantData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (accessToken) {
      fetchPlantDetails();
    }
  }, [accessToken]);

  const fetchPlantDetails = async () => {
    if (!accessToken) {
      setError("No access token provided.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/plantid?type=detail&token=${accessToken}`);
      if (!response.ok) throw new Error("Failed to fetch plant details.");

      const data = await response.json();
      setPlantData(data);
    } catch (err) {
      setError("Error fetching plant details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Plant Information</DialogTitle>
      </DialogHeader>

      {loading ? (
        <Skeleton className="w-full h-24" />
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : plantData ? (
        <div className="space-y-2">
          <img src={plantData.image} alt="Plant" className="w-full rounded-md" />
          <p><strong>Common Names:</strong> {plantData.common_names?.join(", ") || "N/A"}</p>
          <p><strong>Description:</strong> {plantData.description || "N/A"}</p>
          <p><strong>Taxonomy:</strong> {plantData.taxonomy || "N/A"}</p>
          <p><strong>Edible Parts:</strong> {plantData.edible_parts?.join(", ") || "None"}</p>
          <p><strong>Watering:</strong> {plantData.watering || "N/A"}</p>
        </div>
      ) : (
        <p>No plant details available.</p>
      )}

      <Button>Close</Button>
    </DialogContent>
  );
}
