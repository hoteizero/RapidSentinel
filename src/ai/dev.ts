import { config } from 'dotenv';
config();

import '@/ai/flows/personalize-alert-message.ts';
import '@/ai/flows/summarize-alert-reasoning.ts';
import '@/ai/flows/generate-risk-assessment-explanation.ts';
import '@/ai/flows/analyze-damage-image.ts';
import '@/ai/flows/generate-speech.ts';
