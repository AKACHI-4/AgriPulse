"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import CropForm from "@/components/crop-dialog";

export function UpdateCrop() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="bg-primary text-white hover:bg-primary/90"
        disabled={loading}
      >
        {loading ? "Updating..." : "Update Crops"}
      </Button>

      <CropForm
        open={open}
        onFinish={() => setOpen(false)}
        loading={loading}
        setLoading={setLoading}
        enableClose={true}
      />
    </>
  );
}
