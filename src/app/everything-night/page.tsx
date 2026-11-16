import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { ScrollReveal } from "@/components/scroll-reveal";
import { getFeaturedEvent } from "@/lib/content";

const rsvpUrl = "https://partiful.com/e/gy3BajXzxlnGA6VuPei2?c=Pgd2dAsW";

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
    title: "Worship",
    body: "A live student-led band kicking the night off.",
    image: "/images/everything-night-band.jpg",
  },
  {
    title: "Dinner",
    body: "Free food. Long tables. Good conversation.",
    image: "/images/everything-night-dinner.jpg",
  },
  {
    title: "Dodgeball",
    body: "An actual tournament. School pride on the line.",
    image: "/images/everything-night-dodgeball.jpg",
  },
  {
    title: "Breakouts",
    body: "Talks, arts and crafts, and more. Pick your room.",
    image: "/images/chosen-dab.jpg",
  },
];

const photos = [
  { src: "/images/everything-night-band.jpg", alt: "Band on stage" },
  { src: "/images/everything-night-crowd.jpg", alt: "Crowd cheering" },
  {
    src: "/images/everything-night-dinner.jpg",
    alt: "Dinner in the courtyard",
  },
  { src: "/images/everything-night-dodgeball.jpg", alt: "Dodgeball" },
  { src: "/images/everything-night-picnic.jpg", alt: "Picnic on the lawn" },
  {
    src: "/images/everything-night-poster.jpg",
    alt: "Everything Night poster",
  },
  { src: "/images/everything-night-main.jpg", alt: "Group photo" },
  { src: "/images/chosen-dab.jpg", alt: "Through Him we are chosen" },
];

export default async function EverythingNightPage() {
  const featuredEvent = await getFeaturedEvent();
  const facts = [
    { label: "Date", value: featuredEvent.date },
    { label: "Doors", value: featuredEvent.time },
    { label: "Location", value: featuredEvent.location },
    { label: "Cost", value: "Free" },
  ];

  return (
    <>
      <PageHeader
        eyebrow="The flagship night"
        title="Everything Night."
        description="Everything for everyone. One night, every campus. Worship, food, games, and a real conversation about Jesus. Bring whoever you want."
        photo={{
          src: "/images/everything-night-crowd.jpg",
          alt: "A packed room of students singing at Everything Night",
          caption: "Everything Night, San Marino High School, May 23, 2025",
        }}
      />

      {/* The facts, then the one button that matters. */}
      <section className="bg-white pb-24 md:pb-36">
        <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
          <ScrollReveal>
            <dl className="grid gap-8 border-t border-[#1d1d1f]/10 pt-10 sm:grid-cols-2 lg:grid-cols-4">
              {facts.map((f) => (
                <div key={f.label}>
                  <dt className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#6e6e73] sm:text-xs">
                    {f.label}
                  </dt>
                  <dd className="mt-3 font-display text-2xl font-semibold tracking-[-0.03em] text-[#1d1d1f] md:text-3xl">
                    {f.value}
                  </dd>
                </div>
              ))}
            </dl>
          </ScrollReveal>
          <ScrollReveal
            delay={80}
            className="mt-12 flex flex-wrap items-center gap-6"
          >
            <a
              href={rsvpUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#1d1d1f] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-black"
            >
              RSVP on Partiful
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <Link
              href="/contact?type=rsvp-help"
              className="group inline-flex items-center gap-1.5 text-base font-medium text-[#1d1d1f]"
            >
              Ask a question
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      <Section
        id="what-happens"
        tone="cream"
        eyebrow="What happens"
        title="A whole night, planned for you."
        description="Show up at 3:30. Stay as long as you want. Here is the lineup."
      >
        <ol className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {lineup.map((item, i) => (
            <ScrollReveal key={item.title} delay={i * 70}>
              <li>
                <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] bg-white">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
                <p className="mt-5 font-display text-sm font-medium tabular-nums text-[#6e6e73]">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-1 font-display text-2xl font-semibold tracking-[-0.03em] text-[#1d1d1f]">
                  {item.title}
                </h3>
                <p className="mt-2 text-base leading-relaxed text-[#6e6e73]">
                  {item.body}
                </p>
              </li>
            </ScrollReveal>
          ))}
        </ol>
      </Section>

      <Section
        eyebrow="Last time"
        title="Hundreds of students. Twenty schools. One night."
      >
        <ScrollReveal>
          <figure>
            <div className="relative aspect-[3/2] overflow-hidden rounded-[20px] bg-[#f5f5f7] md:aspect-[21/9] md:rounded-[28px]">
              <Image
                src="/images/everything-night-main.jpg"
                alt="The full Everything Night group on stage"
                fill
                sizes="(max-width: 1180px) 100vw, 1180px"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-4 flex flex-wrap justify-between gap-x-6 gap-y-1 text-xs text-[#6e6e73] sm:text-sm">
              <span>Everything Night, Pasadena High School</span>
              <span>May 24, 2026</span>
            </figcaption>
          </figure>
        </ScrollReveal>
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {photos.map((img, i) => (
            <ScrollReveal key={img.src} delay={i * 40}>
              <div className="relative aspect-square overflow-hidden rounded-[16px] bg-[#f5f5f7] md:rounded-[20px]">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Section>

      <Section tone="navy" eyebrow="Come once" title="Then bring a friend.">
        <div className="flex flex-wrap items-center gap-6 border-t border-white/15 pt-10">
          <a
            href={rsvpUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-[#1d1d1f] transition-colors hover:bg-[#f5f5f7]"
          >
            RSVP on Partiful
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
          <Link
            href="/contact?type=rsvp-help"
            className="group inline-flex items-center gap-1.5 text-base font-medium text-white"
          >
            Ask a question
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>
      </Section>
    </>
  );
}
