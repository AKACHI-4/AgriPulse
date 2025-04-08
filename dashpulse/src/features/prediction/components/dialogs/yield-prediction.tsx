import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from 'lucide-react';
import { ModelEndpointsInterface } from '$/types';
import * as Sentry from "@sentry/nextjs";

const crops = [
  "Arhar/Tur", "Bajra", "Banana", "Barley", "Black pepper", "Cardamom",
  "Cashewnut", "Castor seed", "Coconut", "Coriander", "Cotton(lint)",
  "Cowpea(Lobia)", "Dry chillies", "Garlic", "Ginger", "Gram", "Groundnut",
  "Guar seed", "Horse-gram", "Jowar", "Jute", "Khesari", "Linseed", "Maize",
  "Masoor", "Mesta", "Moong(Green Gram)", "Moth", "Niger seed",
  "Oilseeds total", "Onion", "Other  Rabi pulses", "Other Cereals",
  "Other Kharif pulses", "Other Summer Pulses", "Peas & beans (Pulses)",
  "Potato", "Ragi", "Rapeseed &Mustard", "Rice", "Safflower", "Sannhamp",
  "Sesamum", "Small millets", "Soyabean", "Sugarcane", "Sunflower",
  "Sweet potato", "Tapioca", "Tobacco", "Turmeric", "Urad", "Wheat",
  "other oilseeds"
];

const seasons = [
  "Kharif", "Rabi", "Summer", "Whole Year", "Winter"
];

const states = [
  "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir",
  "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
  "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry",
  "Punjab", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

interface ResultType {
  prediction?: number;
  error?: string;
}

export default function YieldPredictor({ endpoint }: ModelEndpointsInterface) {
  const [rainfall, setRainfall] = useState("");
  const [fertilizer, setFertilizer] = useState("");
  const [crop, setCrop] = useState("");
  const [season, setSeason] = useState("");
  const [state, setState] = useState("");

  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<ResultType | null>(null);
  const [showResultDialog, setShowResultDialog] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('rainfall', rainfall);
      formData.append('fertilizer', fertilizer);
      formData.append('crop', crop);
      formData.append('season', season);
      formData.append('state', state);

      const response = await fetch(`/api/canopy?endpoint=${endpoint.url}`, {
        method: endpoint.method,
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to fetch prediction');

      const data: ResultType = await response.json();
      setRainfall("");
      setFertilizer("");
      setCrop("");
      setSeason("");
      setState("");
      setResult(data);
      setShowResultDialog(true);
      // console.log("Prediction Result:", data);
    } catch (error) {
      Sentry.captureException(error);
      // console.error('Error:', error);
      setResult({ error: (error as Error).message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DialogContent className="max-w-md mx-auto p-6">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            Yield Prediction
          </DialogTitle>
        </DialogHeader>

        <div className="my-2">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="rainfall" className="text-base">Annual Rainfall (mm)</Label>
              <Input
                id="rainfall"
                type="number"
                inputMode="numeric"
                className="text-base appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                value={rainfall}
                onChange={(e) => setRainfall(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="fertilizer" className="text-base">Fertilizer (kg/ha)</Label>
              <Input
                id="fertilizer"
                type="number"
                inputMode="numeric"
                className="text-base appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                value={fertilizer}
                onChange={(e) => setFertilizer(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="crop" className="text-base">
                Select Crop
              </Label>
              <Select onValueChange={setCrop} required>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a crop" />
                </SelectTrigger>
                <SelectContent className="text-base max-h-60 overflow-y-auto">
                  {crops.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="season" className="text-base">
                Select Season
              </Label>
              <Select onValueChange={setSeason} required>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a season" />
                </SelectTrigger>
                <SelectContent className="text-base max-h-60 overflow-y-auto">
                  {seasons.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="state" className="text-base">
                Select State
              </Label>
              <Select onValueChange={setState} required>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a state" />
                </SelectTrigger>
                <SelectContent className="text-base max-h-60 overflow-y-auto">
                  {states.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </form>
        </div >

        <div className="flex justify-center">
          <Button onClick={handleSubmit} disabled={loading} className="mt-2">
            {loading ?
              <Loader2 className="animate-spin h-5 w-5" /> :
              'Predict'
            }
          </Button>
        </div>

      </DialogContent >

      {/* Result Dialog */}
      {
        showResultDialog && result && (
          <Dialog open={showResultDialog} onOpenChange={setShowResultDialog}>
            <DialogContent className="max-w-md mx-auto p-6">
              <DialogHeader>
                <DialogTitle className="text-center text-2xl font-bold">
                  Prediction Result
                </DialogTitle>
              </DialogHeader>

              <div className="mt-4 p-4 border rounded-md">
                {result.error ? (
                  <p className="text-red-500">Error: {result.error}</p>
                ) : (
                  <>
                    <p><strong>Predicted Yield :</strong> {(result.prediction!).toFixed(2)}{" "}production per hectare</p>
                  </>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )
      }
    </>
  );
}
