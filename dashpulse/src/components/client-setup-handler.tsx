'use client';

import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "$/convex/_generated/api";
import LocationForm from "@/components/location-dialog";
import CropForm from "@/components/crop-dialog";
import { Loader2 } from "lucide-react";

export default function ClientSetupHandler({ children }: { children: React.ReactNode }) {
  const user = useQuery(api.users.getCurrentUser);
  const crops = useQuery(
    api.crops.getCropsByUser,
    user?._id ? { user_id: user._id } : "skip"
  );

  if (user === undefined) {
    return <Loader />;
  }

  if (!user) {
    return <LocationForm open onNext={() => { }} />;
  }

  if (crops === undefined) {
    return <Loader />;
  }

  if (crops.length === 0) {
    return <CropForm open onFinish={() => { }} />;
  }

  return children;
}

function Loader() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Loader2 className="animate-spin text-gray-500" size={32} />
    </div>
  );
}