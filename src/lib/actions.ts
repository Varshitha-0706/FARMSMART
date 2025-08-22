"use server";

import {
  analyzeCropHealth,
  type AnalyzeCropHealthInput,
} from "@/ai/flows/analyze-crop-health";
import { explainConfidenceScore } from "@/ai/flows/explain-confidence-score";
import type { AnalysisResult } from "@/types";

export async function performCropAnalysis(
  input: AnalyzeCropHealthInput
): Promise<Omit<AnalysisResult, "id" | "timestamp">> {
  try {
    const analysis = await analyzeCropHealth(input);

    if (!analysis.problemIdentified || !analysis.suggestedAction) {
      throw new Error("AI analysis failed to provide a diagnosis.");
    }

    const { explanation } = await explainConfidenceScore({
      problemIdentified: analysis.problemIdentified,
      confidencePercentage: analysis.confidencePercentage,
      suggestedAction: analysis.suggestedAction,
    });

    return {
      photoDataUri: input.photoDataUri,
      ...analysis,
      explanation,
    };
  } catch (error) {
    console.error("Error in performCropAnalysis:", error);
    throw new Error("Failed to perform crop analysis. Please try again.");
  }
}
