import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { EventCard } from "@/components/event-card";
import { ScrollReveal } from "@/components/scroll-reveal";
import { CTAButton } from "@/components/buttons";
import { events } from "@/lib/data/events";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Events",
  description:
    "Everything Night, worship gatherings, and summer hangs across the SGV.",
};

const UPCOMING_SLUGS = new Set([
  "everything-night-may-2026",
  "worship-nights-summer",
]);

export default function EventsPage() {
  const upcoming = events.filter((e) => UPCOMING_SLUGS.has(e.slug));
  const past = events.filter((e) => !UPCOMING_SLUGS.has(e.slug));

  return (
    <>
      <PageHeader
        eyebrow="Gatherings"
        title="Show up. Bring a friend."
        description="Everything Night once a year, worship nights through the year, and summer hangs. There is always something next."
        photo={{
          src: "/images/salt-and-light-worship-night.jpg",
          alt: "A student leading worship with one hand raised at the Salt and Light worship night",
          caption:
            "Salt & Light Worship Night, Epicenter Church, December 19, 2025",
        }}
      />

      <Section eyebrow="Upcoming" title="Mark your calendar.">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcoming.map((e, i) => (
            <ScrollReveal key={e.slug} delay={i * 80}>
              <EventCard event={e} />
            </ScrollReveal>
          ))}
        </div>
      </Section>

      <Section tone="cream" eyebrow="Past events" title="Where we have been.">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {past.map((e, i) => (
            <ScrollReveal key={e.slug} delay={i * 80}>
              <EventCard event={e} />
            </ScrollReveal>
          ))}
        </div>
        <div className="mt-12">
          <CTAButton href="/everything-night" variant="primary">
            See Everything Night
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </CTAButton>
        </div>
      </Section>
    </>
  );
}
