"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Map, Wind } from "lucide-react";
import type { AnalysisResult } from "@/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type FieldLayoutProps = {
  history: AnalysisResult[];
};

const PLOT_COUNT = 16;

export function FieldLayout({ history }: FieldLayoutProps) {
  const getPlotStatus = (index: number) => {
    const analysis = history[index];
    if (!analysis) return "unknown";
    return analysis.problemIdentified.toLowerCase() === "healthy"
      ? "healthy"
      : "diseased";
  };

  const getPlotTooltip = (index: number) => {
    const analysis = history[index];
    if (!analysis) return `Plot ${index + 1}: No data`;
    return `Plot ${index + 1}: ${analysis.problemIdentified} (${
      analysis.confidencePercentage
    }%)`;
  };

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Map className="text-primary" />
          Field Layout
        </CardTitle>
        <CardDescription>
          A visual summary of your field's health.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: PLOT_COUNT }).map((_, i) => {
              const status = getPlotStatus(i);
              return (
                <Tooltip key={i}>
                  <TooltipTrigger asChild>
                    <div
                      className={cn(
                        "w-full aspect-square rounded-md transition-colors flex items-center justify-center",
                        status === "healthy" && "bg-green-500/80 hover:bg-green-500",
                        status === "diseased" && "bg-red-500/80 hover:bg-red-500",
                        status === "unknown" &&
                          "bg-muted/50 hover:bg-muted"
                      )}
                    >
                     <span className="text-xs font-bold text-background/80">{i+1}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{getPlotTooltip(i)}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </TooltipProvider>
        <div className="mt-4 text-xs text-muted-foreground flex items-center gap-2">
          <Wind className="h-4 w-4" />
          <p>
            Plots are colored based on your most recent analyses. Hover for details.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
