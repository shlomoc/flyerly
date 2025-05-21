// src/ai/flows/generate-tagline.ts
'use server';

/**
 * @fileOverview AI-powered tagline generator for event flyers.
 *
 * - generateTagline - A function that generates taglines based on event details.
 * - GenerateTaglineInput - The input type for the generateTagline function.
 * - GenerateTaglineOutput - The return type for the generateTagline function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTaglineInputSchema = z.object({
  eventDescription: z
    .string()
    .describe('A brief description of the event for which to generate a tagline.'),
});
export type GenerateTaglineInput = z.infer<typeof GenerateTaglineInputSchema>;

const GenerateTaglineOutputSchema = z.object({
  tagline: z.string().describe('A creative and engaging tagline for the event.'),
});
export type GenerateTaglineOutput = z.infer<typeof GenerateTaglineOutputSchema>;

export async function generateTagline(input: GenerateTaglineInput): Promise<GenerateTaglineOutput> {
  return generateTaglineFlow(input);
}

const generateTaglinePrompt = ai.definePrompt({
  name: 'generateTaglinePrompt',
  input: {schema: GenerateTaglineInputSchema},
  output: {schema: GenerateTaglineOutputSchema},
  prompt: `You are a marketing expert specializing in creating catchy taglines for events.

  Generate a single, creative, and engaging tagline for the following event:

  Event Description: {{{eventDescription}}}
  `,
});

const generateTaglineFlow = ai.defineFlow(
  {
    name: 'generateTaglineFlow',
    inputSchema: GenerateTaglineInputSchema,
    outputSchema: GenerateTaglineOutputSchema,
  },
  async input => {
    const {output} = await generateTaglinePrompt(input);
    return output!;
  }
);
