'use server';

/**
 * @fileOverview Market trend forecasting flow for farmers.
 *
 * - marketTrendForecast - A function that handles the market trend forecasting process.
 * - MarketTrendForecastInput - The input type for the marketTrendForecast function.
 * - MarketTrendForecastOutput - The return type for the marketTrendForecast function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MarketTrendForecastInputSchema = z.object({
  cropType: z.string().describe('The type of crop to forecast market trends for.'),
  region: z.string().describe('The region where the crop is grown.'),
  historicalPriceData: z.string().describe('Historical price data for the crop.'),
  economicIndicators: z.string().describe('Relevant economic indicators for the crop and region.'),
});
export type MarketTrendForecastInput = z.infer<typeof MarketTrendForecastInputSchema>;

const MarketTrendForecastOutputSchema = z.object({
  forecastSummary: z.string().describe('A summary of the market trend forecast for the crop.'),
  suggestedSellingTime: z.string().describe('The suggested best time to sell the crop to maximize profits.'),
  reasoning: z.string().describe('The reasoning behind the market trend forecast and suggested selling time.'),
});
export type MarketTrendForecastOutput = z.infer<typeof MarketTrendForecastOutputSchema>;

export async function marketTrendForecast(input: MarketTrendForecastInput): Promise<MarketTrendForecastOutput> {
  return marketTrendForecastFlow(input);
}

const marketTrendForecastPrompt = ai.definePrompt({
  name: 'marketTrendForecastPrompt',
  input: {schema: MarketTrendForecastInputSchema},
  output: {schema: MarketTrendForecastOutputSchema},
  prompt: `You are an expert agricultural market analyst. Based on the provided information, generate a market trend forecast for the specified crop and suggest the best time to sell to maximize profits.

Crop Type: {{{cropType}}}
Region: {{{region}}}
Historical Price Data: {{{historicalPriceData}}}
Economic Indicators: {{{economicIndicators}}}

Consider all factors and provide a well-reasoned forecast and recommendation.

Output:
Forecast Summary:
Suggested Selling Time:
Reasoning:`,
});

const marketTrendForecastFlow = ai.defineFlow(
  {
    name: 'marketTrendForecastFlow',
    inputSchema: MarketTrendForecastInputSchema,
    outputSchema: MarketTrendForecastOutputSchema,
  },
  async input => {
    const {output} = await marketTrendForecastPrompt(input);
    return output!;
  }
);
