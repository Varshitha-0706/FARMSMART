"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  UploadCloud,
  Leaf,
  Loader2,
  AlertTriangle,
  Info,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { performCropAnalysis } from "@/lib/actions";
import type { AnalysisResult } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";

type CropAnalysisProps = {
  onNewAnalysis: (result: AnalysisResult) => void;
};

export function CropAnalysis({ onNewAnalysis }: CropAnalysisProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<Omit<
    AnalysisResult,
    "id" | "timestamp"
  > | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleAnalyze = async () => {
    if (!file || !preview) return;

    setIsLoading(true);
    setResult(null);

    try {
      const analysisResult = await performCropAnalysis({
        photoDataUri: preview,
      });
      setResult(analysisResult);
      onNewAnalysis({
        ...analysisResult,
        id: new Date().toISOString(),
        timestamp: new Date(),
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description:
          error instanceof Error ? error.message : "An unknown error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence > 90) return "bg-green-500";
    if (confidence > 75) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Leaf className="text-primary" />
          AI Crop Health Analysis
        </CardTitle>
        <CardDescription>
          Upload an image of a crop leaf to get an instant health diagnosis.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className="relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />
          {preview ? (
            <Image
              src={preview}
              alt="Crop preview"
              layout="fill"
              objectFit="contain"
              className="rounded-lg p-2"
            />
          ) : (
            <div className="text-center text-muted-foreground">
              <UploadCloud className="w-12 h-12 mx-auto" />
              <p>Click to upload or drag and drop</p>
              <p className="text-xs">PNG, JPG, GIF up to 10MB</p>
            </div>
          )}
        </div>

        {file && !isLoading && !result && (
          <Button
            onClick={handleAnalyze}
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <ShieldCheck />
            Analyze Crop
          </Button>
        )}
      </CardContent>
      {isLoading && (
        <CardFooter className="flex-col">
          <Skeleton className="w-full h-8 mb-2" />
          <Skeleton className="w-full h-24" />
        </CardFooter>
      )}
      {result && (
        <CardFooter className="flex-col items-start gap-4">
          <div className="w-full p-4 rounded-lg bg-secondary/50">
            <h3 className="flex items-center gap-2 mb-2 text-lg font-semibold">
              {result.problemIdentified.toLowerCase() === "healthy" ? (
                <CheckCircle2 className="text-green-500" />
              ) : (
                <AlertTriangle className="text-destructive" />
              )}
              Diagnosis: {result.problemIdentified}
            </h3>
            <div className="w-full">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="w-full">
                    <Progress
                      value={result.confidencePercentage}
                      className={getConfidenceColor(result.confidencePercentage)}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Confidence: {result.confidencePercentage}%</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <p className="mt-1 text-xs text-right text-muted-foreground">
                {result.confidencePercentage}% Confidence
              </p>
            </div>
          </div>

          <div className="w-full p-4 rounded-lg bg-secondary/50">
            <h4 className="mb-2 font-semibold">Suggested Action:</h4>
            <p className="text-sm text-foreground">
              {result.suggestedAction}
            </p>
          </div>

          <div className="w-full p-4 rounded-lg bg-secondary/50">
            <h4 className="flex items-center gap-2 mb-2 font-semibold">
              <Info />
              AI Explanation
              <Badge variant="outline">Powered by GenAI</Badge>
            </h4>
            <p className="text-sm text-muted-foreground">
              {result.explanation}
            </p>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
