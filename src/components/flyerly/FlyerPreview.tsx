
"use client";

import type { EventDetails } from '@/types/flyer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { format } from 'date-fns';
import { CalendarDays, MapPin, Upload, Download } from 'lucide-react';
import { Separator } from '../ui/separator';
import { useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';

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
  const imageHint = currentImage ? "event flyer custom" : "event poster"; // Max two words
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
    if (event.target) {
      event.target.value = '';
    }
  };

  const handleDownload = async (formatType: 'png' | 'pdf') => {
    const safeEventName = eventDetails.name.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'flyer';

    if (formatType === 'pdf') {
      if (!currentImage && !eventDetails.name && !tagline && !eventDetails.date && !eventDetails.location && !eventDetails.description) {
         toast({
          title: 'Cannot Generate PDF',
          description: 'Please provide some event details or an image before generating a PDF.',
          variant: 'destructive',
        });
        return;
      }
      toast({
        title: 'Generating PDF...',
        description: 'Please wait while your flyer PDF is being created.',
      });

      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'px', 
        format: [600, 800], 
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 30; 
      let currentY = margin;

      // Add Image
      if (currentImage) {
        try {
          const img = new window.Image();
          img.src = currentImage;
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
          });
          
          const imgWidth = img.width;
          const imgHeight = img.height;
          const aspectRatio = imgWidth / imgHeight;

          let pdfImgWidth = pageWidth - 2 * margin;
          let pdfImgHeight = pdfImgWidth / aspectRatio;
          
          const maxImageHeight = pageHeight * 0.5; // Max 50% of page for image to leave space for text
          if (pdfImgHeight > maxImageHeight) {
            pdfImgHeight = maxImageHeight;
            pdfImgWidth = pdfImgHeight * aspectRatio;
          }
          
          const xPosImg = (pageWidth - pdfImgWidth) / 2;
          doc.addImage(currentImage, 'PNG', xPosImg, currentY, pdfImgWidth, pdfImgHeight); // Use currentImage (which should be base64)
          currentY += pdfImgHeight + 20; // Space after image
        } catch (e) {
            console.error("Error adding image to PDF: ", e);
            toast({ title: "PDF Image Error", description: "Could not add image to PDF. Proceeding with text only.", variant: "destructive"});
            currentY += 20; // Add some space if image fails
        }
      } else {
         currentY += 20; // Space if no image
      }

      // Event Name
      doc.setFontSize(28);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(45, 55, 72); // Primary color (approximating --primary: 230 79% 66%;)
      const eventNameLines = doc.splitTextToSize(eventDetails.name || "Event Name", pageWidth - 2 * margin);
      doc.text(eventNameLines, pageWidth / 2, currentY, { align: 'center' });
      currentY += (eventNameLines.length * 20) + 10; // Adjust based on lines

      // Tagline
      if (tagline) {
        doc.setFontSize(16);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(107, 33, 168); // Accent color (approximating --accent: 260 79% 70%;)
        const taglineLines = doc.splitTextToSize(tagline, pageWidth - 2 * margin - 20);
        doc.text(taglineLines, pageWidth / 2, currentY, { align: 'center' });
        currentY += (taglineLines.length * 12) + 15;
      }
      
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(29, 37, 53); // Foreground color (approximating --foreground: 224 71.4% 4.1%;)

      // Date
      if (eventDetails.date) {
        doc.setFontSize(12);
        doc.text(format(eventDetails.date, "EEEE, MMMM dd, yyyy 'at' h:mm a"), margin, currentY);
        currentY += 20;
      }

      // Location
      if (eventDetails.location) {
        doc.setFontSize(12);
        const locationLines = doc.splitTextToSize(eventDetails.location, pageWidth - 2 * margin);
        doc.text(locationLines, margin, currentY);
        currentY += (locationLines.length * 12) + 10;
      }
      
      // Description
      if (eventDetails.description) {
        currentY += 5; 
        doc.setFontSize(10);
        const descriptionLines = doc.splitTextToSize(eventDetails.description, pageWidth - 2 * margin);
        doc.text(descriptionLines, margin, currentY);
      }

      doc.save(`${safeEventName}.pdf`);
      toast({
        title: 'PDF Downloaded!',
        description: `Your flyer has been downloaded as ${safeEventName}.pdf.`,
      });
      return;
    }

    // Image download logic (PNG) - this branch will be less used now but kept for robustness
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
    
    const filename = `${safeEventName}.png`;
    
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: 'Download Started',
      description: `Your flyer image is downloading as ${filename}.`,
    });
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
              key={imageSrc} 
            />
            {!currentImage && ( 
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
            {/* Removed PDF button, Download icon now handles PDF */}
            <Button variant="ghost" size="icon" title="Download Flyer as PDF" onClick={() => handleDownload('pdf')}>
                <Download className="h-5 w-5"/>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

