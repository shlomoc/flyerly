"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { generateTagline, type GenerateTaglineInput } from '@/ai/flows/generate-tagline';
import { Wand2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AiTaglineGeneratorProps {
  eventDescription: string;
  onTaglineGenerated: (tagline: string) => void;
  currentTagline: string;
}

export default function AiTaglineGenerator({ eventDescription, onTaglineGenerated, currentTagline }: AiTaglineGeneratorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerateTagline = async () => {
    if (!eventDescription.trim()) {
      toast({
        title: "Event Description Missing",
        description: "Please provide an event description before generating a tagline.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const input: GenerateTaglineInput = { eventDescription };
      const result = await generateTagline(input);
      onTaglineGenerated(result.tagline);
      toast({
        title: "Tagline Generated!",
        description: "A new tagline has been successfully created.",
      });
    } catch (e) {
      console.error("Error generating tagline:", e);
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred";
      setError(errorMessage);
      toast({
        title: "Error Generating Tagline",
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
          <Wand2 className="mr-2 h-6 w-6 text-primary" />
          AI Tagline Generator
        </CardTitle>
        <CardDescription>Let AI create a catchy tagline for your event based on its description.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleGenerateTagline} disabled={isLoading || !eventDescription} className="w-full text-base py-3">
          {isLoading ? 'Generating...' : 'Generate Tagline'}
          {!isLoading && <Wand2 className="ml-2 h-5 w-5" />}
        </Button>
        {error && (
          <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Error: {error}
          </div>
        )}
        {currentTagline && (
          <div>
            <label className="text-sm font-medium text-muted-foreground">Generated Tagline:</label>
            <p className="p-3 mt-1 rounded-md border bg-muted text-base">{currentTagline}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
