import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { EditorialList } from "@/components/editorial-list";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { ScrollReveal } from "@/components/scroll-reveal";

export const metadata = {
  title: "About",
  description:
    "Who the SGV Christian Club Collective is, what we believe, and how we work.",
};

const mission = [
  {
    title: "Anyone is welcome.",
    body: "You do not need to believe what we believe to come hang out. Most of our friends are still figuring it out. That is the point.",
  },
  {
    title: "Jesus is real.",
    body: "We are here to help students meet Him. No pressure, no pretending, honest answers to real questions.",
  },
  {
    title: "Rooted in scripture.",
    body: "Bible study, real conversation, and a church to point you toward when you want more.",
  },
];

const how = [
  {
    title: "Each campus runs itself.",
    body: "Every club has its own student leaders, rhythm, and name. We never run a club. Federal law protects that, and so do we.",
  },
  {
    title: "We connect them.",
    body: "Dates, speakers, worship teams, printable resources, and introductions across twenty schools.",
  },
  {
    title: "We gather everyone.",
    body: "Once a year, every campus shows up to Everything Night. Through the year, worship nights hosted by partner churches.",
  },
];

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
        <EditorialList items={mission} />
      </Section>

      <Section
        tone="cream"
        eyebrow="How we work"
        title="Clubs lead. We connect."
      >
        <EditorialList items={how} />
      </Section>

      <Section eyebrow="History" title="From a brainstorm to twenty schools.">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <ScrollReveal>
            <p className="text-base leading-relaxed text-[#6e6e73] md:text-lg">
              The collective started on November 12, 2024 with a handful of
              student leaders who wanted the clubs across the valley to actually
              know each other. Six months later it was twenty schools, a worship
              night, and the first Everything Night.
            </p>
            <p className="mt-4 text-base leading-relaxed text-[#6e6e73] md:text-lg">
              The founders graduated. The network kept going. The mission has
              not changed: welcome anyone, point them to Jesus, keep it real.
            </p>
            <Link
              href="/legacy"
              className="group mt-8 inline-flex items-center gap-1.5 text-base font-medium text-[#1d1d1f]"
            >
              Every year so far
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </ScrollReveal>
          <ScrollReveal delay={120}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] bg-[#f5f5f7]">
              <Image
                src="/images/everything-night-poster.jpg"
                alt="Everything for Everyone poster"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </ScrollReveal>
        </div>
      </Section>
    </>
  );
}
