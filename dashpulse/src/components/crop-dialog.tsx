"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useMutation, useQuery } from "convex/react";
import { api } from "$/convex/_generated/api";
import * as Sentry from "@sentry/nextjs";
import { Crop } from "$/types";
import { Id } from "$/convex/_generated/dataModel";

export default function CropForm({
  open,
  onFinish,
  loading,
  setLoading,
}: {
  open: boolean;
  onFinish: () => void;
  loading: boolean;
  setLoading: (value: boolean) => void;
}) {
  const user = useQuery(api.users.getCurrentUser);
  const userId = user?._id;

  const [crops, setCrops] = useState<Crop[]>([{ name: "", area: 0, revenue: 0, production: 0 }]);

  const upsertCrop = useMutation(api.crops.upsertCrop);
  const existingCrops = useQuery(api.crops.getCropsByUser, userId ? { user_id: userId } : "skip");
  const deleteCrop = useMutation(api.crops.deleteCrop);

  const [removedCropIds, setRemovedCropIds] = useState<Id<"crops">[]>([]);

  useEffect(() => {
    if (existingCrops && existingCrops.length > 0) {
      setCrops(existingCrops);
    }
  }, [existingCrops]);

  const handleCropChange = (index: number, field: string, value: string) => {
    if (loading) return; // disable editing while loading
    const newCrops = [...crops];
    newCrops[index] = {
      ...newCrops[index],
      [field]: field === "name" ? value : Number(value),
    };
    setCrops(newCrops);
  };

  const addCrop = () => {
    if (loading) return; // disable adding while loading
    if (crops.length < 10) {
      setCrops([...crops, { name: "", area: 0, revenue: 0, production: 0 }]);
    }
  };

  const removeCrop = (index: number) => {
    if (loading) return; // disable removing while loading
    const cropToRemove = crops[index];
    if (cropToRemove._id) {
      setRemovedCropIds((prev) => [...prev, cropToRemove._id as Id<"crops">]);
    }
    setCrops(crops.filter((_, i) => i !== index));
  };

  const saveCrops = async () => {
    if (!userId) {
      Sentry.captureException("Convex User ID is missing");
      return;
    }

    setLoading(true);
    try {
      await Promise.all(
        crops.map((crop) =>
          upsertCrop({
            id: crop._id, // undefined for new crops
            user_id: userId,
            name: crop.name,
            area: crop.area,
            revenue: crop.revenue,
            production: crop.production,
          })
        )
      );

      await Promise.all(removedCropIds.map((id) => deleteCrop({ id })));

      setRemovedCropIds([]);
      onFinish();
    } catch (error) {
      Sentry.captureException(`Error saving crops: ${error}`);
    } finally {
      setLoading(false);
    }
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
                disabled={loading}
              />
              <Input
                placeholder="Field Area (ha)"
                type="number"
                value={crop.area || ""}
                onChange={(e) => handleCropChange(index, "area", e.target.value)}
                className="p-3 border border-gray-300 rounded-md"
                disabled={loading}
              />
              <Input
                placeholder="Revenue (₹)"
                type="number"
                value={crop.revenue || ""}
                onChange={(e) => handleCropChange(index, "revenue", e.target.value)}
                className="p-3 border border-gray-300 rounded-md"
                disabled={loading}
              />
              <Input
                placeholder="Production (kg)"
                type="number"
                value={crop.production || ""}
                onChange={(e) => handleCropChange(index, "production", e.target.value)}
                className="p-3 border border-gray-300 rounded-md"
                disabled={loading}
              />

              {crops.length > 1 && (
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => removeCrop(index)}
                  className="self-end px-2"
                  disabled={loading}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}

          <div className="flex justify-center gap-3 mt-6">
            <Button
              onClick={addCrop}
              className="px-5 py-3 text-base font-semibold bg-primary text-white rounded-md"
              disabled={loading}
            >
              Add Crop
            </Button>
            <DialogClose asChild>
              <Button
                onClick={saveCrops}
                className="px-5 py-3 text-base font-semibold bg-primary text-white rounded-md"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
