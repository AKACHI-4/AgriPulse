"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

export default function RetrieveIdentification() {
  const [accessToken, setAccessToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRetrieve = async () => {
    if (!accessToken.trim()) return;

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch(`/api/plantid?type=retrieve&access_token=${accessToken}`);
      if (!response.ok) throw new Error("Failed to retrieve identification.");

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError("Error fetching identification.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Identification Details</DialogTitle>
      </DialogHeader>
      {data ? (
        <div className="space-y-2">
          <p><strong>Common Name:</strong> {data.common_name || "N/A"}</p>
          <p><strong>Scientific Name:</strong> {data.taxonomy?.scientific_name || "N/A"}</p>
          {data.image && (
            <img src={data.image} alt="Plant" className="w-full h-auto rounded-md" />
          )}
          <p><strong>Description:</strong> {data.description || "No description available."}</p>
          <p><strong>Edible Parts:</strong> {data.edible_parts?.join(", ") || "N/A"}</p>
          <p><strong>Watering:</strong> {data.watering || "N/A"}</p>
        </div>
      ) : (
        <p>No identification details found.</p>
      )}
      <Button>Close</Button>
    </DialogContent>
  );
}
