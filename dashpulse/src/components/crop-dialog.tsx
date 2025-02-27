"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useMutation, useQuery } from "convex/react";
import { api } from "$/convex/_generated/api";
import { useUser } from "@clerk/nextjs";

export default function CropForm({ open, onFinish }: { open: boolean; onFinish: () => void }) {
  console.log("CropForm rendering...");

  const user = useQuery(api.users.getCurrentUser);
  const userId = user?._id;

  console.log("user : ", user);
  console.log("userId : ", userId);

  const createCrop = useMutation(api.crops.createCrop);

  const [crops, setCrops] = useState([{ name: "", area: 0, revenue: 0 }]);

  const handleCropChange = (index: number, field: string, value: string) => {
    const newCrops = [...crops];
    newCrops[index] = { ...newCrops[index], [field]: field === "name" ? value : Number(value) };
    setCrops(newCrops);
  };

  const addCrop = () => setCrops([...crops, { name: "", area: 0, revenue: 0 }]);

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
      <DialogContent className="max-w-md p-4">
        <DialogHeader>
          <DialogTitle>Add Your Crops</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {crops.map((crop, index) => (
            <div key={index} className="flex items-center gap-2 border-b pb-2">
              <Input
                placeholder="Crop Name"
                value={crop.name}
                onChange={(e) => handleCropChange(index, "name", e.target.value)}
              />
              <Input
                placeholder="Field Area (ha)"
                type="number"
                value={crop.area.toString()}
                onChange={(e) => handleCropChange(index, "area", e.target.value)}
              />
              <Input
                placeholder="Revenue (₹)"
                type="number"
                value={crop.revenue.toString()}
                onChange={(e) => handleCropChange(index, "revenue", e.target.value)}
              />
              {crops.length > 1 && (
                <Button variant="destructive" size="icon" onClick={() => removeCrop(index)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}

          <div className="flex gap-2 mt-4">
            <Button onClick={addCrop}>Add Crop</Button>
            <Button onClick={saveCrops}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
