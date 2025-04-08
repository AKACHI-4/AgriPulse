'use client';

import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "$/convex/_generated/api";
import LocationForm from "@/components/location-dialog";
import CropForm from "@/components/crop-dialog";
import { Loader2 } from "lucide-react";

export default function ClientSetupHandler({ children }: { children: React.ReactNode }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const user = useQuery(api.users.getCurrentUser);
  const crops = useQuery(
    api.crops.getCropsByUser,
    user?._id ? { user_id: user._id } : "skip"
  );

  // Handle processing completion
  useEffect(() => {
    if (isProcessing) {
      const timeout = setTimeout(() => setIsProcessing(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [isProcessing]);

  // Show loading states
  if (user === undefined || crops === undefined) {
    return <Loader />;
  }

  if (isProcessing) {
    return <Loader />;
  }

  if (!user) {
    return <LocationForm open onNext={() => setIsProcessing(true)} />;
  }

  if (crops.length === 0) {
    return <CropForm open onFinish={() => setIsProcessing(true)} />;
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