"use client";

import { FormEvent, useEffect, useState } from "react";
import { Paperclip, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const placeholders = [
  "What role did spice trade play in cultural exchange?",
  "How did Buddhist art evolve from India to Japan?",
  "Compare Aboriginal dot painting with African sand art",
];

export default function QueryInput({
  onSubmit,
  disabled,
}: {
  onSubmit: (query: string) => void;
  disabled?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [fileName, setFileName] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!query.trim() || disabled) return;
    onSubmit(query.trim());
    setQuery("");
  }

  return (
    <form onSubmit={submit} className="rounded-xl border border-border bg-secondary p-3 space-y-2">
      <Textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        rows={3}
        placeholder={placeholders[placeholderIndex]}
        className="border-0 bg-transparent focus-visible:ring-0 text-sm"
      />
      <div className="flex items-center justify-between gap-3">
        <Button variant="ghost" size="sm" type="button" asChild>
          <label className="cursor-pointer">
            <Paperclip className="h-3.5 w-3.5" />
            Upload optional
            <input type="file" className="hidden" onChange={(e) => setFileName(e.target.files?.[0]?.name || "")} />
          </label>
        </Button>
        {fileName ? <span className="truncate text-xs text-primary">{fileName}</span> : null}
        <Button
          type="submit"
          size="icon"
          disabled={disabled || !query.trim()}
          className="ml-auto shrink-0"
          aria-label="Submit query"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
