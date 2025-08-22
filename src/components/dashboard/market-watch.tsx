"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  LineChart,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

type MarketWatchProps = {
  cropType: string;
};

const mockMarketData = {
  prices: [
    { mandi: "Guntur", price: "₹7,200/quintal" },
    { mandi: "Kurnool", price: "₹7,150/quintal" },
    { mandi: "Vijayawada", price: "₹7,250/quintal" },
  ],
  trending: ["Cotton", "Turmeric", "Onion"],
  forecast: "Prices expected to rise 5-7% in the next 2 weeks.",
};

export function MarketWatch({ cropType }: MarketWatchProps) {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="text-primary" />
          Market Intelligence
        </CardTitle>
        <CardDescription>
          Prices and trends for crops in your nearby markets.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="mb-2 font-semibold text-md flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-accent" />
            Current {cropType} Prices
          </h4>
          <ul className="space-y-1 text-sm list-disc list-inside text-muted-foreground">
            {mockMarketData.prices.map((item) => (
              <li key={item.mandi}>
                <span className="font-medium text-foreground">
                  {item.mandi}:
                </span>{" "}
                {item.price}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-2 font-semibold text-md flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-accent" />
            Trending Crops
          </h4>
          <div className="flex flex-wrap gap-2">
            {mockMarketData.trending.map((crop) => (
              <Badge key={crop} variant="secondary">
                {crop}
              </Badge>
            ))}
          </div>
        </div>
        <div>
          <h4 className="mb-2 font-semibold text-md flex items-center gap-2">
            <LineChart className="w-5 h-5 text-accent" />
            Price Forecast
          </h4>
          <p className="text-sm text-muted-foreground">
            {mockMarketData.forecast}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
