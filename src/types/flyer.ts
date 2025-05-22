export interface EventDetails {
  name: string;
  description: string;
  date: Date | undefined;
  location: string;
}

export interface Template {
  id: string;
  name: string;
  description: string; // Description of the template itself
  icon: React.ElementType; // Lucide icon component
  category: string;
  defaultEventName?: string;
  defaultEventDescription?: string;
  defaultTagline?: string;
  defaultImageHint?: string; // Hint for AI image or placeholder. Max two words.
}
