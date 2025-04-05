"use client";

import React from "react";
import { Dialog } from "@/components/ui/dialog";
import LocationForm from "@/components/location-dialog";
import CropForm from "@/components/crop-dialog";

export default function UserSetupDialog({ onSetupComplete }: { onSetupComplete: () => void }) {
  const [step, setStep] = React.useState<"location" | "crops">("location");
  const [open, setOpen] = React.useState(true);

  const handleLocationSubmit = () => {
    setStep("crops");
  };

  const handleCropSubmit = () => {
    setOpen(false);
    onSetupComplete();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {step === "location" && <LocationForm onNext={handleLocationSubmit} open={false} />}
      {step === "crops" && <CropForm onFinish={handleCropSubmit} open={false} />}
    </Dialog>
  );
}
