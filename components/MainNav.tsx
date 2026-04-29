import Link from "next/link";
import { Button } from "@/components/ui/button";

const navLinks = [
  ["Research", "/research"],
  ["Archive", "/archive"],
  ["API", "/api-docs"],
  ["Study", "/study"],
  ["Teach", "/teach"],
] as const;

export default function MainNav() {
  return (
    <header className="sticky top-0 z-40 shrink-0 border-b border-border bg-background/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-3">
        <Link href="/" className="font-serif text-2xl leading-none text-foreground">
          ChronoLens
        </Link>
        <div className="flex max-w-full items-center gap-1 overflow-x-auto">
          {navLinks.map(([label, href]) => (
            <Button key={href} variant="ghost" size="sm" asChild>
              <Link href={href}>{label}</Link>
            </Button>
          ))}
        </div>
      </nav>
    </header>
  );
}
