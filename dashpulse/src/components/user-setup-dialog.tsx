"use client";

import { useEffect, useState } from "react";
import { api } from "$/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";

export default function UserSetupDialog({ onSetupComplete }: { onSetupComplete: () => void }) {
  const user = useQuery(api.users.getCurrentUser);
  const createUser = useMutation(api.users.createUser);

  const [step, setStep] = useState<"location" | "crops">("location");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [location, setLocation] = useState({ address: "", latitude: 0, longitude: 0 });
  const [crops, setCrops] = useState([{ name: "", area: "", revenue: "" }]);

  useEffect(() => {
    if (user === undefined) return;
    if (user === null) setOpen(true);
    else onSetupComplete();

    setLoading(false);
  }, [user]);

  const handleLocationSubmit = async () => {
    await createUser({ ...location });
    setStep("crops");
  };
  const handleCropSubmit = async () => {
    await createUser({ ...location, crops });
    setOpen(false);
    onSetupComplete();
  };

  if (loading) return <div className="flex items-center justify-center h-screen"><Loader className="animate-spin" /></div>;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{step === "location" ? "Set Your Location" : "Enter Crop Details"}</DialogTitle>
        </DialogHeader>

        {step === "location" ? (
          <>
            <Input placeholder="Address" onChange={(e) => setLocation({ ...location, address: e.target.value })} />
            <Input placeholder="Latitude" onChange={(e) => setLocation({ ...location, latitude: e.target.value })} />
            <Input placeholder="Longitude" onChange={(e) => setLocation({ ...location, longitude: e.target.value })} />
            <Button onClick={handleLocationSubmit}>Save</Button>
          </>
        ) : (
          <>
            {crops.map((crop, index) => (
              <div key={index}>
                <Input placeholder="Crop Name" onChange={(e) => {
                  const newCrops = [...crops];
                  newCrops[index].name = e.target.value;
                  setCrops(newCrops);
                }} />
                <Input placeholder="Field Area (ha)" onChange={(e) => {
                  const newCrops = [...crops];
                  newCrops[index].area = e.target.value;
                  setCrops(newCrops);
                }} />
                <Input placeholder="Revenue (₹)" onChange={(e) => {
                  const newCrops = [...crops];
                  newCrops[index].revenue = e.target.value;
                  setCrops(newCrops);
                }} />
              </div>
            ))}
            <Button onClick={() => setCrops([...crops, { name: "", area: "", revenue: "" }])}>Add Crop</Button>
            <Button onClick={handleCropSubmit}>Finish</Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
