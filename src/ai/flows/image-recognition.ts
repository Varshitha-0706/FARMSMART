// 'use server';

/**
 * @fileOverview Image recognition flow for pest and disease detection.
 *
 * - imageRecognition - A function that handles the image recognition process.
 * - ImageRecognitionInput - The input type for the imageRecognition function.
 * - ImageRecognitionOutput - The return type for the imageRecognition function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImageRecognitionInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ImageRecognitionInput = z.infer<typeof ImageRecognitionInputSchema>;

const ImageRecognitionOutputSchema = z.object({
  pestOrDiseaseDetected: z
    .boolean()
    .describe('Whether a pest or disease is detected in the image.'),
  identification: z
    .string()
    .describe('The identified pest or disease, if any.'),
  confidence: z
    .number()
    .describe('The confidence level of the identification (0-1).'),
  suggestedActions: z
    .string()
    .describe('Suggested actions to address the identified pest or disease.'),
});
export type ImageRecognitionOutput = z.infer<typeof ImageRecognitionOutputSchema>;

export async function imageRecognition(input: ImageRecognitionInput): Promise<ImageRecognitionOutput> {
  return imageRecognitionFlow(input);
}

const imageRecognitionPrompt = ai.definePrompt({
  name: 'imageRecognitionPrompt',
  input: {schema: ImageRecognitionInputSchema},
  output: {schema: ImageRecognitionOutputSchema},
  prompt: `You are an expert in plant pathology. Analyze the image of the plant and determine if any pests or diseases are present.

  Based on the image, provide the following information:

  - pestOrDiseaseDetected: true if a pest or disease is detected, otherwise false.
  - identification: The name of the pest or disease detected (if any).
  - confidence: Your confidence level (0-1) in the identification.
  - suggestedActions:  list of suggested actions to address the identified pest or disease.

  Analyze the following image: {{media url=photoDataUri}}`,
});

const imageRecognitionFlow = ai.defineFlow(
  {
    name: 'imageRecognitionFlow',
    inputSchema: ImageRecognitionInputSchema,
    outputSchema: ImageRecognitionOutputSchema,
  },
  async input => {
    const {output} = await imageRecognitionPrompt(input);
    return output!;
  }
);
