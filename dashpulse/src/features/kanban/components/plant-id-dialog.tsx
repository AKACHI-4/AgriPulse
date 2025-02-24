'use client';

import { ReactNode, useState } from "react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import dynamic from "next/dynamic";
import { Endpoints, PlantIdDialogProps } from "$/types";

const dialogComponents: Record<string, React.ComponentType<{ endpoint: Endpoints }>> = {
  "Create identification": dynamic(() => import("./dialogs/create-identification")),
  "Health assessment": dynamic(() => import("./dialogs/get-identification")),
  "Retrieve identification": dynamic(() => import("./dialogs/retrieve-identification")),
  "Plants search": dynamic(() => import("./dialogs/plants-search")),
  "Plant detail": dynamic(() => import("./dialogs/plant-detail")),
};

export default function PlantIdDialog({ endpoint, children }: PlantIdDialogProps) {
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
