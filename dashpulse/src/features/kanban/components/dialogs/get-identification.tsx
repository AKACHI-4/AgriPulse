'use client';

import { useState } from 'react';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { convertToBase64 } from '@/lib/utils';
import { PlantIdDialogProps } from '$/types';

export default function PlantIdentificationDialog({ endpoint }: PlantIdDialogProps) {
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);
    setResult(null);

    try {
      const base64String = await convertToBase64(image);

      const response = await fetch(`/api/plantid?endpoint=${endpoint.url}&details=local_name,description,url,treatment,classification,common_names,cause`, {
        method: endpoint.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images: [base64String], similar_images: true }),
      });

      const data = await response.json();
      console.log(data);

      setResult(data);
    } catch (error) {
      console.error('Error identifying plant:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Plant Health Assessment</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <Label>Select Image</Label>
        <Input type="file" accept="image/*" onChange={handleFileChange} />
        <Button onClick={handleAnalyze} disabled={loading || !image}>
          {loading ? <Loader2 className="animate-spin" /> : 'Analyze'}
        </Button>
      </div>
      {loading && <p>Analyzing...</p>}
      {result ? (
        <pre className="text-sm mt-4 border p-2 rounded">{JSON.stringify(result, null, 2)}</pre>
      ) : (
        <p className="mt-4 text-muted-foreground">No results available</p>
      )}
      <DialogFooter>
        <Button>Okay</Button>
      </DialogFooter>
    </DialogContent>
  );
}
