import Image from "next/image";
import {
  ArrowRight,
  Calendar,
  Heart,
  MapPin,
  Sparkles,
  Users2,
} from "lucide-react";
import { CTAButton } from "@/components/buttons";
import { Section } from "@/components/section";
import { ScrollReveal } from "@/components/scroll-reveal";
import { ParallaxImage } from "@/components/parallax-image";
import { ClubCard } from "@/components/club-card";
import { HeroBackdrop } from "@/components/hero/hero-backdrop";
import { HeroIntro } from "@/components/hero/hero-intro";
import { clubs } from "@/lib/data/clubs";
import { featuredEvent } from "@/lib/data/events";

export default function HomePage() {
  const previewClubs = clubs.slice(0, 6);

  return (
    <>
      <section className="relative min-h-[100svh] overflow-hidden bg-[var(--color-navy)]">
        <HeroIntro />
        <HeroBackdrop />

        {/* z-40 keeps the copy above every backdrop layer (canvas z-10,
            gradient z-20, dot grid z-30). Without it this is z-auto and the
            opaque lens canvas paints straight over the headline and CTAs. */}
        <div className="relative z-40 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 md:pt-40 md:pb-28 min-h-[100svh] flex flex-col justify-center">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.25em] uppercase text-[var(--color-baby)]">
              <span className="w-6 h-px bg-[var(--color-baby)]" />
              San Gabriel Valley
            </p>
            <h1 className="mt-5 text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white text-balance leading-[1.05]">
              Christian clubs. <span className="shimmer-text">One valley.</span>{" "}
              <span className="text-[var(--color-baby)]">One mission.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base md:text-lg text-white leading-relaxed [text-shadow:0_2px_8px_rgba(0,0,0,0.6)]">
              A regional network of high school Christian clubs across the SGV.
              Welcoming. Open to anyone curious about Jesus.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <CTAButton href="/everything-night" variant="secondary" size="lg">
                Come to Everything Night
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </CTAButton>
              <CTAButton
                href="/clubs"
                variant="ghost"
                size="lg"
                className="text-white hover:bg-white/10"
              >
                Find your campus
              </CTAButton>
            </div>

            <dl className="mt-14 grid grid-cols-3 gap-6 max-w-lg">
              {[
                { n: "20", l: "Schools" },
                { n: "1", l: "Valley" },
                { n: "All", l: "Welcome" },
              ].map((s) => (
                <div key={s.l}>
                  <dt className="text-3xl md:text-4xl font-bold text-white">
                    {s.n}
                  </dt>
                  <dd className="text-xs uppercase tracking-widest text-[var(--color-baby)] mt-1">
                    {s.l}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </section>

      <Section
        eyebrow="Why we exist"
        title="One mission, every campus."
        description="The collective links 20 schools so no student has to walk in faith alone. Worship together, eat together, ask hard questions, and bring a friend."
        tone="white"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Users2,
              title: "Connection",
              body: "We link clubs across the valley so students from every school can build real friendships.",
            },
            {
              icon: Heart,
              title: "Welcoming",
              body: "Open doors for anyone curious about Jesus, whether you grew up in church or have never set foot in one.",
            },
            {
              icon: Sparkles,
              title: "Real faith",
              body: "Rooted in scripture, lived out on campus, expressed in worship and friendship.",
            },
          ].map((f, i) => (
            <ScrollReveal key={f.title} delay={i * 90}>
              <article className="group h-full rounded-2xl border border-[var(--color-sky-100)] bg-white p-7 hover:border-[var(--color-baby)] hover:shadow-lg hover:shadow-[var(--color-navy)]/5 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-[var(--color-sky-50)] grid place-items-center text-[var(--color-navy)] group-hover:bg-[var(--color-baby)] transition">
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

      <section className="relative py-20 md:py-28 bg-[var(--color-cream)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <ScrollReveal>
              <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-[var(--color-sky-600)]">
                <span className="w-6 h-px bg-[var(--color-sky-300)]" />
                Featured event
              </p>
              <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight text-[var(--color-navy)]">
                Everything Night
              </h2>
              <p className="mt-2 text-2xl md:text-3xl font-semibold text-[var(--color-baby)]">
                Everything for everyone.
              </p>
              <p className="mt-5 text-base md:text-lg text-[var(--color-sky-700)] leading-relaxed max-w-lg">
                Worship, dinner, dodgeball, and a real conversation about Jesus.
                Hundreds of students from across the valley, one night.
              </p>
              <ul className="mt-7 space-y-3 text-sm text-[var(--color-navy)]">
                <li className="flex items-center gap-3">
                  <Calendar
                    className="w-4 h-4 text-[var(--color-baby)]"
                    aria-hidden="true"
                  />
                  <span>
                    {featuredEvent.date} starting at {featuredEvent.time}
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <MapPin
                    className="w-4 h-4 text-[var(--color-baby)]"
                    aria-hidden="true"
                  />
                  <span>{featuredEvent.location}</span>
                </li>
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <CTAButton href="/everything-night" variant="primary" size="lg">
                  See the night
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </CTAButton>
                <CTAButton href="/contact" variant="outline" size="lg">
                  Bring a friend
                </CTAButton>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={120}>
              <div className="relative grid grid-cols-6 grid-rows-6 gap-3 h-[520px]">
                <div className="col-span-4 row-span-4 relative rounded-2xl overflow-hidden">
                  <Image
                    src="/images/everything-night-crowd.jpg"
                    alt="Crowd at Everything Night"
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-cover"
                  />
                </div>
                <div className="col-span-2 row-span-3 relative rounded-2xl overflow-hidden">
                  <Image
                    src="/images/everything-night-band.jpg"
                    alt="Worship band on stage"
                    fill
                    sizes="(max-width: 768px) 50vw, 20vw"
                    className="object-cover"
                  />
                </div>
                <div className="col-span-2 row-span-3 relative rounded-2xl overflow-hidden">
                  <Image
                    src="/images/everything-night-dodgeball.jpg"
                    alt="Dodgeball at Everything Night"
                    fill
                    sizes="(max-width: 768px) 50vw, 20vw"
                    className="object-cover"
                  />
                </div>
                <div className="col-span-3 row-span-2 relative rounded-2xl overflow-hidden">
                  <Image
                    src="/images/everything-night-dinner.jpg"
                    alt="Dinner outside"
                    fill
                    sizes="(max-width: 768px) 50vw, 20vw"
                    className="object-cover"
                  />
                </div>
                <div className="col-span-3 row-span-2 relative rounded-2xl overflow-hidden">
                  <Image
                    src="/images/everything-night-picnic.jpg"
                    alt="Friends on the lawn"
                    fill
                    sizes="(max-width: 768px) 50vw, 20vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <Section
        eyebrow="The clubs"
        title="20 schools. One collective."
        description="From Pasadena to Glendora, La Crescenta to Temple City. Find your campus, or join the regional gatherings."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {previewClubs.map((c, i) => (
            <ScrollReveal key={c.slug} delay={i * 60}>
              <ClubCard club={c} />
            </ScrollReveal>
          ))}
        </div>
        <div className="mt-10">
          <CTAButton href="/clubs" variant="outline">
            See all 20 clubs
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </CTAButton>
        </div>
      </Section>

      <section className="relative h-[60vh] min-h-[420px] overflow-hidden">
        <ParallaxImage
          src="/images/chosen-dab.jpg"
          alt="Through Him, we are chosen"
          className="absolute inset-0"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[var(--color-navy)]/60" />
        <div className="relative h-full flex items-center justify-center text-center px-6">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.3em] uppercase text-[var(--color-baby)]">
              Through Him
            </p>
            <p className="mt-4 text-4xl md:text-6xl font-bold text-white tracking-tight">
              we are <span className="text-[var(--color-baby)]">chosen.</span>
            </p>
          </div>
        </div>
      </section>

      <Section tone="cream" align="center">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[var(--color-navy)] text-balance">
            Curious? Come once. No pressure.
          </h2>
          <p className="mt-4 text-base md:text-lg text-[var(--color-sky-700)] leading-relaxed">
            Find a club at your school, or just show up to Everything Night and
            see for yourself.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <CTAButton href="/clubs" variant="primary" size="lg">
              Find a club
            </CTAButton>
            <CTAButton href="/contact" variant="outline" size="lg">
              Get in touch
            </CTAButton>
          </div>
        </div>
      </Section>
    </>
  );
}
