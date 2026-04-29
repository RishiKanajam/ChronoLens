import Link from "next/link";
import { Archive, Braces, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Archive className="h-5 w-5" />
            </span>
            <span>
              <span className="block font-serif text-xl leading-none text-foreground">ChronoLens</span>
              <span className="text-xs text-muted-foreground">Cultural Learning + Research OS</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Button asChild>
              <Link href="/app">
                <Search className="h-4 w-4" />
                Start Research
              </Link>
            </Button>
            <Button variant="outline" asChild className="hidden sm:inline-flex">
              <Link href="/api-docs">
                <Braces className="h-4 w-4" />
                API
              </Link>
            </Button>
          </div>
        </nav>
      </header>
      {children}
    </div>
  );
}
