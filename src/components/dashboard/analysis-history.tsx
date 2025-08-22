"use client";

import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { History, CheckCircle2, AlertTriangle } from "lucide-react";
import type { AnalysisResult } from "@/types";
import { Badge } from "../ui/badge";

type AnalysisHistoryProps = {
  history: AnalysisResult[];
};

export function AnalysisHistory({ history }: AnalysisHistoryProps) {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="text-primary" />
          Analysis History
        </CardTitle>
        <CardDescription>
          Review your past crop health analyses.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {history.length > 0 ? (
          <Accordion type="single" collapsible className="w-full">
            {history.map((item) => (
              <AccordionItem key={item.id} value={item.id}>
                <AccordionTrigger>
                  <div className="flex items-center gap-4 text-left">
                    {item.problemIdentified.toLowerCase() === "healthy" ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0" />
                    )}
                    <div>
                      <span className="font-semibold">
                        {item.problemIdentified}
                      </span>
                      <p className="text-xs text-muted-foreground">
                        {item.timestamp.toLocaleDateString()} -{" "}
                        {item.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <div className="relative w-full h-48 rounded-md overflow-hidden">
                    <Image
                      src={item.photoDataUri}
                      alt={`Analysis from ${item.timestamp.toLocaleString()}`}
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                  <div className="p-3 rounded-md bg-muted/50">
                    <p>
                      <strong>Suggested Action:</strong> {item.suggestedAction}
                    </p>
                    <p>
                      <strong>Confidence:</strong> {item.confidencePercentage}%
                    </p>
                  </div>
                  <div className="p-3 rounded-md bg-muted/50">
                    <p className="font-semibold">AI Explanation:</p>
                    <p className="text-sm text-muted-foreground">
                      {item.explanation}
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-center text-muted-foreground">
            <History className="w-12 h-12" />
            <p className="mt-2">No history yet.</p>
            <p className="text-xs">Your analysis results will appear here.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
