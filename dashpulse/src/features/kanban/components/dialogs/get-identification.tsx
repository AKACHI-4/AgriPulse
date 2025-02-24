"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function HealthAssessment() {
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!image) {
      toast.error("Please upload an image.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await fetch("/api/plantid?type=health", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to analyze plant health");

      const data = await response.json();
      setResult(data);
      toast.success("Analysis complete!");
    } catch (error) {
      toast.error("Failed to analyze plant health. Try again.");
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
        <Label>Upload Image</Label>
        <Input type="file" accept="image/*" onChange={handleImageChange} />
        <Button onClick={handleAnalyze} disabled={loading}>
          {loading ? "Analyzing..." : "Analyze"}
        </Button>
      </div>
      {result ? (
        <pre className="text-sm mt-4 border p-2 rounded">{JSON.stringify(result, null, 2)}</pre>
      ) : (
        <p className="mt-4 text-muted-foreground">No results available</p>
      )}
      <Button>Okay</Button>
    </DialogContent>
  );
}
