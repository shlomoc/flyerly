"use client";

import type { EventDetails } from '@/types/flyer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input'; // For file input styling (not used currently)
import Image from 'next/image';
import { format } from 'date-fns';
import { CalendarDays, MapPin, Upload, Download, Palette, ImagePlus } from 'lucide-react';
import { Separator } from '../ui/separator';

interface FlyerPreviewProps {
  eventDetails: EventDetails;
  tagline: string;
  flyerImage?: string | null;
}

export default function FlyerPreview({ eventDetails, tagline, flyerImage }: FlyerPreviewProps) {
  const imageSrc = flyerImage || "https://placehold.co/600x800.png";
  const imageAlt = flyerImage ? "AI Generated Event Flyer Image" : "Flyer Preview Placeholder";
  const imageHint = flyerImage ? "event flyer custom" : "event poster design";

  return (
    <div className="space-y-6">
      <Card className="shadow-xl w-full max-w-2xl mx-auto overflow-hidden">
        <CardHeader className="bg-primary/10 p-4 sm:p-6">
          <CardTitle className="text-3xl sm:text-4xl font-bold text-primary text-center break-words">
            {eventDetails.name || "Event Name"}
          </CardTitle>
          {tagline && (
            <CardDescription className="text-lg sm:text-xl text-accent text-center italic mt-1 break-words">
              {tagline}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="p-4 sm:p-6 space-y-4">
          <div className="aspect-[3/4] bg-muted rounded-md flex items-center justify-center overflow-hidden relative">
            <Image 
              src={imageSrc}
              alt={imageAlt}
              width={600}
              height={800}
              className="object-cover w-full h-full"
              data-ai-hint={imageHint}
              key={imageSrc} // Add key to force re-render on src change for data URIs
            />
            {/* Example overlay text - this would be part of drag-and-drop, or dynamic based on template */}
            {/* Consider if this overlay should be shown if a custom image is present or if the custom image should be the full content */}
            {!flyerImage && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-black/20">
                <h2 className="text-white text-2xl font-bold text-center shadow-lg">{eventDetails.name || "Your Event Title"}</h2>
                <p className="text-white text-md text-center shadow-md">{tagline || "Catchy Tagline Here"}</p>
              </div>
            )}
          </div>

          <Separator />

          <div className="space-y-3 text-sm sm:text-base">
            {eventDetails.date && (
              <div className="flex items-center">
                <CalendarDays className="h-5 w-5 mr-3 text-primary" />
                <span>{format(eventDetails.date, "EEEE, MMMM dd, yyyy 'at' h:mm a")}</span>
              </div>
            )}
            {eventDetails.location && (
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-3 text-primary" />
                <span className="break-words">{eventDetails.location}</span>
              </div>
            )}
            {eventDetails.description && (
              <div className="pt-2">
                <h4 className="font-semibold mb-1 text-primary">About the Event:</h4>
                <p className="text-muted-foreground break-words whitespace-pre-line">{eventDetails.description}</p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between items-center p-4 sm:p-6 bg-secondary/30 gap-2">
          <Button variant="outline" className="w-full sm:w-auto">
            <Upload className="mr-2 h-4 w-4" /> Upload Image/Logo
          </Button>
          <div className="flex space-x-2">
            <Button variant="default" size="sm" className="bg-primary hover:bg-primary/90">PNG</Button>
            <Button variant="default" size="sm" className="bg-primary hover:bg-primary/90">JPG</Button>
            <Button variant="default" size="sm" className="bg-primary hover:bg-primary/90">PDF</Button>
            <Button variant="ghost" size="icon" title="Download Options">
                <Download className="h-5 w-5"/>
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      {/* Placeholder for Drag-and-Drop Editor Tools */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Palette className="mr-2 h-5 w-5 text-primary"/> Flyer Editor Tools
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Drag-and-drop interface for flyer customization, image upload, and text editing will be available here.
            This feature is currently under development.
          </p>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
            <Button variant="outline" disabled><ImagePlus className="mr-2 h-4 w-4"/> Add Image</Button>
            <Button variant="outline" disabled>Add Text</Button>
            <Button variant="outline" disabled>Add Shape</Button>
            <Button variant="outline" disabled>Change Colors</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
