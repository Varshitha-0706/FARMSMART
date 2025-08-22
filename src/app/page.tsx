"use client";

import { useState } from "react";
import { RegistrationForm } from "@/components/dashboard/registration-form";
import { Header } from "@/components/dashboard/header";
import { CropAnalysis } from "@/components/dashboard/crop-analysis";
import { HealthSummary } from "@/components/dashboard/health-summary";
import { MarketWatch } from "@/components/dashboard/market-watch";
import { AnalysisHistory } from "@/components/dashboard/analysis-history";
import { FieldLayout } from "@/components/dashboard/field-layout";
import type { AnalysisResult, Farmer } from "@/types";

export default function Home() {
  const [farmer, setFarmer] = useState<Farmer | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisResult[]>([]);

  const handleRegister = (data: Farmer) => {
    setFarmer(data);
  };

  const handleNewAnalysis = (result: AnalysisResult) => {
    setAnalysisHistory((prev) => [result, ...prev]);
  };

  if (!farmer) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4">
        <RegistrationForm onRegister={handleRegister} />
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header farmerName={farmer.name} />
      <main className="container mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          <div className="lg:col-span-2 space-y-6">
            <CropAnalysis onNewAnalysis={handleNewAnalysis} />
            <AnalysisHistory history={analysisHistory} />
          </div>
          <div className="lg:col-span-1 space-y-6">
            <HealthSummary history={analysisHistory} />
            <MarketWatch cropType={farmer.cropType} />
            <FieldLayout history={analysisHistory} />
          </div>
        </div>
      </main>
    </div>
  );
}
