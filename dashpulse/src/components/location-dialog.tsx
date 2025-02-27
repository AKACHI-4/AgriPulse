"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { autocomplete, getPlaceDetails } from "@/lib/maps.google";
import { PlaceAutocompleteResult } from "@googlemaps/google-maps-services-js";
import { cn } from "@/lib/utils";
import { useMutation } from "convex/react";
import { api } from "$/convex/_generated/api";

export default function LocationForm({ open, onNext }: { open: boolean; onNext: () => void }) {
  // console.log("LocationForm Rendering !!");

  const createUser = useMutation(api.users.createUser);

  const [location, setLocation] = useState({ address: "", latitude: 0.0, longitude: 0.0 });
  const [predictions, setPredictions] = useState<PlaceAutocompleteResult[]>([]);
  const [input, setInput] = useState("");
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    if (input.length < 3 || selected) {
      setPredictions([]);
      setSelected(false);
      return;
    }

    const fetchPredictions = async () => {
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
      setSelected(true); // Mark as selected
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
    <Dialog open={open}>
      <DialogContent className="max-w-md p-6 rounded-lg shadow-lg">
        <DialogHeader className="flex flex-col items-center">
          <DialogTitle className="text-xl font-semibold">Set Your Location</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 relative">
          <Input
            placeholder="Search location..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="border border-gray-300 focus:border-primary rounded-md"
          />

          {predictions.length > 0 && (
            <div className="absolute z-50 w-full bg-white border border-gray-200 rounded-md shadow-md mt-2">
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

          <Input
            placeholder="( lat, lon )"
            value={
              location.latitude || location.longitude
                ? `${location.latitude}, ${location.longitude}`
                : ""
            }
            readOnly
            className="border border-gray-300 rounded-md my-2 bg-gray-100"
          />

          <div className="flex justify-center">
            <DialogClose asChild>
              <Button
                onClick={handleSaveAndNext}
                className="px-5 py-3 text-base font-semibold bg-primary text-white rounded-md hover:bg-primary/90"
              >
                Save
              </Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
