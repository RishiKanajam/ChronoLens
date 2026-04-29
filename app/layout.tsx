import type { Metadata } from "next";
import "./globals.css";
import MainNav from "@/components/MainNav";

export const metadata: Metadata = {
  title: "ChronoLens | Cultural Evidence OS",
  description:
    "Study culture across artifacts, art, music, performance, history, and patterns.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <MainNav />
        {children}
      </body>
    </html>
  );
}
