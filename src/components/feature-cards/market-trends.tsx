"use client";

import * as React from "react";
import { useTransition } from "react";
import { marketTrendForecast, type MarketTrendForecastOutput } from "@/ai/flows/market-trend-forecasting";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, CalendarClock, DollarSign, Lightbulb } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function MarketTrendsCard() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = React.useState<MarketTrendForecastOutput | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const cropType = formData.get("cropType") as string;
    const region = formData.get("region") as string;
    const historicalPriceData = formData.get("historicalPriceData") as string;
    const economicIndicators = formData.get("economicIndicators") as string;
    
    setResult(null);
    setError(null);

    startTransition(async () => {
      try {
        const forecast = await marketTrendForecast({ cropType, region, historicalPriceData, economicIndicators });
        setResult(forecast);
      } catch (e: any) {
        setError(e.message || "An unexpected error occurred.");
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Forecast Market Trends</CardTitle>
          <CardDescription>
            Get AI insights on the best time to sell your crops for maximum profit.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cropType">Crop Type</Label>
              <Input id="cropType" name="cropType" placeholder="e.g., Cotton, Sugarcane" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="region">Region</Label>
              <Input id="region" name="region" placeholder="e.g., Maharashtra, India" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="historicalPriceData">Historical Price Data</Label>
              <Textarea id="historicalPriceData" name="historicalPriceData" placeholder="e.g., Prices averaged $15/bushel last quarter, up 5% YoY." required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="economicIndicators">Economic Indicators</Label>
              <Textarea id="economicIndicators" name="economicIndicators" placeholder="e.g., High export demand, recent government subsidies." required />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Forecasting...' : 'Forecast Trends'}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Market Forecast</CardTitle>
          <CardDescription>
            AI-powered market analysis and selling recommendations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isPending && (
            <div className="space-y-6">
               <div className="space-y-2">
                <Skeleton className="h-5 w-1/4" />
                <Skeleton className="h-16 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-8 w-1/2" />
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
                <h3 className="font-semibold mb-2 flex items-center gap-2"><DollarSign className="h-5 w-5 text-primary" /> Forecast Summary</h3>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{result.forecastSummary}</p>
              </div>
               <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2"><CalendarClock className="h-5 w-5 text-accent-foreground" /> Suggested Selling Time</h3>
                <p className="text-xl font-bold text-accent-foreground bg-accent/20 p-3 rounded-md">
                  {result.suggestedSellingTime}
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2"><Lightbulb className="h-5 w-5 text-muted-foreground" /> Reasoning</h3>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{result.reasoning}</p>
              </div>
            </div>
          )}
          {!isPending && !result && !error && (
            <div className="text-center text-muted-foreground py-12">
              <p>Your market trend forecast is awaiting data.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
