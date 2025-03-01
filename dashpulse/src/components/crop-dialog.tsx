"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useMutation, useQuery } from "convex/react";
import { api } from "$/convex/_generated/api";

export default function CropForm({ open, onFinish }: { open: boolean; onFinish: () => void }) {
  const user = useQuery(api.users.getCurrentUser);
  const userId = user?._id;

  const createCrop = useMutation(api.crops.createCrop);

  const [crops, setCrops] = useState([{ name: "", area: 0, revenue: 0, production: 0 }]);

  const handleCropChange = (index: number, field: string, value: string) => {
    const newCrops = [...crops];
    newCrops[index] = { ...newCrops[index], [field]: field === "name" ? value : Number(value) };
    setCrops(newCrops);
  };

  const addCrop = () => {
    if (crops.length < 10) {
      setCrops([...crops, { name: "", area: 0, revenue: 0, production: 0 }]);
    }
  };
  const removeCrop = (index: number) => setCrops(crops.filter((_, i) => i !== index));

  const saveCrops = async () => {
    if (!userId) {
      console.error("Convex User ID is missing");
      return;
    }
    await Promise.all(crops.map((crop) => createCrop({ user_id: userId, ...crop })));
    onFinish();
  };

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-2xl p-6 rounded-lg shadow-lg">
        <DialogHeader className="flex flex-col items-center">
          <DialogTitle className="text-xl font-semibold">Add Your Crops</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {crops.map((crop, index) => (
            <div key={index} className="flex items-center gap-3">
              <Input
                placeholder="Crop"
                value={crop.name}
                onChange={(e) => handleCropChange(index, "name", e.target.value)}
                className="p-3 border border-gray-300 rounded-md"
              />
              <Input
                placeholder="Field Area (ha)"
                type="number"
                value={crop.area || ""}
                onChange={(e) => handleCropChange(index, "area", e.target.value)}
                className="p-3 border border-gray-300 rounded-md"
              />
              <Input
                placeholder="Revenue (₹)"
                type="number"
                value={crop.revenue || ""}
                onChange={(e) => handleCropChange(index, "revenue", e.target.value)}
                className="p-3 border border-gray-300 rounded-md"
              />
              <Input
                placeholder="Production (kg)"
                type="number"
                value={crop.production || ""}
                onChange={(e) => handleCropChange(index, "production", e.target.value)}
                className="p-3 border border-gray-300 rounded-md"
              />

              {crops.length > 1 && (
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => removeCrop(index)}
                  className="self-end px-2"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}

          <div className="flex justify-center gap-3 mt-6">
            <Button onClick={addCrop} className="px-5 py-3 text-base font-semibold bg-primary text-white rounded-md">
              Add Crop
            </Button>
            <DialogClose asChild>
              <Button onClick={saveCrops} className="px-5 py-3 text-base font-semibold bg-primary text-white rounded-md">
                Save
              </Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
