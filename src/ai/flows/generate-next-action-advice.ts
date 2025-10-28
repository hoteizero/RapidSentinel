'use server';
/**
 * @fileOverview Generates advice for the next action based on the current risk assessment.
 * This flow is designed to be processed on decentralized compute like IO.net.
 *
 * - generateNextActionAdvice - A function that generates the advice.
 * - GenerateNextActionAdviceInput - The input type for the generateNextActionAdvice function.
 * - GenerateNextActionAdviceOutput - The return type for the generateNextActionAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateNextActionAdviceInputSchema = z.object({
  riskScore: z.number().describe('The calculated risk score (0-100).'),
  riskCategory: z.string().describe('The risk category (e.g., low, medium, high, severe).'),
  location: z.string().describe('The location of the alert.'),
  analysisDetails: z.string().describe('A summary of the AI analysis and physical verification results.'),
});
export type GenerateNextActionAdviceInput = z.infer<typeof GenerateNextActionAdviceInputSchema>;

const GenerateNextActionAdviceOutputSchema = z.object({
  advice: z.string().describe('A clear, actionable recommendation for the disaster response manager.'),
});
export type GenerateNextActionAdviceOutput = z.infer<typeof GenerateNextActionAdviceOutputSchema>;

export async function generateNextActionAdvice(
  input: GenerateNextActionAdviceInput
): Promise<GenerateNextActionAdviceOutput> {
  return generateNextActionAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateNextActionAdvicePrompt',
  input: {schema: GenerateNextActionAdviceInputSchema},
  output: {schema: GenerateNextActionAdviceOutputSchema},
  prompt: `You are a world-class disaster management AI advisor. Your recommendations are processed on decentralized compute resources (IO.net) to ensure availability and speed.

  Given the following critical situation summary, provide a clear, concise, and actionable recommendation for the human operator. The recommendation should be prioritized and formatted as a list.

  **Situation Summary:**
  - **Location:** {{{location}}}
  - **Risk Level:** {{{riskCategory}}} (Score: {{{riskScore}}})
  - **Key Findings:** {{{analysisDetails}}}

  **Your Task:**
  Generate a prioritized list of 2-3 recommended actions for the operator. Be direct and specific.

  Example format:
  1. [Highest Priority Action]
  2. [Second Priority Action]
  3. [Contingency or Monitoring Action]
  
  **Generated Advice:**`,
});

const generateNextActionAdviceFlow = ai.defineFlow(
  {
    name: 'generateNextActionAdviceFlow',
    inputSchema: GenerateNextActionAdviceInputSchema,
    outputSchema: GenerateNextActionAdviceOutputSchema,
  },
  async input => {
    // In a real scenario, this flow could trigger a complex simulation or model on IO.net.
    // Here, we simulate that by calling the Genkit prompt.
    const {output} = await prompt(input);
    return output!;
  }
);
