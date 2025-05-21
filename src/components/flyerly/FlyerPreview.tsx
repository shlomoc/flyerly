
"use client";

import type { EventDetails } from '@/types/flyer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { format } from 'date-fns';
import { CalendarDays, MapPin, Upload, Download, Palette, ImagePlus } from 'lucide-react';
import { Separator } from '../ui/separator';
import { useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

interface FlyerPreviewProps {
  eventDetails: EventDetails;
  tagline: string;
  currentImage: string | null; // Consolidated image prop
  onImageUpload: (imageDataUri: string) => void; // Callback for user uploads
}

const PLACEHOLDER_IMAGE_URL = "https://placehold.co/600x800.png";

export default function FlyerPreview({ eventDetails, tagline, currentImage, onImageUpload }: FlyerPreviewProps) {
  const imageSrc = currentImage || PLACEHOLDER_IMAGE_URL;
  const imageAlt = currentImage ? "Event Flyer Image" : "Flyer Preview Placeholder";
  const imageHint = currentImage ? "event flyer custom" : "event poster design";
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleUploadButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid File Type',
          description: 'Please select an image file (e.g., PNG, JPG, GIF).',
          variant: 'destructive',
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        onImageUpload(reader.result as string);
      };
      reader.onerror = () => {
        toast({
          title: 'File Read Error',
          description: 'Could not read the selected file.',
          variant: 'destructive',
        });
      };
      reader.readAsDataURL(file);
    }
    // Reset file input value to allow uploading the same file again if needed
    if (event.target) {
      event.target.value = '';
    }
  };

  const handleDownload = (format: 'png' | 'jpeg' | 'pdf') => {
    if (!currentImage || imageSrc === PLACEHOLDER_IMAGE_URL) {
      toast({
        title: 'No Image to Download',
        description: 'Please generate or upload an image for your flyer first.',
        variant: 'destructive',
      });
      return;
    }

    const link = document.createElement('a');
    link.href = imageSrc;
    
    const safeEventName = eventDetails.name.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'flyer';
    let filename = `${safeEventName}.${format === 'jpeg' ? 'jpg' : 'png'}`;
    let downloadMimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';

    // Forcing PNG for PDF for now
    if (format === 'pdf') {
      filename = `${safeEventName}_image.png`; // PDF download as image
      downloadMimeType = 'image/png';
      toast({
        title: 'Image Downloaded as PNG',
        description: 'Full PDF export with text and layout is a feature coming soon. The flyer image has been downloaded as a PNG.',
        duration: 6000,
      });
    }

    // If original image is PNG and user wants JPG, it will still download as PNG from data URI
    // unless we implement canvas conversion. For simplicity, we will download with the extension
    // the user asked for, but the actual content type depends on imageSrc.
    // Most browsers will handle this, or save it as .png if the data URI is PNG.
    // To truly convert to JPG, canvas methods would be needed.
    // For now, we just set the download attribute.
    if (format === 'jpeg' && imageSrc.startsWith('data:image/png')) {
        toast({
            title: 'Downloading as PNG',
            description: 'The current image is a PNG. It will be downloaded as a PNG file, even if JPG was selected. True JPG conversion will be added later.',
            duration: 6000,
        });
         filename = `${safeEventName}.png`; // Keep it as PNG
    } else if (format === 'jpeg') {
         filename = `${safeEventName}.jpg`;
    }


    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (format !== 'pdf') { // PDF toast is handled above
      toast({
        title: 'Download Started',
        description: `Your flyer image is downloading as ${filename}.`,
      });
    }
  };


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
            {!currentImage && ( // Show overlay only if no custom/AI image is present
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
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <Button variant="outline" className="w-full sm:w-auto" onClick={handleUploadButtonClick}>
            <Upload className="mr-2 h-4 w-4" /> Upload Image/Logo
          </Button>
          <div className="flex space-x-2">
            <Button variant="default" size="sm" className="bg-primary hover:bg-primary/90" onClick={() => handleDownload('png')}>PNG</Button>
            <Button variant="default" size="sm" className="bg-primary hover:bg-primary/90" onClick={() => handleDownload('jpeg')}>JPG</Button>
            <Button variant="default" size="sm" className="bg-primary hover:bg-primary/90" onClick={() => handleDownload('pdf')}>PDF</Button>
            <Button variant="ghost" size="icon" title="Download Options" onClick={() => handleDownload('png')}>
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
