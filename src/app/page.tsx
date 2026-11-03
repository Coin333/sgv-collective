import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { ClubMarquee } from "@/components/club-marquee";
import { ScrollReveal } from "@/components/scroll-reveal";
import { Yearbook } from "@/components/yearbook";
import { clubs } from "@/lib/data/clubs";
import { years, founded } from "@/lib/data/years";
import { cn } from "@/lib/utils";

const ink = "text-[#1d1d1f]";
const muted = "text-[#6e6e73]";
const h2 =
  "font-display font-semibold tracking-[-0.04em] [line-height:1.02] text-balance text-[clamp(2.25rem,5.2vw,4.25rem)]";

function Eyebrow({ children, dark }: { children: string; dark?: boolean }) {
  return (
    <p
      className={cn(
        "text-[11px] font-medium uppercase tracking-[0.16em] sm:text-xs",
        dark ? "text-white/60" : muted,
      )}
    >
      {children}
    </p>
  );
}

function TextLink({
  href,
  children,
  dark,
}: {
  href: string;
  children: string;
  dark?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-1.5 text-base font-medium",
        dark ? "text-white" : ink,
      )}
    >
      {children}
      <ArrowRight
        className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
        aria-hidden="true"
      />
    </Link>
  );
}

const convictions = [
  {
    ref: "Ephesians 2:19",
    title: "We are one family.",
    body: "Every follower of Jesus in this valley belongs to the same household. Twenty schools, one table.",
  },
  {
    ref: "Isaiah 40:3",
    title: "We prepare the way.",
    body: "Like John the Baptist, we make room for Jesus on every campus, and room for students to grow into the gifts God gave them.",
  },
  {
    ref: "Philippians 1:18",
    title: "We serve first.",
    body: "We resource clubs. We never run them. Whether our name is on it or not, if Jesus is lifted up, we are glad.",
  },
];

const offers = [
  {
    title: "Playbooks",
    body: "Starting a club, running a meeting, hosting a worship night, handing it off when you graduate.",
    href: "/playbooks",
  },
  {
    title: "Club Cutouts",
    body: "Printable pocket cards that point a new believer to a next step. Free, print as many as you need.",
    href: "/club-cutouts",
  },
  {
    title: "A church to point to",
    body: "Partner youth groups across the valley, and pastors who will take the hard questions.",
    href: "/churches",
  },
];

