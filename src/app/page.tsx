
"use client";

import { useState, useCallback } from 'react';
import type { EventDetails } from '@/types/flyer';
import AiTaglineGenerator from '@/components/flyerly/AiTaglineGenerator';
import AiImageGenerator from '@/components/flyerly/AiImageGenerator';
import EventDetailsForm from '@/components/flyerly/EventDetailsForm';
import FlyerPreview from '@/components/flyerly/FlyerPreview';
import TemplateLibrary from '@/components/flyerly/TemplateLibrary';
import { useToast } from '@/hooks/use-toast';
import { exampleTemplates } from '@/data/templates'; // Import example templates

export default function HomePage() {
  const [eventDetails, setEventDetails] = useState<EventDetails>({
    name: 'My Awesome Event',
    description: 'Join us for an unforgettable experience filled with fun, music, and networking opportunities. This event is perfect for professionals and enthusiasts alike. We will have guest speakers, workshops, and a grand finale party!',
    date: new Date(),
    location: '123 Main Street, Anytown, USA',
  });
  const [tagline, setTagline] = useState<string>('Your Amazing Tagline Goes Here!');
  const [activeFlyerImage, setActiveFlyerImage] = useState<string | null>(null);
  const [currentImageHint, setCurrentImageHint] = useState<string>('event poster'); // For placeholder image hint
  const { toast } = useToast();

  const handleDetailsChange = useCallback((fieldName: keyof EventDetails, value: any) => {
    setEventDetails(prevDetails => ({
      ...prevDetails,
      [fieldName]: value,
    }));
  }, []);

  const handleTaglineGenerated = useCallback((newTagline: string) => {
    setTagline(newTagline);
  }, []);

  const handleAiImageGenerated = useCallback((newImageDataUri: string) => {
    setActiveFlyerImage(newImageDataUri);
    setCurrentImageHint('event flyer custom'); // Update hint when AI image is set
    toast({
      title: "AI Image Set!",
      description: "The AI generated image is now set as the flyer image.",
    });
  }, [toast]);

  const handleUserImageUpload = useCallback((imageDataUri: string) => {
    setActiveFlyerImage(imageDataUri);
    setCurrentImageHint('event flyer custom'); // Update hint when user image is set
    toast({
      title: "Image Uploaded!",
      description: "Your image has been set as the flyer image.",
    });
  }, [toast]);

  const handleTemplateSelect = useCallback((templateId: string) => {
    const selectedTemplate = exampleTemplates.find(t => t.id === templateId);
    if (selectedTemplate) {
      setEventDetails(prevDetails => ({
        ...prevDetails, // Keep existing date and location unless specified by template
        name: selectedTemplate.defaultEventName || prevDetails.name,
        description: selectedTemplate.defaultEventDescription || prevDetails.description,
        // date: selectedTemplate.defaultDate || prevDetails.date, // Example if templates could set dates
        // location: selectedTemplate.defaultLocation || prevDetails.location, // Example for location
      }));
      setTagline(selectedTemplate.defaultTagline || 'Your Amazing Tagline Goes Here!');
      setActiveFlyerImage(null); // Reset to placeholder
      setCurrentImageHint(selectedTemplate.defaultImageHint || 'event poster');
      toast({
        title: "Template Selected!",
        description: `The "${selectedTemplate.name}" template has been applied.`,
      });
    }
  }, [toast]);

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: Controls */}
        <section className="lg:w-[35%] xl:w-[30%] space-y-8">
          <EventDetailsForm
            eventDetails={eventDetails}
            onDetailsChange={handleDetailsChange}
          />
          <AiTaglineGenerator
            eventDescription={eventDetails.description}
            onTaglineGenerated={handleTaglineGenerated}
            currentTagline={tagline}
          />
          <AiImageGenerator
            eventDescription={eventDetails.description}
            onImageGenerated={handleAiImageGenerated}
            currentImageUrl={activeFlyerImage}
          />
          <TemplateLibrary 
            onSelectTemplate={handleTemplateSelect}
          />
        </section>

        {/* Right Column: Preview */}
        <section className="lg:w-[65%] xl:w-[70%]">
          <FlyerPreview
            eventDetails={eventDetails}
            tagline={tagline}
            currentImage={activeFlyerImage}
            onImageUpload={handleUserImageUpload}
            currentImageHint={currentImageHint} 
          />
        </section>
      </div>
    </div>
  );
}
