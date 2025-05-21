
// src/components/flyerly/AiImageGenerator.tsx
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { generateEventImage, type GenerateEventImageInput } from '@/ai/flows/generate-event-image-flow';
import { ImageIcon, AlertTriangle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

interface AiImageGeneratorProps {
  eventDescription: string;
  onImageGenerated: (imageDataUri: string) => void;
  currentImageUrl?: string | null; // This will now reflect the activeFlyerImage from HomePage
}

export default function AiImageGenerator({ eventDescription, onImageGenerated, currentImageUrl }: AiImageGeneratorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerateImage = async () => {
    if (!eventDescription.trim()) {
      toast({
        title: "Event Description Missing",
        description: "Please provide an event description before generating an image.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const input: GenerateEventImageInput = { eventDescription };
      const result = await generateEventImage(input);
      onImageGenerated(result.imageDataUri); // This now updates activeFlyerImage in HomePage
      toast({
        title: "AI Image Generated!",
        description: "A new event image has been successfully created by AI.",
      });
    } catch (e) {
      console.error("Error generating image:", e);
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred during image generation.";
      setError(errorMessage);
      toast({
        title: "Error Generating Image",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center">
          <ImageIcon className="mr-2 h-6 w-6 text-primary" />
          AI Event Image
        </CardTitle>
        <CardDescription>Create a unique image for your event flyer based on its description.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={handleGenerateImage} 
          disabled={isLoading || !eventDescription} 
          className="w-full text-base py-3"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Generating Image...
            </>
          ) : (
            <>
              Generate AI Image
              <ImageIcon className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>
        {error && (
          <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Error: {error}
          </div>
        )}
        {currentImageUrl && !isLoading && !error && (
          <div className="mt-4">
            <p className="text-sm font-medium text-muted-foreground mb-2">Current Flyer Image Preview:</p>
            <div className="rounded-md border overflow-hidden aspect-[4/3] relative">
              <Image 
                src={currentImageUrl} 
                alt="Current Event Flyer Image Thumbnail" 
                layout="fill" 
                objectFit="contain"
                key={currentImageUrl} 
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
