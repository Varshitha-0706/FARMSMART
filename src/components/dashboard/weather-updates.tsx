"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sun, Cloud, CloudRain, Wind, Droplets } from "lucide-react";

type WeatherUpdatesProps = {
  district: string;
};

const mockWeatherData = {
  current: {
    temp: 32,
    condition: "Partly Cloudy",
    wind: 15,
    humidity: 70,
  },
  forecast: [
    { day: "Mon", temp: 33, condition: "Sunny" },
    { day: "Tue", temp: 34, condition: "Sunny" },
    { day: "Wed", temp: 31, condition: "Rain" },
    { day: "Thu", temp: 32, condition: "Cloudy" },
    { day: "Fri", temp: 35, condition: "Sunny" },
  ],
};

const WeatherIcon = ({ condition }: { condition: string }) => {
  switch (condition.toLowerCase()) {
    case "sunny":
      return <Sun className="w-8 h-8 text-yellow-500" />;
    case "partly cloudy":
      return <Cloud className="w-10 h-10 text-gray-400" />;
    case "cloudy":
      return <Cloud className="w-8 h-8 text-gray-400" />;
    case "rain":
      return <CloudRain className="w-8 h-8 text-blue-500" />;
    default:
      return <Sun className="w-8 h-8 text-yellow-500" />;
  }
};

export function WeatherUpdates({ district }: WeatherUpdatesProps) {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sun className="text-primary" />
          Weather Updates
        </CardTitle>
        <CardDescription>
          Current conditions and forecast for {district}.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
          <div>
            <p className="text-4xl font-bold">
              {mockWeatherData.current.temp}°C
            </p>
            <p className="text-muted-foreground">
              {mockWeatherData.current.condition}
            </p>
          </div>
          <WeatherIcon condition={mockWeatherData.current.condition} />
        </div>
        <div className="flex justify-around text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
                <Wind className="w-4 h-4" />
                <span>{mockWeatherData.current.wind} km/h</span>
            </div>
            <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4" />
                <span>{mockWeatherData.current.humidity}%</span>
            </div>
        </div>
        <div>
          <h4 className="mb-2 font-semibold text-md">5-Day Forecast</h4>
          <div className="flex justify-between text-center">
            {mockWeatherData.forecast.map((day) => (
              <div key={day.day} className="flex flex-col items-center gap-1">
                <p className="text-sm font-medium">{day.day}</p>
                <WeatherIcon condition={day.condition} />
                <p className="text-sm font-semibold">{day.temp}°</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
