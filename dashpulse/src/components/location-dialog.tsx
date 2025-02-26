"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { autocomplete, getPlaceDetails } from "@/lib/maps.google";
import { PlaceAutocompleteResult } from "@googlemaps/google-maps-services-js";
import { cn } from "@/lib/utils"; // For merging classNames

import { useMutation } from "convex/react";
import { api } from "$/convex/_generated/api";

export default function LocationForm({ onNext }: { onNext: () => void }) {
  const createUser = useMutation(api.users.createUser);

  const [location, setLocation] = useState({ address: "", latitude: 0.00, longitude: 0.00 });
  const [predictions, setPredictions] = useState<PlaceAutocompleteResult[]>([]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchPredictions = async () => {
      if (input.length < 3) {
        setPredictions([]);
        return;
      }
      const results = await autocomplete(input);
      setPredictions(results ?? []);
      setOpen(results.length > 0);
    };

    fetchPredictions();
  }, [input]);

  const handleSelectLocation = async (place: PlaceAutocompleteResult) => {
    const details = await getPlaceDetails(place.place_id);
    if (details) {
      setLocation({
        address: place.description,
        latitude: details.lat,
        longitude: details.lng,
      });
      setInput(place.description);
      setPredictions([]);
      setOpen(false);
    }
  };

  const handleSaveAndNext = async () => {
    try {
      await createUser({
        address: location.address,
        latitude: location.latitude,
        longitude: location.longitude,
      });
      onNext();
    } catch (error) {
      console.error("Error saving location:", error);
    }
  };

  return (
    <DialogContent className="max-w-md p-4">
      <DialogHeader>
        <DialogTitle>Set Your Location</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 relative">
        {/* Search Input */}
        <Input
          placeholder="Search location..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => setOpen(predictions.length > 0)}
        />

        {open && (
          <div className={cn("absolute z-50 w-full bg-white border border-gray-200 rounded-md shadow-md mt-1")}>
            <Command>
              <CommandList>
                {predictions.length === 0 ? (
                  <CommandEmpty>No locations found</CommandEmpty>
                ) : (
                  <CommandGroup heading="Suggestions">
                    {predictions.map((place) => (
                      <CommandItem
                        key={place.place_id}
                        onSelect={() => handleSelectLocation(place)}
                        className="cursor-pointer px-3 py-2 hover:bg-gray-100"
                      >
                        {place.description}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          </div>
        )}

        <Input placeholder="(latitude, longitude)" value={`${location.latitude}, ${location.longitude}`} readOnly />

        <Button onClick={handleSaveAndNext}>Save & Next</Button>
      </div>
    </DialogContent>
  );
}
