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
  personalizedMessage: z.string().describe('The personalized alert message.'),
});
export type PersonalizeAlertMessageOutput = z.infer<typeof PersonalizeAlertMessageOutputSchema>;

export async function personalizeAlertMessage(input: PersonalizeAlertMessageInput): Promise<PersonalizeAlertMessageOutput> {
  return personalizeAlertMessageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizeAlertMessagePrompt',
  input: {schema: PersonalizeAlertMessageInputSchema},
  output: {schema: PersonalizeAlertMessageOutputSchema},
  prompt: `You are an expert at personalizing alert messages for disaster situations.

You will be provided with the original alert message, the user's location and role, a list of nearby shelters, and a description of evacuation routes.

Your goal is to personalize the alert message to be as helpful as possible for the user.

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
