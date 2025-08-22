"use client";

import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart, AlertTriangle, CheckCircle2 } from "lucide-react";
import type { AnalysisResult } from "@/types";

type HealthSummaryProps = {
  history: AnalysisResult[];
};

export function HealthSummary({ history }: HealthSummaryProps) {
  const summaryData = useMemo(() => {
    if (history.length === 0) {
      return [
        { name: "Healthy", value: 0 },
        { name: "Diseased", value: 0 },
      ];
    }
    const healthyCount = history.filter(
      (r) => r.problemIdentified.toLowerCase() === "healthy"
    ).length;
    const diseasedCount = history.length - healthyCount;

    return [
      { name: "Healthy", value: healthyCount },
      { name: "Diseased", value: diseasedCount },
    ];
  }, [history]);

  const COLORS = ["#34D399", "#F87171"]; // Green-400, Red-400

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart className="text-primary" />
          Crop Health Summary
        </CardTitle>
        <CardDescription>
          An overview of your crop health based on your uploads.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {history.length > 0 ? (
          <>
            <div className="w-full h-48">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={summaryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {summaryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-around mt-4 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-green-500" />
                <span>Healthy: {summaryData[0].value}</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="text-red-500" />
                <span>Diseased: {summaryData[1].value}</span>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-center text-muted-foreground">
            <BarChart className="w-12 h-12" />
            <p className="mt-2">No analysis data yet.</p>
            <p className="text-xs">Upload a crop image to see the summary.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
