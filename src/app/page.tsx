"use client";

import { useState, useCallback } from 'react';
import type { EventDetails } from '@/types/flyer';
import AiTaglineGenerator from '@/components/flyerly/AiTaglineGenerator';
import EventDetailsForm from '@/components/flyerly/EventDetailsForm';
import FlyerPreview from '@/components/flyerly/FlyerPreview';
import TemplateLibrary from '@/components/flyerly/TemplateLibrary'; // Placeholder

export default function HomePage() {
  const [eventDetails, setEventDetails] = useState<EventDetails>({
    name: 'My Awesome Event',
    description: 'Join us for an unforgettable experience filled with fun, music, and networking opportunities. This event is perfect for professionals and enthusiasts alike. We will have guest speakers, workshops, and a grand finale party!',
    date: new Date(),
    location: '123 Main Street, Anytown, USA',
  });
  const [tagline, setTagline] = useState<string>('Your Amazing Tagline Goes Here!');
  // const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null); // For future use

  const handleDetailsChange = useCallback((fieldName: keyof EventDetails, value: any) => {
    setEventDetails(prevDetails => ({
      ...prevDetails,
      [fieldName]: value,
    }));
  }, []);

  const handleTaglineGenerated = useCallback((newTagline: string) => {
    setTagline(newTagline);
  }, []);

  // const handleTemplateSelect = useCallback((templateId: string) => { // For future use
  //   setSelectedTemplate(templateId);
  //   // Potentially load template data and update eventDetails or flyer styles
  // }, []);

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
          <TemplateLibrary 
            // onSelectTemplate={handleTemplateSelect} // For future use
          />
        </section>

        {/* Right Column: Preview */}
        <section className="lg:w-[65%] xl:w-[70%]">
          <FlyerPreview
            eventDetails={eventDetails}
            tagline={tagline}
            // selectedTemplate={selectedTemplate} // For future use
          />
        </section>
      </div>
    </div>
  );
}
