"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { autocomplete, getPlaceDetails } from "@/lib/maps.google";
import { PlaceAutocompleteResult } from "@googlemaps/google-maps-services-js";
import { cn } from "@/lib/utils";
import { useMutation } from "convex/react";
import { api } from "$/convex/_generated/api";

export default function LocationForm({ open, onNext }: { open: boolean; onNext: () => void }) {
  console.log("LocationForm Rendering !!");

  const createUser = useMutation(api.users.createUser);

  const [location, setLocation] = useState({ address: "", latitude: 0.0, longitude: 0.0 });
  const [predictions, setPredictions] = useState<PlaceAutocompleteResult[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const fetchPredictions = async () => {
      if (input.length < 3) {
        setPredictions([]);
        return;
      }
      const results = await autocomplete(input);
      setPredictions(results ?? []);
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
    }
  };

  const handleSaveAndNext = async () => {
    try {
      await createUser({
        address: location.address,
        latitude: location.latitude,
        longitude: location.longitude,
      });
      onNext(); // Move to next step
    } catch (error) {
      console.error("Error saving location:", error);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-md p-4">
        <DialogHeader>
          <DialogTitle>Set Your Location</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 relative">
          <Input
            placeholder="Search location..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          {predictions.length > 0 && (
            <div className={cn("absolute z-50 w-full bg-white border border-gray-200 rounded-md shadow-md mt-1")}>
              <Command>
                <CommandList>
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
                </CommandList>
              </Command>
            </div>
          )}

          <Input placeholder="(latitude, longitude)" value={`${location.latitude}, ${location.longitude}`} readOnly />

          <Button onClick={handleSaveAndNext}>Save & Next</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
