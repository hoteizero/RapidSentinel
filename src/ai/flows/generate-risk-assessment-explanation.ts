'use server';

/**
 * @fileOverview A flow that generates a clear and concise explanation of the AI's risk assessment.
 *
 * - generateRiskAssessmentExplanation - A function that generates the explanation.
 * - GenerateRiskAssessmentExplanationInput - The input type for the generateRiskAssessmentExplanation function.
 * - GenerateRiskAssessmentExplanationOutput - The return type for the generateRiskAssessmentExplanation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRiskAssessmentExplanationInputSchema = z.object({
  sensorData: z.string().describe('Aggregated sensor data including type, value, location, and timestamp.'),
  riskScore: z.number().describe('The calculated risk score (0-100).'),
  riskCategory: z.string().describe('The risk category (e.g., low, medium, high).'),
  contributingSensors: z.string().describe('List of sensors contributing to the risk assessment.'),
});
export type GenerateRiskAssessmentExplanationInput = z.infer<
  typeof GenerateRiskAssessmentExplanationInputSchema
>;

const GenerateRiskAssessmentExplanationOutputSchema = z.object({
  explanation: z.string().describe('A clear and concise explanation of the risk assessment, in Japanese.'),
});
export type GenerateRiskAssessmentExplanationOutput = z.infer<
  typeof GenerateRiskAssessmentExplanationOutputSchema
>;

export async function generateRiskAssessmentExplanation(
  input: GenerateRiskAssessmentExplanationInput
): Promise<GenerateRiskAssessmentExplanationOutput> {
  return generateRiskAssessmentExplanationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRiskAssessmentExplanationPrompt',
  input: {schema: GenerateRiskAssessmentExplanationInputSchema},
  output: {schema: GenerateRiskAssessmentExplanationOutputSchema},
  prompt: `あなたは、災害管理者向けにリスク評価を説明するために設計されたAIアシスタントです。

提供されたセンサーデータ、リスクスコア、リスクカテゴリ、および寄与しているセンサーに基づき、AIのリスク評価に関する明確かつ簡潔な説明を生成してください。
災害管理者がAIの判断を理解し、信頼できるように、評価に寄与した主要な要因とデータソースを強調してください。

説明は必ず日本語で生成してください。

Sensor Data: {{{sensorData}}}
Risk Score: {{{riskScore}}}
Risk Category: {{{riskCategory}}}
Contributing Sensors: {{{contributingSensors}}}

Explanation:`,
});

const generateRiskAssessmentExplanationFlow = ai.defineFlow(
  {
    name: 'generateRiskAssessmentExplanationFlow',
    inputSchema: GenerateRiskAssessmentExplanationInputSchema,
    outputSchema: GenerateRiskAssessmentExplanationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
