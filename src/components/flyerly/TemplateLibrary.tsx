"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Cake, Briefcase, Music, Users, Palette } from "lucide-react";
import type { Template } from "@/types/flyer";

const exampleTemplates: Template[] = [
  { id: "t1", name: "Birthday Bash", description: "Fun and festive for birthday celebrations.", icon: Cake, category: "Party" },
  { id: "t2", name: "Corporate Meetup", description: "Professional design for business events.", icon: Briefcase, category: "Business" },
  { id: "t3", name: "Concert Night", description: "Dynamic layout for music events.", icon: Music, category: "Entertainment" },
  { id: "t4", name: "Community Gathering", description: "Friendly and inviting for local events.", icon: Users, category: "Community" },
];

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
        <CardDescription>Choose a pre-designed template to get started quickly. (Feature coming soon!)</CardDescription>
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
                    disabled // Feature coming soon
                  >
                    Select
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <p className="text-sm text-muted-foreground mt-4 text-center">Full template functionality is under development.</p>
      </CardContent>
    </Card>
  );
}
