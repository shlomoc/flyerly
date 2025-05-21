export interface EventDetails {
  name: string;
  description: string;
  date: Date | undefined;
  location: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType; // Lucide icon component
  category: string;
}
