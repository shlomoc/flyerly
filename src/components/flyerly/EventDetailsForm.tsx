"use client";

import type { EventDetails } from '@/types/flyer';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface EventDetailsFormProps {
  eventDetails: EventDetails;
  onDetailsChange: (fieldName: keyof EventDetails, value: any) => void;
}

export default function EventDetailsForm({ eventDetails, onDetailsChange }: EventDetailsFormProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Event Details</CardTitle>
        <CardDescription>Enter the information for your event flyer.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="eventName" className="text-base">Event Name</Label>
          <Input
            id="eventName"
            placeholder="e.g., Summer Music Festival"
            value={eventDetails.name}
            onChange={(e) => onDetailsChange('name', e.target.value)}
            className="text-base"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="eventDescription" className="text-base">Event Description</Label>
          <Textarea
            id="eventDescription"
            placeholder="Briefly describe your event..."
            value={eventDetails.description}
            onChange={(e) => onDetailsChange('description', e.target.value)}
            className="min-h-[100px] text-base"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="eventDate" className="text-base">Event Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal text-base",
                  !eventDetails.date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {eventDetails.date ? format(eventDetails.date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={eventDetails.date}
                onSelect={(date) => onDetailsChange('date', date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2">
          <Label htmlFor="eventLocation" className="text-base">Event Location</Label>
          <Input
            id="eventLocation"
            placeholder="e.g., Central Park, New York"
            value={eventDetails.location}
            onChange={(e) => onDetailsChange('location', e.target.value)}
            className="text-base"
          />
        </div>
      </CardContent>
    </Card>
  );
}
