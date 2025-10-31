'use server';
/**
 * @fileOverview A flow to personalize alert messages with relevant information such as evacuation routes or nearby shelters.
 *
 * - personalizeAlertMessage - A function that personalizes alert messages.
 * - PersonalizeAlertMessageInput - The input type for the personalizeAlertMessage function.
 * - PersonalizeAlertMessageOutput - The return type for the personalizeAlertMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizeAlertMessageInputSchema = z.object({
  alertMessage: z.string().describe('The original alert message.'),
  location: z.string().describe('The location of the user. e.g. 123 Main Street, Anytown'),
  role: z.string().describe('The role of the user. e.g. citizen, fire fighter, police officer'),
  nearbyShelters: z.string().describe('A list of nearby shelters and their locations'),
  evacuationRoutes: z.string().describe('A description of the available evacuation routes.'),
});
export type PersonalizeAlertMessageInput = z.infer<typeof PersonalizeAlertMessageInputSchema>;

const PersonalizeAlertMessageOutputSchema = z.object({
  personalizedMessage: z.string().describe('The personalized alert message, in Japanese.'),
});
export type PersonalizeAlertMessageOutput = z.infer<typeof PersonalizeAlertMessageOutputSchema>;

export async function personalizeAlertMessage(input: PersonalizeAlertMessageInput): Promise<PersonalizeAlertMessageOutput> {
  return personalizeAlertMessageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizeAlertMessagePrompt',
  input: {schema: PersonalizeAlertMessageInputSchema},
  output: {schema: PersonalizeAlertMessageOutputSchema},
  prompt: `あなたは災害状況における警報メッセージのパーソナライズを専門としています。

元の警報メッセージ、ユーザーの場所と役割、近くの避難所のリスト、および避難経路の説明が提供されます。

あなたの目標は、ユーザーにとって可能な限り役立つように警報メッセージをパーソナライズすることです。
メッセージは必ず日本語で生成してください。

Original Alert Message: {{{alertMessage}}}
User Location: {{{location}}}
User Role: {{{role}}}
Nearby Shelters: {{{nearbyShelters}}}
Evacuation Routes: {{{evacuationRoutes}}}

Personalized Alert Message:`,
});

const personalizeAlertMessageFlow = ai.defineFlow(
  {
    name: 'personalizeAlertMessageFlow',
    inputSchema: PersonalizeAlertMessageInputSchema,
    outputSchema: PersonalizeAlertMessageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
