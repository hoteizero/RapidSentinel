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
  explanation: z.string().describe('A clear and concise explanation of the risk assessment.'),
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
  prompt: `You are an AI assistant designed to explain risk assessments to disaster managers.

  Based on the provided sensor data, risk score, risk category and contributing sensors, generate a clear and concise explanation of the AI's risk assessment.
  Highlight the key factors and data sources that contributed to the assessment, so that the disaster manager can understand and trust the AI's judgment.

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
