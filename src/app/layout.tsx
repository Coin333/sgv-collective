import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import "./globals.css";
import { ScrollNav } from "@/components/scroll-nav";
import { SiteFooter } from "@/components/site-footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SGV Christian Club Collective",
    template: "%s | SGV Christian Club Collective",
  },
  description:
    "A network of Christian clubs across 20 San Gabriel Valley high schools. God's family with a purpose: serving campus clubs and building joyful community so no Christian student walks alone.",
  metadataBase: new URL("https://sgvc.cc"),
  openGraph: {
    title: "SGV Christian Club Collective",
    description:
      "A regional network of high school Christian clubs across the San Gabriel Valley.",
    images: ["/images/everything-night-main.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${interTight.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-white text-[var(--color-navy)]">
        <ScrollNav />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
