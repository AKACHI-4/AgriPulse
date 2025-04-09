'use client';

import { useState, ChangeEvent } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { ModelEndpointsInterface } from '$/types';
import { SingleImageDropzone } from '$/src/components/single-image-dropzone';
import * as Sentry from "@sentry/nextjs";

interface ResultType {
  predicted_class_name?: string;
  confidence?: number;
  error?: string;
}

export default function PestDetection({ endpoint }: ModelEndpointsInterface) {
  const [file, setFile] = useState<File | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<ResultType | null>(null);
  const [showResultDialog, setShowResultDialog] = useState<boolean>(false);

  const handleFileChange = (file?: File) => {
    if (!loading) setFile(file || undefined);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file');
      return;
    }
    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('model_name', 'pest');

      const response = await fetch(`/api/canopy?endpoint=${endpoint.url}`, {
        method: endpoint.method,
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to fetch prediction');

      const data: ResultType = await response.json();
      setFile(undefined);
      setResult(data);
      setShowResultDialog(true);
    } catch (error) {
      // console.error('Error:', error);
      Sentry.captureException(error);
      setResult({ error: (error as Error).message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DialogContent className="max-w-md mx-auto p-6">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">Disease Detection</DialogTitle>
        </DialogHeader>

        <div className="my-2">
          <SingleImageDropzone
            value={file}
            onChange={handleFileChange}
            disabled={loading}
            dropzoneOptions={{ maxSize: 5 * 1024 * 1024 }}
          />
        </div>

        <div className="flex justify-center">
          <Button onClick={handleUpload} disabled={loading} className="mt-2">
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Predict'}
          </Button>
        </div>
      </DialogContent>

      {/* Result Dialog */}
      {showResultDialog && result && (
        <Dialog open={showResultDialog} onOpenChange={setShowResultDialog}>
          <DialogContent className="max-w-md mx-auto p-6">
            <DialogHeader>
              <DialogTitle className="text-center text-2xl font-bold">Detection Result</DialogTitle>
            </DialogHeader>

            <div className="mt-4 p-4 border rounded-md">
              {result.error ? (
                <p className="text-red-500">Error: {result.error}</p>
              ) : (
                <>
                  <p><strong>Predicted Class :</strong>{" "}{result.predicted_class_name}</p>
                  <p><strong>Confidence :</strong>{" "}{(result.confidence! * 100).toFixed(2)}%</p>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
