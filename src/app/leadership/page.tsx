import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { LeaderCard } from "@/components/leader-card";
import { ScrollReveal } from "@/components/scroll-reveal";
import { CTAButton } from "@/components/buttons";
import { roles } from "@/lib/data/leadership";
import { getLeaders } from "@/lib/content";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Leadership",
  description: "The student leaders running the SGV Christian Club Collective.",
};

export default async function LeadershipPage() {
  const leaders = await getLeaders();
  const current = leaders.filter((l) => l.era === "current");
  const past = leaders.filter((l) => l.era === "past");

  return (
    <>
      <PageHeader
        eyebrow="Leadership"
        title="Students leading students."
        description="The collective is run by high schoolers, for high schoolers. Adults help, but students lead."
        photo={{
          src: "/images/everything-night-dinner.jpg",
          alt: "Students sharing dinner at long tables at Everything Night",
        }}
      />

      <Section eyebrow="Current team" title="The team right now.">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {current.map((l, i) => (
            <ScrollReveal key={l.name} delay={i * 80}>
              <LeaderCard leader={l} />
            </ScrollReveal>
          ))}
        </div>
      </Section>

      <Section tone="cream" eyebrow="Roles" title="How the work gets divided.">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {roles.map((r, i) => (
            <ScrollReveal key={r.title} delay={i * 70}>
              <article className="rounded-2xl bg-white border border-[var(--color-sky-100)] p-6 h-full">
                <h3 className="text-base font-semibold text-[var(--color-navy)]">
                  {r.title}
                </h3>
                <p className="mt-2 text-sm text-[var(--color-sky-700)] leading-relaxed">
                  {r.description}
                </p>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </Section>

      <Section eyebrow="Past leadership" title="Built on the people before us.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {past.map((l, i) => (
            <ScrollReveal key={l.name} delay={i * 80}>
              <LeaderCard leader={l} />
            </ScrollReveal>
          ))}
        </div>
      </Section>

      <Section tone="cream" align="center">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[var(--color-navy)] text-balance">
            Want to lead at your campus?
          </h2>
          <p className="mt-4 text-base md:text-lg text-[var(--color-sky-700)] leading-relaxed">
            We are always looking for student leaders who care about their
            school and want to build something real.
          </p>
          <div className="mt-8">
            <CTAButton href="/contact" variant="primary" size="lg">
              Reach out
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </CTAButton>
          </div>
        </div>
      </Section>
    </>
  );
}
