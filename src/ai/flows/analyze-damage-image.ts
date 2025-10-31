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
  analysis: z.string().describe("画像から視認できる被害状況の日本語による説明。"),
  estimatedDamageLevel: z.enum(['低い', '中程度', '高い', '深刻']).describe("推定される被害レベル。"),
});
export type AnalyzeDamageImageOutput = z.infer<typeof AnalyzeDamageImageOutputSchema>;

export async function analyzeDamageImage(input: AnalyzeDamageImageInput): Promise<AnalyzeDamageImageOutput> {
  return analyzeDamageImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeDamageImagePrompt',
  input: {schema: AnalyzeDamageImageInputSchema},
  output: {schema: AnalyzeDamageImageOutputSchema},
  prompt: `あなたは災害現場の画像を分析して被害状況を評価する専門家です。
ドローンや市民から撮影された災害地域の画像が提供されます。
あなたのタスクは、画像を分析し、構造化された被害評価を提供することです。

応答は必ず日本語で行ってください。

- 視認できる被害について、簡潔な日本語のテキストで分析を提供してください。
- 全体的な被害レベルを「低い」「中程度」「高い」「深刻」のいずれかで推定してください。

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
