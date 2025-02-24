"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

export default function PlantSearch() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const response = await fetch(`/api/plantid?type=search&q=${query}`);
      if (!response.ok) throw new Error("Failed to fetch plant search results.");

      const data = await response.json();
      setResults(data || []);
    } catch (err) {
      setError("Error fetching search results.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Search Results</DialogTitle>
      </DialogHeader>
      {results.length > 0 ? (
        <ul className="space-y-2">
          {results.map((plant, index) => (
            <li key={index} className="flex items-center space-x-4 border-b pb-2">
              {plant.thumbnail ? (
                <img
                  src={`data:image/png;base64,${plant.thumbnail}`}
                  alt="Thumbnail"
                  className="w-12 h-12 rounded-md"
                />
              ) : (
                <Skeleton className="w-12 h-12 rounded-md" />
              )}
              <div>
                <p className="font-semibold">{plant.common_name || "Unknown"}</p>
                <p className="text-sm text-gray-500">{plant.scientific_name}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No results found.</p>
      )}
      <Button>Close</Button>
    </DialogContent>
  );
}
