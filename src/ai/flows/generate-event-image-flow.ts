// src/ai/flows/generate-event-image-flow.ts
'use server';
/**
 * @fileOverview AI-powered image generator for event flyers.
 *
 * - generateEventImage - A function that generates images based on event details.
 * - GenerateEventImageInput - The input type for the generateEventImage function.
 * - GenerateEventImageOutput - The return type for the generateEventImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateEventImageInputSchema = z.object({
  eventDescription: z
    .string()
    .describe('A brief description of the event for which to generate an image.'),
});
export type GenerateEventImageInput = z.infer<typeof GenerateEventImageInputSchema>;

const GenerateEventImageOutputSchema = z.object({
  imageDataUri: z.string().describe('The generated image as a data URI.'),
});
export type GenerateEventImageOutput = z.infer<typeof GenerateEventImageOutputSchema>;

export async function generateEventImage(input: GenerateEventImageInput): Promise<GenerateEventImageOutput> {
  return generateEventImageFlow(input);
}

const generateEventImageFlow = ai.defineFlow(
  {
    name: 'generateEventImageFlow',
    inputSchema: GenerateEventImageInputSchema,
    outputSchema: GenerateEventImageOutputSchema,
  },
  async (input) => {
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.0-flash-exp', // IMPORTANT: Specific model for image generation
      prompt: `Generate a visually appealing and relevant flyer image for an event with the following description: '${input.eventDescription}'. The image should be suitable for an event flyer: captivating, high quality, and with a clear subject. Avoid adding text to the image unless it's naturally part of a scene (e.g., a sign). The style should be modern and engaging. A portrait orientation (like 3:4 aspect ratio) is preferred.`,
      config: {
        responseModalities: ['TEXT', 'IMAGE'], // Must include IMAGE
      },
    });

    if (!media?.url) {
      throw new Error('Image generation failed or no image was returned by the model.');
    }

    return { imageDataUri: media.url };
  }
);
