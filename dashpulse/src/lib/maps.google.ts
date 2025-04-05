"use server";

import { Client } from "@googlemaps/google-maps-services-js";
import * as Sentry from "@sentry/nextjs";

const client = new Client();

export const autocomplete = async (input: string) => {
  if (!input) return [];

  try {
    const response = await client.placeAutocomplete({
      params: {
        input,
        key: process.env.GOOGLEMAPS_API_KEY!,
      },
    });

    return response.data.predictions;
  } catch (error) {
    // console.error("Error fetching autocomplete results:", error);
    Sentry.captureException(`error fetching autocomplete results : ${error}`);
    return [];
  }
};

export const getPlaceDetails = async (placeId: string) => {
  if (!placeId) return null;

  try {
    const response = await client.placeDetails({
      params: {
        place_id: placeId,
        fields: ["geometry"],
        key: process.env.GOOGLEMAPS_API_KEY!,
      },
    });

    const location = response.data.result?.geometry?.location;

    return location ? { lat: location.lat, lng: location.lng } : null;
  } catch (error) {
    // console.error("Error fetching place details:", error);
    Sentry.captureException(`error fetching place details : ${error}`);
    return null;
  }
};
