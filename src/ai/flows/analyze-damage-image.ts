'use server';
/**
 * @fileOverview Analyzes an image of a disaster scene to assess the damage.
 *
 * - analyzeDamageImage - A function that handles the damage analysis process.
 * - AnalyzeDamageImageInput - The input type for the analyzeDamageImage function.
 * - AnalyzeDamageImageOutput - The return type for the analyzeDamageImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeDamageImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a disaster scene, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeDamageImageInput = z.infer<typeof AnalyzeDamageImageInputSchema>;

const AnalyzeDamageImageOutputSchema = z.object({
  analysis: z.string().describe("A textual description of the damage visible in the image."),
  estimatedDamageLevel: z.enum(['Low', 'Medium', 'High', 'Severe']).describe("The estimated level of damage."),
});
export type AnalyzeDamageImageOutput = z.infer<typeof AnalyzeDamageImageOutputSchema>;

export async function analyzeDamageImage(input: AnalyzeDamageImageInput): Promise<AnalyzeDamageImageOutput> {
  return analyzeDamageImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeDamageImagePrompt',
  input: {schema: AnalyzeDamageImageInputSchema},
  output: {schema: AnalyzeDamageImageOutputSchema},
  prompt: `You are an expert at analyzing images of disaster scenes to assess damage.
You will be provided with an image from a disaster area, potentially taken by a drone or a citizen.
Your task is to analyze the image and provide a structured assessment of the damage.

- Provide a concise textual analysis of the visible damage.
- Estimate the overall damage level (Low, Medium, High, Severe).

Photo: {{media url=photoDataUri}}`,
});

const analyzeDamageImageFlow = ai.defineFlow(
  {
    name: 'analyzeDamageImageFlow',
    inputSchema: AnalyzeDamageImageInputSchema,
    outputSchema: AnalyzeDamageImageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
