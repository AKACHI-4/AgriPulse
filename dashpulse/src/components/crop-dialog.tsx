"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react"; // For delete icon

export default function CropForm({ onFinish }: { onFinish: (crops: any[]) => void }) {
  const [crops, setCrops] = useState([{ name: "", area: "", revenue: "" }]);

  const handleCropChange = (index: number, field: string, value: string) => {
    const newCrops = [...crops];
    newCrops[index][field] = value;
    setCrops(newCrops);
  };

  const addCrop = () => {
    setCrops([...crops, { name: "", area: "", revenue: "" }]);
  };

  const removeCrop = (index: number) => {
    const newCrops = crops.filter((_, i) => i !== index);
    setCrops(newCrops);
  };

  return (
    <div className="space-y-4 p-4">
      {crops.map((crop, index) => (
        <div key={index} className="flex items-center gap-2 border-b pb-2">
          <Input
            placeholder="Crop Name"
            value={crop.name}
            onChange={(e) => handleCropChange(index, "name", e.target.value)}
          />
          <Input
            placeholder="Field Area (ha)"
            value={crop.area}
            onChange={(e) => handleCropChange(index, "area", e.target.value)}
          />
          <Input
            placeholder="Revenue (₹)"
            value={crop.revenue}
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
        <Button onClick={() => onFinish(crops)}>Finish</Button>
      </div>
    </div>
  );
}
