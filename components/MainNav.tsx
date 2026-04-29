import Link from "next/link";
import { Button } from "@/components/ui/button";

const navLinks = [
  ["Study", "/study"],
  ["Teach", "/teach"],
  ["Research", "/research"],
  ["Archive", "/archive"],
  ["API", "/api-docs"],
] as const;

export default function MainNav() {
  return (
    <header className="shrink-0 border-b border-border bg-background">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
        <Link href="/" className="font-serif text-2xl text-foreground">
          ChronoLens
        </Link>
        <div className="flex items-center gap-1">
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
