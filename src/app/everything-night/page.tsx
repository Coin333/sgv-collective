import Image from "next/image";
import {
  ArrowRight,
  Calendar,
  Heart,
  MapPin,
  Music2,
  UtensilsCrossed,
  CircleDot,
  Sparkles,
  Clock,
} from "lucide-react";
import { CTAButton } from "@/components/buttons";
import { Section } from "@/components/section";
import { ScrollReveal } from "@/components/scroll-reveal";
import { ParallaxImage } from "@/components/parallax-image";
import { featuredEvent } from "@/lib/data/events";

export const metadata = {
  title: "Everything Night",
  description:
    "Everything for everyone. Worship, dinner, dodgeball, and a real conversation about Jesus. Open to anyone.",
  openGraph: {
    title: "Everything Night :: SGV Christian Club Collective",
    description: "Everything for everyone.",
    images: ["/images/everything-night-main.jpg"],
  },
};

const lineup = [
  {
    icon: Music2,
    title: "Worship",
    body: "A live student-led band kicking the night off.",
    image: "/images/everything-night-band.jpg",
  },
  {
    icon: UtensilsCrossed,
    title: "Dinner",
    body: "Free food. Long tables. Good conversation.",
    image: "/images/everything-night-dinner.jpg",
  },
  {
    icon: CircleDot,
    title: "Dodgeball",
    body: "An actual tournament. School pride on the line.",
    image: "/images/everything-night-dodgeball.jpg",
  },
  {
    icon: Sparkles,
    title: "Breakouts",
    body: "Talks, dodgeball, arts and crafts, and more. Pick your vibe. It's awesome.",
    image: "/images/chosen-dab.jpg",
  },
];

export default function EverythingNightPage() {
  return (
    <>
      <section className="relative min-h-[100svh] overflow-hidden bg-[var(--color-navy)]">
        <div className="absolute inset-0">
          <Image
            src="/images/everything-night-crowd.jpg"
            alt="Everything Night crowd"
            fill
            priority
            sizes="100vw"
            className="object-cover animate-slow-drift"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-navy)]/60 via-[var(--color-navy)]/65 to-[var(--color-navy)]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 md:pt-40 md:pb-28 min-h-[100svh] flex flex-col justify-center">
          <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.3em] uppercase text-[var(--color-baby)]">
            <span className="w-6 h-px bg-[var(--color-baby)]" />
            The Flagship Night
          </p>
          <h1 className="mt-5 text-6xl sm:text-7xl md:text-9xl font-bold tracking-tight text-white text-balance [line-height:0.95]">
            Everything <span className="shimmer-text">Night.</span>
          </h1>
          <p className="mt-6 text-2xl md:text-4xl font-semibold text-[var(--color-baby)]">
            Everything for everyone.
          </p>
          <p className="mt-6 max-w-xl text-base md:text-lg text-[var(--color-sky-200)] leading-relaxed">
            One night, every campus. Worship, food, games, and a real
            conversation about Jesus. Bring whoever you want.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <CTAButton
              href="https://partiful.com/e/gy3BajXzxlnGA6VuPei2?c=Pgd2dAsW"
              external
              variant="secondary"
              size="lg"
            >
              RSVP on Partiful
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </CTAButton>
            <CTAButton
              href="#what-happens"
              variant="ghost"
              size="lg"
              className="text-white hover:bg-white/10"
            >
              See what happens
            </CTAButton>
          </div>

          <dl className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl">
            <Stat icon={Calendar} value={featuredEvent.date} label="Date" />
            <Stat icon={Clock} value={featuredEvent.time} label="Doors" />
            <Stat
              icon={MapPin}
              value={featuredEvent.location}
              label="Location"
            />
            <Stat icon={Heart} value="Free" label="Cost" />
          </dl>
        </div>
      </section>

      <Section
        id="what-happens"
        eyebrow="What happens"
        title="A whole night, planned for you."
        description="Show up at 3:30. Stay as long as you want. Here is the lineup."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {lineup.map((item, i) => (
            <ScrollReveal key={item.title} delay={i * 80}>
              <article className="group relative h-full rounded-2xl overflow-hidden border border-[var(--color-sky-100)] bg-white hover:border-[var(--color-baby)] transition-all duration-300">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-sky-50)] grid place-items-center text-[var(--color-navy)] group-hover:bg-[var(--color-baby)] transition">
                    <item.icon className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-[var(--color-navy)]">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm text-[var(--color-sky-700)] leading-relaxed">
                    {item.body}
                  </p>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </Section>

      <section className="relative h-[70vh] min-h-[480px] overflow-hidden">
        <ParallaxImage
          src="/images/everything-night-main.jpg"
          alt="The full Everything Night group"
          className="absolute inset-0"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-navy)]/40 via-[var(--color-navy)]/30 to-[var(--color-navy)]/80" />
        <div className="relative h-full flex items-end pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <p className="text-xs font-semibold tracking-[0.3em] uppercase text-[var(--color-baby)]">
              Last gathering
            </p>
            <h2 className="mt-3 text-4xl md:text-6xl font-bold text-white tracking-tight max-w-3xl text-balance">
              Hundreds of students. Twenty schools. One night.
            </h2>
          </div>
        </div>
      </section>

      <Section eyebrow="Photo book" title="Last time looked like this.">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { src: "/images/everything-night-band.jpg", alt: "Band on stage" },
            {
              src: "/images/everything-night-crowd.jpg",
              alt: "Crowd cheering",
            },
            {
              src: "/images/everything-night-dinner.jpg",
              alt: "Dinner in the courtyard",
            },
            { src: "/images/everything-night-dodgeball.jpg", alt: "Dodgeball" },
            {
              src: "/images/everything-night-picnic.jpg",
              alt: "Picnic on the lawn",
            },
            {
              src: "/images/everything-night-poster.jpg",
              alt: "Everything Night poster",
            },
            { src: "/images/everything-night-main.jpg", alt: "Group photo" },
            { src: "/images/chosen-dab.jpg", alt: "Through Him we are chosen" },
          ].map((img, i) => (
            <ScrollReveal key={img.src} delay={i * 50}>
              <div className="group relative aspect-square overflow-hidden rounded-xl">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Section>

      <Section tone="cream" align="center">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[var(--color-navy)] text-balance">
            Come and experience it.
          </h2>
          <p className="mt-4 text-base md:text-lg text-[var(--color-sky-700)] leading-relaxed">
            RSVP on Partiful so we know you are coming. Then bring a friend who
            has never been to anything like this.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <CTAButton
              href="https://partiful.com/e/gy3BajXzxlnGA6VuPei2?c=Pgd2dAsW"
              external
              variant="primary"
              size="lg"
            >
              RSVP on Partiful
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </CTAButton>
            <CTAButton href="/contact" variant="outline" size="lg">
              Ask a question
            </CTAButton>
          </div>
        </div>
      </Section>
    </>
  );
}

function Stat({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof Calendar;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4">
      <div className="w-9 h-9 rounded-lg bg-[var(--color-baby)]/15 grid place-items-center text-[var(--color-baby)]">
        <Icon className="w-4 h-4" aria-hidden="true" />
      </div>
      <p className="mt-3 text-base md:text-lg font-semibold text-white leading-tight">
        {value}
      </p>
      <p className="text-[11px] uppercase tracking-widest text-[var(--color-baby)] mt-1">
        {label}
      </p>
    </div>
  );
}
