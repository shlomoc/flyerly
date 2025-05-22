"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Palette } from "lucide-react";
import type { Template } from "@/types/flyer";
import { exampleTemplates } from "@/data/templates"; // Import from new data file

interface TemplateLibraryProps {
  onSelectTemplate?: (templateId: string) => void;
}

export default function TemplateLibrary({ onSelectTemplate }: TemplateLibraryProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center">
          <Palette className="mr-2 h-6 w-6 text-primary" />
          Template Library
        </CardTitle>
        <CardDescription>Select a template to pre-fill event details and get a head start.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full whitespace-nowrap rounded-md">
          <div className="flex w-max space-x-4 p-4">
            {exampleTemplates.map((template) => (
              <Card key={template.id} className="min-w-[200px] transform transition-all hover:scale-105 hover:shadow-xl">
                <CardHeader>
                  <template.icon className="h-8 w-8 mb-2 text-accent" />
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription className="text-xs h-10 overflow-hidden">{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => onSelectTemplate?.(template.id)}
                    disabled={!onSelectTemplate} // Enable if onSelectTemplate is provided
                  >
                    Select
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        {exampleTemplates.length === 0 && (
           <p className="text-sm text-muted-foreground mt-4 text-center">No templates available at the moment.</p>
        )}
      </CardContent>
    </Card>
  );
}
