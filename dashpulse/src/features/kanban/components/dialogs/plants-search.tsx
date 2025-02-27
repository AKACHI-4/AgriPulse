"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { PlantIdDialogProps } from "$/types";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery } from "convex/react";
import { api } from "$/convex/_generated/api";

export default function PlantSearch({ endpoint }: PlantIdDialogProps) {
  const [query, setQuery] = useState("");

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const user = useQuery(api.users.getCurrentUser);
  const userId = user?._id;

  const saveSearch = useMutation(api.searches.createSearch);

  const handleSearch = async () => {
    if (!query.trim() || !userId) return;

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const response = await fetch(`/api/plantid?endpoint=${endpoint.url}&q=${query}`, {
        method: endpoint.method,
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error("Failed to fetch plant search results.");

      const data = await response.json();
      // console.log(data);

      setResults(data);

      const searchData = {
        user_id: userId,
        entities: data.entities.map((entity:
          {
            matched_in: string;
            matched_in_type: string;
            entity_name: string;
            access_token: string;
            match_position: string;
            match_length: number;
          }
        ) => ({
          matched_in: entity.matched_in,
          matched_in_type: entity.matched_in_type,
          entity_name: entity.entity_name,
          access_token: entity.access_token,
          match_position: entity.match_position,
          match_length: entity.match_length
        })),
      };

      await saveSearch(searchData);
    } catch (err) {
      setError("Error fetching search results.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Plant Search</DialogTitle>
      </DialogHeader>

      {/* Search Input */}
      <div className="space-y-4">
        <Input
          type="text"
          placeholder="Enter plant name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button onClick={handleSearch} disabled={loading || !query.trim()}>
          {loading ? <Loader2 className="animate-spin" /> : "Search"}
        </Button>

        {error && <p className="text-red-500">{error}</p>}

        {/* Display Results */}
        {loading ? (
          <div className="flex justify-center">
            <Loader2 className="animate-spin" />
          </div>
        ) : results.length > 0 ? (
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
          <p className="text-muted-foreground">No results found.</p>
        )}
      </div>

      {/* Close Button */}
      <DialogFooter>
        <Button>Close</Button>
      </DialogFooter>
    </DialogContent>
  );
}
