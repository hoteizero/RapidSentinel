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
    .describe("A concise, human-readable summary of the alert's reasoning, in Japanese."),
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
  prompt: `あなたは防災担当者向けに災害警報を要約するAIアシスタントです。

警報に関する以下の情報に基づき、警報の根拠を説明する簡潔な要約（1～2文）を作成してください。最も重要な要因とセンサーデータに焦点を当ててください。人間のオペレーターが状況を迅速に評価できるよう、要約は分かりやすくしてください。

要約は必ず日本語で生成してください。

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
