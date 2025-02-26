"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { autocomplete, getPlaceDetails } from "@/lib/maps.google";
import { PlaceAutocompleteResult } from "@googlemaps/google-maps-services-js";

export default function LocationForm({ onNext }: { onNext: (location: any) => void }) {
  const [location, setLocation] = useState({ address: "", latitude: 0, longitude: 0 });
  const [predictions, setPredictions] = useState<PlaceAutocompleteResult[]>([]);
  const [input, setInput] = useState("");

  // Fetch autocomplete predictions from Google Places API
  useEffect(() => {
    const fetchPredictions = async () => {
      if (input.length < 3) return; // Prevent unnecessary API calls
      const results = await autocomplete(input);
      setPredictions(results ?? []);
    };
    fetchPredictions();
  }, [input]);

  // Handle selection of a location
  const handleSelectLocation = async (place: PlaceAutocompleteResult) => {
    const details = await getPlaceDetails(place.place_id); // Fetch place details (lat, lng)
    if (details) {
      setLocation({
        address: place.description,
        latitude: details.lat,
        longitude: details.lng,
      });
      setPredictions([]); // Clear suggestions
    }
  };

  return (
    <DialogContent classname="absolute min-h-fit">
      <DialogHeader>
        <DialogTitle>Set Your Location</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <Command>
          <CommandInput placeholder="Search location..." value={input} onValueChange={setInput} />
          <CommandList>
            <CommandEmpty>No locations found</CommandEmpty>
            <CommandGroup heading="Suggestions">
              {predictions.map((place) => (
                <CommandItem key={place.place_id} onSelect={() => handleSelectLocation(place)}>
                  {place.description}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>

        <Input placeholder="Address" value={location.address} readOnly />
        <Input placeholder="Latitude" value={location.latitude} readOnly />
        <Input placeholder="Longitude" value={location.longitude} readOnly />

        <Button onClick={() => onNext(location)}>Save & Next</Button>
      </div>
    </DialogContent>
  );
}
