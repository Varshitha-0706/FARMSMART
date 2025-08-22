"use client";

import * as React from "react";
import { useTransition } from "react";
import Image from "next/image";
import { imageRecognition, type ImageRecognitionOutput } from "@/ai/flows/image-recognition";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, CheckCircle2, ShieldCheck, UploadCloud, XCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

export default function ImageRecognitionCard() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = React.useState<ImageRecognitionOutput | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);
  const [file, setFile] = React.useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
      setResult(null);
      setError(null);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!preview) {
      setError("Please select an image to analyze.");
      return;
    }
    
    setError(null);

    startTransition(async () => {
      try {
        const prediction = await imageRecognition({ photoDataUri: preview });
        setResult(prediction);
      } catch (e: any) {
        setError(e.message || "An unexpected error occurred.");
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Pest & Disease Recognition</CardTitle>
          <CardDescription>
            Upload a photo of a plant to detect potential issues using AI.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="plant-photo">Plant Photo</Label>
              <Input id="plant-photo" type="file" accept="image/*" onChange={handleFileChange} className="hidden" ref={fileInputRef} />
              <div 
                className="border-2 border-dashed border-muted rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {preview ? (
                   <div className="relative w-full h-64">
                     <Image src={preview} alt="Plant preview" layout="fill" objectFit="contain" className="rounded-md" />
                   </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <UploadCloud className="h-10 w-10" />
                    <p>Click to upload or drag and drop</p>
                    <p className="text-xs">PNG, JPG, or WEBP</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isPending || !file}>
              {isPending ? 'Analyzing...' : 'Analyze Image'}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Analysis Report</CardTitle>
          <CardDescription>
            AI-generated identification and suggested actions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isPending && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-8 w-1/2" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-1/4" />
                <Skeleton className="h-6 w-3/4" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
          )}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {result && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">Detection Status</h3>
                <div className={`flex items-center gap-2 text-lg font-bold ${result.pestOrDiseaseDetected ? 'text-destructive' : 'text-primary'}`}>
                  {result.pestOrDiseaseDetected ? <XCircle /> : <CheckCircle2 />}
                  <span>{result.pestOrDiseaseDetected ? 'Pest or Disease Detected' : 'No Issues Detected'}</span>
                </div>
              </div>
              
              {result.pestOrDiseaseDetected && (
                <>
                  <div>
                    <h3 className="font-semibold mb-2">Identification</h3>
                    <p className="text-2xl font-bold text-foreground">{result.identification}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Confidence Level</h3>
                    <div className="flex items-center gap-2">
                      <Progress value={result.confidence * 100} className="w-full" />
                      <span className="font-mono text-sm font-semibold">{(result.confidence * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary" /> Suggested Actions</h3>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{result.suggestedActions}</p>
                  </div>
                </>
              )}
            </div>
          )}
          {!isPending && !result && !error && (
            <div className="text-center text-muted-foreground py-12">
              <p>Upload an image to get your analysis.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
