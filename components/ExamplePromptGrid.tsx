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
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,250px),1fr))] auto-rows-[minmax(104px,auto)] gap-3">
      {prompts.map(({ emoji, text }) => (
        <button
          key={text}
          type="button"
          onClick={() => onSelect(text)}
          className="group relative flex items-start gap-3 rounded-lg border border-border bg-[#f7f1e7] p-5 text-left text-sm leading-6 text-muted-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/60 hover:bg-white hover:text-foreground"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-xl shadow-sm">{emoji}</span>
          <span>{text}</span>
        </button>
      ))}
    </div>
  );
}
