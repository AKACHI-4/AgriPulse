"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CropForm({ onFinish }: { onFinish: (crops: any[]) => void }) {
  const [crops, setCrops] = useState([{ name: "", area: "", revenue: "" }]);

  return (
    <div className="space-y-4">
      {crops.map((crop, index) => (
        <div key={index} className="space-y-2">
          <Input
            placeholder="Crop Name"
            value={crop.name}
            onChange={(e) => {
              const newCrops = [...crops];
              newCrops[index].name = e.target.value;
              setCrops(newCrops);
            }}
          />
          <Input
            placeholder="Field Area (ha)"
            value={crop.area}
            onChange={(e) => {
              const newCrops = [...crops];
              newCrops[index].area = e.target.value;
              setCrops(newCrops);
            }}
          />
          <Input
            placeholder="Revenue (₹)"
            value={crop.revenue}
            onChange={(e) => {
              const newCrops = [...crops];
              newCrops[index].revenue = e.target.value;
              setCrops(newCrops);
            }}
          />
        </div>
      ))}
      <Button onClick={() => setCrops([...crops, { name: "", area: "", revenue: "" }])}>Add Crop</Button>
      <Button onClick={() => onFinish(crops)}>Finish</Button>
    </div>
  );
}
