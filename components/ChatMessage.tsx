import { Bot, ExternalLink, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export type ChatMessageModel =
  | { id: string; type: "user"; text: string }
  | { id: string; type: "assistant"; text: string }
  | { id: string; type: "source"; title: string; detail: string };

export default function ChatMessage({ message }: { message: ChatMessageModel }) {
  if (message.type === "source") {
    return (
      <Card className="border-accent/20 bg-accent/5">
        <CardContent className="p-3 space-y-1.5">
          <div className="flex items-center gap-2 text-sm font-semibold text-accent">
            <ExternalLink className="h-4 w-4" />
            {message.title}
          </div>
          <p className="text-sm leading-5 text-muted-foreground">{message.detail}</p>
        </CardContent>
      </Card>
    );
  }

  const isUser = message.type === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser ? (
        <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
          <Bot className="h-4 w-4" />
        </span>
      ) : null}
      <div
        className={`max-w-[86%] rounded-2xl px-4 py-3 text-sm leading-6 ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-muted-foreground"
        }`}
      >
        {message.text}
      </div>
      {isUser ? (
        <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground">
          <User className="h-4 w-4" />
        </span>
      ) : null}
    </div>
  );
}
