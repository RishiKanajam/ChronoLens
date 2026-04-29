"use client";

const prompts = [
  { emoji: "🌸", text: "Teach me about lotus motifs across art, textiles, manuscripts, and music." },
  { emoji: "🏺", text: "Build a Year 9 lesson on Indus Valley seals." },
  { emoji: "🎨", text: "Find archive sources on Japanese woodblock printing." },
  { emoji: "🎵", text: "Compare folk song traditions with dance and ritual performance." },
  { emoji: "📜", text: "Research a manuscript page and show what is fact vs hypothesis." },
  { emoji: "🧵", text: "Analyze this textile pattern and connect it to related traditions." },
];

export default function ExamplePromptGrid({ onSelect }: { onSelect: (prompt: string) => void }) {
  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      {prompts.map(({ emoji, text }) => (
        <button
          key={text}
          type="button"
          onClick={() => onSelect(text)}
          className="group relative flex items-start gap-3 rounded-xl border border-border bg-card p-5 text-left text-sm leading-6 text-muted-foreground transition-all hover:border-primary/70 hover:bg-card/80 hover:text-foreground before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:rounded-l-xl before:bg-primary before:opacity-0 before:transition-opacity hover:before:opacity-100"
        >
          <span className="shrink-0 text-xl">{emoji}</span>
          <span>{text}</span>
        </button>
      ))}
    </div>
  );
}
