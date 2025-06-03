"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import LocationForm from "@/components/location-dialog";

export function UpdateLocation() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="bg-primary text-white hover:bg-primary/90"
        disabled={loading}
      >
        {loading ? "Updating..." : "Update Location"}
      </Button>

      <LocationForm
        open={open}
        onNext={() => setOpen(false)}
        loading={loading}
        setLoading={setLoading}
      />
    </>
  );
}