export default function HomePage() {
  const thisYear = years.find((y) => y.slug === "2026-27") ?? years[0];
  const yearCount = years.filter((y) => !y.open).length;

  return (
    <>
      {/* Hero: one sentence beside one photograph, then every campus in a line. */}
      <section className="bg-white pt-24 md:pt-32">
        <div className="mx-auto grid max-w-[1180px] gap-12 px-5 sm:px-8 md:grid-cols-12 md:items-end md:gap-8">
          <div className="md:col-span-7">
            <ScrollReveal>
              <Eyebrow>San Gabriel Valley Christian Club Collective</Eyebrow>
            </ScrollReveal>
            <ScrollReveal delay={60}>
              <h1
                className={cn(
                  "mt-5 max-w-[11ch] font-display font-semibold tracking-[-0.05em] [line-height:0.92] text-[clamp(3rem,8vw,7.25rem)]",
                  ink,
                )}
              >
                No Christian student walks{" "}
                <span className="text-[#1d1d1f]/35">alone.</span>
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={140} className="mt-10 md:mt-14">
              <p
                className={cn(
                  "max-w-md text-lg leading-relaxed md:text-xl",
                  muted,
                )}
              >
                A network of student-led Christian clubs across twenty high
                schools in the San Gabriel Valley. Started by students in 2024.
                Handed to new students every June.
              </p>
              <div className="mt-8 flex items-center gap-6">
                <Link
                  href="/clubs"
                  className="inline-flex items-center gap-2 rounded-full bg-[#1d1d1f] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-black"
                >
                  Find your club
                </Link>
                <TextLink href="/legacy">Our story</TextLink>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={200} className="md:col-span-5">
            <figure>
              <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] bg-[#f5f5f7] md:rounded-[28px]">
                <Image
                  src="/images/everything-night-main.jpg"
                  alt="Over a hundred students on stage at Everything Night, a wooden cross held up on the right"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 480px"
                  className="object-cover"
                />
              </div>
              <figcaption
                className={cn(
                  "mt-4 flex flex-wrap justify-between gap-x-6 gap-y-1 text-xs sm:text-sm",
                  muted,
                )}
              >
                <span>Everything Night, Pasadena High School</span>
                <span>May 24, 2026</span>
              </figcaption>
            </figure>
          </ScrollReveal>
        </div>

        <ScrollReveal delay={260} className="mt-16 md:mt-24">
          <ClubMarquee />
        </ScrollReveal>
      </section>

      {/* Ledger: three facts, no decoration. */}
      <section className="bg-white py-24 md:py-36">
        <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
          <dl className="grid gap-10 border-t border-[#1d1d1f]/10 pt-10 sm:grid-cols-3">
            {[
              { n: String(clubs.length), l: "high school clubs" },
              { n: String(yearCount), l: "years, led by students" },
              { n: "140+", l: "students at the first Everything Night" },
            ].map((s, i) => (
              <ScrollReveal key={s.l} delay={i * 80}>
                <dd
                  className={cn(
                    "font-display text-6xl font-semibold tracking-[-0.05em] md:text-7xl",
                    ink,
                  )}
                >
                  {s.n}
                </dd>
                <dt className={cn("mt-2 text-base", muted)}>{s.l}</dt>
              </ScrollReveal>
            ))}
          </dl>
        </div>
      </section>

      {/* Convictions: editorial two-column, scripture as the label. */}
      <section className="bg-[#f5f5f7] py-24 md:py-36">
        <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
          <div className="grid gap-12 md:grid-cols-12 md:gap-8">
            <ScrollReveal className="md:col-span-4">
              <Eyebrow>What we believe</Eyebrow>
              <h2 className={cn(h2, ink, "mt-4")}>
                Three things we will not change.
              </h2>
            </ScrollReveal>
            <div className="md:col-span-7 md:col-start-6">
              {convictions.map((c, i) => (
                <ScrollReveal
                  key={c.ref}
                  delay={i * 90}
                  className={cn(
                    "grid gap-3 border-t border-[#1d1d1f]/10 py-8 sm:grid-cols-[9rem_1fr] sm:gap-8 md:py-10",
                    i === convictions.length - 1 && "border-b",
                  )}
                >
                  <p className={cn("text-sm", muted)}>{c.ref}</p>
                  <div>
                    <h3
                      className={cn(
                        "font-display text-2xl font-semibold tracking-[-0.03em] md:text-3xl",
                        ink,
                      )}
                    >
                      {c.title}
                    </h3>
                    <p
                      className={cn(
                        "mt-3 text-base leading-relaxed md:text-lg",
                        muted,
                      )}
                    >
                      {c.body}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Yearbook: the generational spine. */}
      <section id="legacy" className="bg-white py-24 md:py-36">
        <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
          <ScrollReveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <Eyebrow>{`Since ${founded}`}</Eyebrow>
              <h2 className={cn(h2, ink, "mt-4 max-w-[16ch]")}>
                Every year, a new group of students picks this up.
              </h2>
            </div>
            <p
              className={cn(
                "max-w-sm text-base leading-relaxed md:text-lg",
                muted,
              )}
            >
              Leaders graduate. The network stays. This is the record of who
              carried it, and what they built.
            </p>
          </ScrollReveal>
          <div className="mt-16 md:mt-20">
            <Yearbook />
          </div>
          <ScrollReveal className="mt-12">
            <TextLink href="/legacy">The full story</TextLink>
          </ScrollReveal>
        </div>
      </section>

      {/* This year: one dark band per page. */}
      <section className="bg-[#1d1d1f] py-24 text-white md:py-36">
        <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
          <div className="grid gap-12 md:grid-cols-12 md:gap-8">
            <ScrollReveal className="md:col-span-5">
              <Eyebrow dark>{thisYear.label}</Eyebrow>
              <h2 className={cn(h2, "mt-4")}>
                This year: {thisYear.theme.toLowerCase()}.
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={100} className="md:col-span-6 md:col-start-7">
              <p className="text-lg leading-relaxed text-white/70 md:text-xl">
                {thisYear.summary} So we are hosting gatherings where Christians
                from different schools actually meet, eat, and pray together.
              </p>
              <blockquote className="mt-10 border-l border-white/20 pl-6">
                <p className="font-display text-xl font-medium tracking-[-0.02em] text-white md:text-2xl">
                  &ldquo;They broke bread in their homes and ate together with
                  glad and sincere hearts.&rdquo;
                </p>
                <footer className="mt-3 text-sm text-white/50">
                  Acts 2:46
                </footer>
              </blockquote>
              <div className="mt-10">
                <TextLink href="/events" dark>
                  See gatherings
                </TextLink>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Clubs: a typographic index, not a card grid. */}
      <section className="bg-white py-24 md:py-36">
        <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
          <ScrollReveal>
            <Eyebrow>The clubs</Eyebrow>
            <h2 className={cn(h2, ink, "mt-4")}>
              {`${clubs.length} schools, Pasadena to Glendora.`}
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={80} className="mt-14 md:mt-20">
            <ul className="grid grid-cols-1 border-t border-[#1d1d1f]/10 sm:grid-cols-2 lg:grid-cols-3">
              {clubs.map((c) => (
                <li
                  key={c.slug}
                  className="group border-b border-[#1d1d1f]/10 sm:[&:nth-child(2n)]:border-l lg:[&:nth-child(2n)]:border-l-0 lg:[&:nth-child(3n-1)]:border-l lg:[&:nth-child(3n)]:border-l"
                >
                  <Link
                    href={`/clubs#${c.slug}`}
                    className="flex items-center justify-between gap-4 px-0 py-4 sm:px-5 md:py-5"
                  >
                    <span className="min-w-0">
                      <span
                        className={cn(
                          "block truncate text-base font-medium",
                          ink,
                        )}
                      >
                        {c.shortName ?? c.school}
                      </span>
                      <span className={cn("block text-sm", muted)}>
                        {c.city}
                      </span>
                    </span>
                    <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-[#f5f5f7] ring-1 ring-[#1d1d1f]/5 opacity-70 transition-opacity group-hover:opacity-100">
                      <Image
                        src={c.logo}
                        alt=""
                        fill
                        sizes="36px"
                        className="object-contain p-1.5"
                        unoptimized={c.logo.endsWith(".gif")}
                      />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </ScrollReveal>
          <ScrollReveal className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3">
            <TextLink href="/clubs">All clubs, with Instagram</TextLink>
            <TextLink href="/contact?type=start">
              Start one at your school
            </TextLink>
          </ScrollReveal>
        </div>
      </section>

      {/* For clubs: a short list of real offers. */}
      <section
        id="for-clubs"
        className="scroll-mt-12 bg-[#f5f5f7] py-24 md:py-36"
      >
        <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
          <div className="grid gap-12 md:grid-cols-12 md:gap-8">
            <ScrollReveal className="md:col-span-4">
              <Eyebrow>For clubs</Eyebrow>
              <h2 className={cn(h2, ink, "mt-4")}>Free. No catch.</h2>
              <p
                className={cn(
                  "mt-5 max-w-xs text-base leading-relaxed md:text-lg",
                  muted,
                )}
              >
                We exist to resource clubs, not the other way around. Nothing to
                sign up for.
              </p>
            </ScrollReveal>
            <ul className="md:col-span-7 md:col-start-6">
              {offers.map((o, i) => (
                <ScrollReveal as="li" key={o.title} delay={i * 90}>
                  <Link
                    href={o.href}
                    className="group flex items-start justify-between gap-6 border-t border-[#1d1d1f]/10 py-7 md:py-8"
                  >
                    <span>
                      <span
                        className={cn(
                          "block font-display text-2xl font-semibold tracking-[-0.03em] md:text-3xl",
                          ink,
                        )}
                      >
                        {o.title}
                      </span>
                      <span
                        className={cn(
                          "mt-2 block max-w-md text-base leading-relaxed",
                          muted,
                        )}
                      >
                        {o.body}
                      </span>
                    </span>
                    <ArrowUpRight
                      className={cn(
                        "mt-2 h-5 w-5 shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5",
                        ink,
                      )}
                      aria-hidden="true"
                    />
                  </Link>
                </ScrollReveal>
              ))}
              <li className="border-t border-[#1d1d1f]/10" />
            </ul>
          </div>
        </div>
      </section>

      {/* Close: one photo, one line. */}
      <section className="bg-white py-24 md:py-36">
        <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
          <ScrollReveal>
            <div className="relative aspect-[16/9] overflow-hidden rounded-[20px] bg-[#f5f5f7] md:aspect-[21/9] md:rounded-[28px]">
              <Image
                src="/images/everything-night-picnic.jpg"
                alt="Seven students sitting in a circle on the grass at dusk, eating dinner"
                fill
                sizes="(max-width: 1180px) 100vw, 1180px"
                className="object-cover"
              />
            </div>
          </ScrollReveal>
          <ScrollReveal
            delay={100}
            className="mt-14 flex flex-col gap-8 md:mt-20 md:flex-row md:items-end md:justify-between"
          >
            <h2 className={cn(h2, ink, "max-w-[16ch]")}>
              Curious about Jesus? Come once.
            </h2>
            <div className="flex flex-wrap items-center gap-6">
              <Link
                href="/clubs"
                className="inline-flex items-center gap-2 rounded-full bg-[#1d1d1f] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-black"
              >
                Find a club
              </Link>
              <TextLink href="/contact">Get in touch</TextLink>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
