"use client";

import { Volume2, Square } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function ReadAloudButton({ text }: { text: string }) {
  const [reading, setReading] = useState(false);

  function read() {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => setReading(false);
    setReading(true);
    window.speechSynthesis.speak(utterance);
  }

  function stop() {
    window.speechSynthesis.cancel();
    setReading(false);
  }

  return (
    <Button variant="secondary" size="sm" onClick={reading ? stop : read}>
      {reading ? <Square className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
      {reading ? "Stop" : "Read aloud"}
    </Button>
  );
}
