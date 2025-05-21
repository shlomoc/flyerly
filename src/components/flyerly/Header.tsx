import { FileEdit } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <FileEdit className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl sm:inline-block">
            Flyerly
          </span>
        </Link>
        <nav className="flex flex-1 items-center space-x-4">
          {/* Add nav items here if needed */}
        </nav>
      </div>
    </header>
  );
}
