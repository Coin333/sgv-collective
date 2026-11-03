import Image from "next/image";
import {
  ArrowRight,
  BookOpen,
  HandHeart,
  Sparkles,
  Users2,
} from "lucide-react";
import { CTAButton } from "@/components/buttons";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { ScrollReveal } from "@/components/scroll-reveal";

export const metadata = {
  title: "About",
  description:
    "Who the SGV Christian Club Collective is, what we believe, and how we work.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="A network, not a church."
        description="We are 20 high school Christian clubs across the San Gabriel Valley. Different campuses, one collective. Students lead; adults help."
        photo={{
          src: "/images/everything-night-crowd.jpg",
          alt: "Students singing and laughing in a packed auditorium at Everything Night",
          caption: "Everything Night, San Marino High School, May 23, 2025",
        }}
      />

      <Section
        eyebrow="The mission"
        title="What we are about."
        description="Plain language. No jargon. Anyone is welcome at the table."
      >
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              icon: HandHeart,
              title: "Inclusivity",
              body: "Anyone is welcome. You do not need to believe what we believe to come hang out.",
            },
            {
              icon: Sparkles,
              title: "Connection to Christ",
              body: "We believe Jesus is real and we are here to help students meet Him.",
            },
            {
              icon: BookOpen,
              title: "Rooted in scripture",
              body: "Bible study, real questions, and honest answers. No pressure to pretend.",
            },
            {
              icon: Users2,
              title: "Open to non-believers",
              body: "Most of our friends are still figuring it out. That is exactly the point.",
            },
          ].map((f, i) => (
            <ScrollReveal key={f.title} delay={i * 80}>
              <article className="h-full rounded-2xl border border-[var(--color-sky-100)] bg-white p-7 hover:border-[var(--color-baby)] transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-[var(--color-sky-50)] grid place-items-center text-[var(--color-navy)]">
                  <f.icon className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-[var(--color-navy)]">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm text-[var(--color-sky-700)] leading-relaxed">
                  {f.body}
                </p>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </Section>

      <Section
        tone="cream"
        eyebrow="How we work"
        title="Clubs lead. We connect."
      >
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              n: "01",
              title: "Each campus runs itself",
              body: "Every club has its own student leaders, vibe, and rhythm.",
            },
            {
              n: "02",
              title: "We link them up",
              body: "We share dates, themes, speakers, and resources across schools.",
            },
            {
              n: "03",
              title: "We gather everyone",
              body: "Once a year, every campus shows up to Everything Night. We also host worship nights together throughout the year.",
            },
          ].map((s, i) => (
            <ScrollReveal key={s.n} delay={i * 80}>
              <article className="rounded-2xl bg-white border border-[var(--color-sky-100)] p-7 h-full">
                <span className="text-sm font-bold tracking-[0.2em] text-[var(--color-baby)]">
                  {s.n}
                </span>
                <h3 className="mt-3 text-lg font-semibold text-[var(--color-navy)]">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm text-[var(--color-sky-700)] leading-relaxed">
                  {s.body}
                </p>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </Section>

      <Section
        tone="white"
        eyebrow="History"
        title="From a few clubs to a collective."
      >
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <ScrollReveal>
            <p className="text-base md:text-lg text-[var(--color-sky-700)] leading-relaxed">
              The collective started with a handful of leaders who wanted clubs
              across the valley to actually know each other. It grew into twenty
              schools, regional worship nights, and Everything Night.
            </p>
            <p className="mt-4 text-base md:text-lg text-[var(--color-sky-700)] leading-relaxed">
              The mission has not changed. Welcome anyone. Point them to Jesus.
              Keep it real.
            </p>
            <div className="mt-8">
              <CTAButton href="/leadership" variant="outline">
                Meet the team
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </CTAButton>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={120}>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <Image
                src="/images/everything-night-poster.jpg"
                alt="Everything for Everyone poster"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-navy)]/30 via-transparent" />
            </div>
          </ScrollReveal>
        </div>
      </Section>
    </>
  );
}
