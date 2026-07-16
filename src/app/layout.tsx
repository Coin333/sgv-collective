import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ScrollNav } from "@/components/scroll-nav";
import { SiteFooter } from "@/components/site-footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SGV Christian Club Collective",
    template: "%s | SGV Christian Club Collective",
  },
  description:
    "A regional network of high school Christian clubs across the San Gabriel Valley. One mission, every campus.",
  metadataBase: new URL("https://sgvchristianclubs.org"),
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
    // suppressHydrationWarning is required, not cosmetic: the pre-paint script
    // below stamps data-hero-intro on <html> before React hydrates, so the
    // client element legitimately differs from the SSR markup. Without this,
    // React treats it as a mismatch and bails into a full client re-render,
    // which froze the main thread for ~8s and stalled the intro.
    // It only suppresses warnings one level deep, so children still diff.
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-white text-[var(--color-navy)]">
        {/* Decides the hero intro before first paint, so the curtain is either
            painted from the very first frame or never displayed at all. React
            never renders this decision, so server and client markup stay
            identical and there is no hydration mismatch. The key is written at
            decision time, not on completion, so a reload mid-animation cannot
            replay it. A sessionStorage throw (private modes) means no intro. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{
if(location.pathname!=="/")return;
if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;
if(sessionStorage.getItem("sgv:hero-intro")==="1")return;
sessionStorage.setItem("sgv:hero-intro","1");
document.documentElement.setAttribute("data-hero-intro","play");
}catch(e){}})();`,
          }}
        />
        <ScrollNav />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
