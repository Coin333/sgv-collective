import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { EditorialList } from "@/components/editorial-list";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { ScrollReveal } from "@/components/scroll-reveal";
import {
  churches,
  pastoralGuidance,
  affiliates,
  supportTypes,
} from "@/lib/data/churches";

export const metadata = {
  title: "Churches",
  description:
    "Local churches that fund, host, speak, and walk with the SGV Christian Club Collective.",
};

export default function ChurchesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Churches and partners"
        title="Standing with us."
        description="Local churches and partners who host, speak, and pray for the collective. The students lead, but we do not do this alone."
      />

      <Section eyebrow="Partner churches" title="The churches walking with us.">
        <EditorialList
          items={churches.map((c) => ({
            title: c.name,
            meta: [c.pastor ?? c.pastors?.join(", "), c.city]
              .filter(Boolean)
              .join(", "),
            body: c.blurb ?? c.support,
            link: c.url
              ? { href: c.url, label: "Visit church", external: true }
              : undefined,
          }))}
        />
      </Section>

      <Section
        tone="cream"
        eyebrow="Pastoral guidance"
        title="Shepherding the collective."
        description="Pastors who guide our student leaders and keep us rooted in the gospel."
      >
        <EditorialList
          items={pastoralGuidance.map((p) => ({
            title: p.pastor,
            meta: p.church,
            body: p.role,
          }))}
        />
      </Section>

      <Section
        eyebrow="Affiliates"
        title="Ministries alongside us."
        description="Outreach partners who are not churches but stand with the collective."
      >
        <EditorialList
          items={affiliates.map((a) => ({
            title: a.name,
            body: a.blurb ?? a.description,
            link: a.url
              ? { href: a.url, label: "Visit site", external: true }
              : undefined,
          }))}
        />
      </Section>

      <Section eyebrow="How they help" title="Four ways churches support us.">
        <ol className="grid gap-x-8 border-t border-[#1d1d1f]/10 md:grid-cols-2 lg:grid-cols-4">
          {supportTypes.map((s, i) => (
            <ScrollReveal
              key={s.title}
              delay={i * 70}
              className="border-b border-[#1d1d1f]/10 py-8 lg:border-b-0"
            >
              <li>
                <p className="font-display text-sm font-medium tabular-nums text-[#6e6e73]">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-6 font-display text-2xl font-semibold tracking-[-0.03em] text-[#1d1d1f]">
                  {s.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-[#6e6e73]">
                  {s.description}
                </p>
              </li>
            </ScrollReveal>
          ))}
        </ol>
      </Section>

      <Section
        tone="navy"
        eyebrow="Want in?"
        title="Pastors, leaders, churches."
      >
        <div className="grid gap-12 border-t border-white/15 pt-10 md:grid-cols-2 md:gap-8">
          <ScrollReveal>
            <h3 className="font-display text-2xl font-semibold tracking-[-0.03em] md:text-3xl">
              Partner with us.
            </h3>
            <p className="mt-3 max-w-md text-base leading-relaxed text-white/70 md:text-lg">
              Host a worship night, send a speaker, or sponsor food for
              Everything Night. We would love to talk.
            </p>
            <Link
              href="/contact?type=church"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-[#1d1d1f] transition-colors hover:bg-[#f5f5f7]"
            >
              Reach out
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </ScrollReveal>
          <ScrollReveal delay={90}>
            <h3 className="font-display text-2xl font-semibold tracking-[-0.03em] md:text-3xl">
              Pray for the schools.
            </h3>
            <p className="mt-3 max-w-md text-base leading-relaxed text-white/70 md:text-lg">
              Whether or not you partner officially, prayer for these campuses
              changes things. Pray for our friends who have not met Jesus yet.
            </p>
          </ScrollReveal>
        </div>
      </Section>
    </>
  );
}
