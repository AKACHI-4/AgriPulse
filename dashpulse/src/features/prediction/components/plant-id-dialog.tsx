'use client';

import { ReactNode, useState } from "react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import dynamic from "next/dynamic";
import { Endpoints, ModelEndpointsInterface } from "$/types";

const dialogComponents: Record<string, React.ComponentType<{ endpoint: Endpoints }>> = {
  "Create identification": dynamic(() => import("./dialogs/create-identification")),
  "Health assessment": dynamic(() => import("./dialogs/get-identification")),
  "Disease Detection": dynamic(() => import("./dialogs/disease-detection")),
};

export default function PlantIdDialog({ endpoint, children }: ModelEndpointsInterface) {
  const [open, setOpen] = useState(false);
  const DialogComponent = dialogComponents[endpoint.title];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div onClick={() => setOpen(true)}>{children}</div>
      </DialogTrigger>
      {DialogComponent && <DialogComponent endpoint={endpoint} />}
    </Dialog>
  );
}
