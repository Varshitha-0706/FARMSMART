'use server';

/**
 * @fileOverview A flow to explain the confidence score of an AI diagnosis.
 *
 * - explainConfidenceScore - A function that handles the explanation of the confidence score.
 * - ExplainConfidenceScoreInput - The input type for the explainConfidenceScore function.
 * - ExplainConfidenceScoreOutput - The return type for the explainConfidenceScore function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainConfidenceScoreInputSchema = z.object({
  problemIdentified: z.string().describe('The identified problem with the crop.'),
  confidencePercentage: z.number().describe('The confidence percentage of the diagnosis.'),
  suggestedAction: z.string().describe('The suggested action to take.'),
});
export type ExplainConfidenceScoreInput = z.infer<typeof ExplainConfidenceScoreInputSchema>;

const ExplainConfidenceScoreOutputSchema = z.object({
  explanation: z.string().describe('The explanation of the confidence score.'),
});
export type ExplainConfidenceScoreOutput = z.infer<typeof ExplainConfidenceScoreOutputSchema>;

export async function explainConfidenceScore(input: ExplainConfidenceScoreInput): Promise<ExplainConfidenceScoreOutput> {
  return explainConfidenceScoreFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainConfidenceScorePrompt',
  input: {schema: ExplainConfidenceScoreInputSchema},
  output: {schema: ExplainConfidenceScoreOutputSchema},
  prompt: `You are an AI assistant designed to explain the confidence score of an AI diagnosis to farmers.

  Problem Identified: {{{problemIdentified}}}
  Confidence Percentage: {{{confidencePercentage}}}
  Suggested Action: {{{suggestedAction}}}

  Explain the confidence score in simple terms so that the farmer can understand the certainty of the diagnosis and make better decisions about the recommended actions.
`,
});

const explainConfidenceScoreFlow = ai.defineFlow(
  {
    name: 'explainConfidenceScoreFlow',
    inputSchema: ExplainConfidenceScoreInputSchema,
    outputSchema: ExplainConfidenceScoreOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
