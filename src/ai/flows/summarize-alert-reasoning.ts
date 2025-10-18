'use server';

/**
 * @fileOverview Summarizes the reasoning behind an alert in a concise and human-readable format.
 *
 * - summarizeAlertReasoning - A function that summarizes the reasoning behind an alert.
 * - SummarizeAlertReasoningInput - The input type for the summarizeAlertReasoning function.
 * - SummarizeAlertReasoningOutput - The return type for the summarizeAlertReasoning function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeAlertReasoningInputSchema = z.object({
  sensorData: z
    .string()
    .describe("Aggregated sensor data contributing to the alert, including sensor type, value, and location."),
  riskCategory: z.string().describe('The category of risk associated with the alert (e.g., flood, earthquake).'),
  riskScore: z.number().describe('The overall risk score from 0-100 assigned to the alert.'),
  location: z.string().describe('The general location of the alert.'),
  time: z.string().describe('The time the alert was triggered.'),
  explanation: z.string().describe('Detailed explanation of which sensor contributed to the alert.')
});

export type SummarizeAlertReasoningInput = z.infer<typeof SummarizeAlertReasoningInputSchema>;

const SummarizeAlertReasoningOutputSchema = z.object({
  summary: z
    .string()
    .describe("A concise, human-readable summary of the alert's reasoning, including key contributing factors and sensor data."),
});

export type SummarizeAlertReasoningOutput = z.infer<typeof SummarizeAlertReasoningOutputSchema>;

export async function summarizeAlertReasoning(
  input: SummarizeAlertReasoningInput
): Promise<SummarizeAlertReasoningOutput> {
  return summarizeAlertReasoningFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeAlertReasoningPrompt',
  input: {schema: SummarizeAlertReasoningInputSchema},
  output: {schema: SummarizeAlertReasoningOutputSchema},
  prompt: `You are an AI assistant summarizing disaster alerts for operators.

  Given the following information about an alert, create a concise summary (1-2 sentences) explaining the reasoning behind the alert. Focus on the most critical contributing factors and sensor data. Make the summary easy to understand for a human operator who needs to quickly assess the situation.

  Risk Category: {{{riskCategory}}}
  Risk Score: {{{riskScore}}}
  Location: {{{location}}}
  Time: {{{time}}}
  Sensor Data: {{{sensorData}}}
 Explanation: {{{explanation}}}

  Summary:`,
});

const summarizeAlertReasoningFlow = ai.defineFlow(
  {
    name: 'summarizeAlertReasoningFlow',
    inputSchema: SummarizeAlertReasoningInputSchema,
    outputSchema: SummarizeAlertReasoningOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
