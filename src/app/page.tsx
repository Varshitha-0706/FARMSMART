
"use client";

import { useState, useEffect } from "react";
import type { Farmer, AnalysisResult } from "@/types";
import { RegistrationForm } from "@/components/dashboard/registration-form";
import { Header } from "@/components/dashboard/header";
import { CropAnalysis } from "@/components/dashboard/crop-analysis";
import { AnalysisHistory } from "@/components/dashboard/analysis-history";
import { HealthSummary } from "@/components/dashboard/health-summary";
import { WeatherUpdates } from "@/components/dashboard/weather-updates";
import { MarketWatch } from "@/components/dashboard/market-watch";
import { FieldLayout } from "@/components/dashboard/field-layout";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [farmer, setFarmer] = useState<Farmer | null>(null);
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedFarmer = localStorage.getItem("farmer-details");
      const storedHistory = localStorage.getItem("analysis-history");
      if (storedFarmer) {
        setFarmer(JSON.parse(storedFarmer));
      }
      if (storedHistory) {
        // When retrieving from localStorage, dates are strings, so we need to convert them back to Date objects.
        const parsedHistory = JSON.parse(storedHistory).map(
          (item: AnalysisResult) => ({
            ...item,
            timestamp: new Date(item.timestamp),
          })
        );
        setHistory(parsedHistory);
      }
    } catch (error) {
      console.error("Failed to parse from localStorage", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleRegister = (data: Farmer) => {
    setFarmer(data);
    localStorage.setItem("farmer-details", JSON.stringify(data));
  };

  const handleNewAnalysis = (result: AnalysisResult) => {
    const updatedHistory = [result, ...history];
    setHistory(updatedHistory);
    localStorage.setItem("analysis-history", JSON.stringify(updatedHistory));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Skeleton className="h-16 w-full" />
        <div className="p-4 md:p-6 lg:p-8 w-full max-w-4xl space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!farmer) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <RegistrationForm onRegister={handleRegister} />
      </main>
    );
  }

  return (
    <>
      <Header farmerName={farmer.name} />
      <main className="container mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <CropAnalysis onNewAnalysis={handleNewAnalysis} />
            <AnalysisHistory history={history} />
          </div>
          <div className="space-y-6">
            <HealthSummary history={history} />
            <FieldLayout history={history} />
            <WeatherUpdates district={farmer.district} />
            <MarketWatch cropType={farmer.cropType} />
          </div>
        </div>
      </main>
    </>
  );
}
