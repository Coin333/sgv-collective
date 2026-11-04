import { Suspense } from "react";
import { ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { ContactForm } from "./contact-form";

export const metadata = {
  title: "Contact",
  description:
    "Join a club, start a club, or get in touch with the SGV Christian Club Collective.",
};

const ways = [
  {
    label: "Email",
    value: "sgvchristianclubs@gmail.com",
    href: "mailto:sgvchristianclubs@gmail.com",
    note: "Read by the current leads. A few days to reply.",
  },
  {
    label: "Instagram",
    value: "@sgv_christiancc",
    href: "https://instagram.com/sgv_christiancc",
    note: "Upcoming gatherings and recap photos.",
  },
  {
    label: "Everything Night",
    value: "RSVP on Partiful",
    href: "https://partiful.com/e/gy3BajXzxlnGA6VuPei2?c=Pgd2dAsW",
    note: "So we know how much food to make.",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Say hi. Ask anything."
        description="We read every message. Whether you want to join, start, lead, or just ask a question, drop a note."
      />

      <Section tone="white">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <Suspense fallback={<div className="h-96" />}>
              <ContactForm />
            </Suspense>
          </div>

          <aside className="lg:col-span-4 lg:col-start-9">
            <ul>
              {ways.map((w) => (
                <li
                  key={w.label}
                  className="border-t border-[#1d1d1f]/10 py-6 last:border-b"
                >
                  <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#6e6e73] sm:text-xs">
                    {w.label}
                  </p>
                  <a
                    href={w.href}
                    target={w.href.startsWith("http") ? "_blank" : undefined}
                    rel={w.href.startsWith("http") ? "noreferrer" : undefined}
                    className="group mt-2 inline-flex items-center gap-1.5 text-base font-medium text-[#1d1d1f] md:text-lg"
                  >
                    {w.value}
                    <ArrowUpRight
                      className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </a>
                  <p className="mt-1 text-sm text-[#6e6e73]">{w.note}</p>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </Section>
    </>
  );
}
