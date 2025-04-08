"use client";

import { useState, useEffect, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "$/convex/_generated/api";
import LocationForm from "@/components/location-dialog";
import CropForm from "@/components/crop-dialog";
import { Loader2 } from "lucide-react";

export default function ClientSetupHandler({ children }: { children: React.ReactNode }) {
  const user = useQuery(api.users.getCurrentUser);
  const rawCrops = useQuery(
    api.crops.getCropsByUser,
    user ? { user_id: user._id } : "skip"
  );

  const crops = useMemo(() => rawCrops ?? [], [rawCrops]);

  const [setupStep, setSetupStep] = useState<"loading" | "location" | "crops" | "done">("loading");

  useEffect(() => {
    // Check if queries are still loading
    if (user === undefined || rawCrops === undefined) return;

    if (!user) {
      setSetupStep("location");
    } else if (rawCrops.length === 0) {
      setSetupStep("crops");
    } else {
      setSetupStep("done");
    }
  }, [user, rawCrops]);

  if (user === undefined || rawCrops === undefined || setupStep === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin text-gray-500" size={32} />
      </div>
    );
  }

  return (
    <>
      {setupStep === "location" && (
        <LocationForm open={setupStep === "location"} onNext={() => setSetupStep("crops")} />
      )}
      {setupStep === "crops" && (
        <CropForm open={setupStep === "crops"} onFinish={() => setSetupStep("done")} />
      )}
      {setupStep === "done" && children}
    </>
  );
}