
import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import "./globals.css";
import LayoutClient from "@/components/LayoutClient";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Pen in Coffee | Words brewed, stories shared.",
    template: "%s | Pen in Coffee"
  },
  description: "Create a warm online space where readers can enjoy stories, poetry, reflections, book notes, weekly letters, and meaningful conversations.",
  keywords: ["literature", "stories", "poetry", "book notes", "letters", "coffeehouse", "writing"],
  openGraph: {
    title: "Pen in Coffee | Words brewed, stories shared.",
    description: "Create a warm online space where readers can enjoy stories, poetry, reflections, book notes, weekly letters, and meaningful conversations.",
    url: "https://penincoffee.com",
    siteName: "Pen in Coffee",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pen in Coffee | Words brewed, stories shared.",
    description: "Create a warm online space where readers can enjoy stories, poetry, reflections, book notes, weekly letters, and meaningful conversations.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${cormorant.variable} ${outfit.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-cream-light text-coffee-dark font-sans selection:bg-cocoa-light selection:text-coffee-dark">
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}
