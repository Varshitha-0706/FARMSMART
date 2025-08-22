'use server';

/**
 * @fileOverview Analyzes crop health from an image and provides diagnosis and suggested actions.
 *
 * - analyzeCropHealth - Analyzes crop health and suggests actions.
 * - AnalyzeCropHealthInput - The input type for the analyzeCropHealth function.
 * - AnalyzeCropHealthOutput - The return type for the analyzeCropHealth function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeCropHealthInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo of a crop leaf, as a data URI that must include a MIME type and use Base64 encoding. Expected format: data:<mimetype>;base64,<encoded_data>.'
    ),
});
export type AnalyzeCropHealthInput = z.infer<typeof AnalyzeCropHealthInputSchema>;

const AnalyzeCropHealthOutputSchema = z.object({
  problemIdentified: z.string().describe('The identified problem (e.g., Early Blight).'),
  confidencePercentage: z.number().describe('The confidence percentage (e.g., 92%).'),
  suggestedAction: z.string().describe('The suggested action (e.g., Spray organic fungicide).'),
});
export type AnalyzeCropHealthOutput = z.infer<typeof AnalyzeCropHealthOutputSchema>;

export async function analyzeCropHealth(input: AnalyzeCropHealthInput): Promise<AnalyzeCropHealthOutput> {
  return analyzeCropHealthFlow(input);
}

const analyzeCropHealthPrompt = ai.definePrompt({
  name: 'analyzeCropHealthPrompt',
  input: {schema: AnalyzeCropHealthInputSchema},
  output: {schema: AnalyzeCropHealthOutputSchema},
  prompt: `You are an AI assistant specialized in analyzing crop health based on images of crop leaves.

  Analyze the provided image and identify potential diseases, pests, or stress affecting the crop.
  Provide a confidence percentage for your diagnosis and suggest appropriate actions to address the issue.

  Analyze the following crop leaf image:
  {{media url=photoDataUri}}

  Format your response as follows:
  Problem Identified: [Identified Problem]
  Confidence Percentage: [Confidence Percentage]%
  Suggested Action: [Suggested Action]
  `,
});

const analyzeCropHealthFlow = ai.defineFlow(
  {
    name: 'analyzeCropHealthFlow',
    inputSchema: AnalyzeCropHealthInputSchema,
    outputSchema: AnalyzeCropHealthOutputSchema,
  },
  async input => {
    const {output} = await analyzeCropHealthPrompt(input);
    return output!;
  }
);
