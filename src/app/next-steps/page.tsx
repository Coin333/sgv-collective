import Link from "next/link";
import { ArrowRight, ArrowUpRight, Plus } from "lucide-react";
import { EditorialList } from "@/components/editorial-list";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { ScrollReveal } from "@/components/scroll-reveal";
import {
  bibleAppLinks,
  biblePlans,
  foundations,
  reachOutFormUrl,
  sevenDays,
  welcomeVideo,
} from "@/lib/data/next-steps";
import { affiliates, churches } from "@/lib/data/churches";

export const metadata = {
  title: "Next Steps",
  description:
    "You said yes to Jesus. Here is what comes next: a 7-day guide, the Bible app, and a clear path forward.",
};

const apps = [
  { label: "iPhone", note: "Open the App Store", href: bibleAppLinks.iOS },
  { label: "Android", note: "Open Google Play", href: bibleAppLinks.android },
  {
    label: "Web reader",
    note: "bible.com in your browser",
    href: bibleAppLinks.web,
  },
];

const eyebrow =
  "text-[11px] font-medium uppercase tracking-[0.16em] text-[#6e6e73] sm:text-xs";

export default function NextStepsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Next steps"
        title="You said yes. Here is what comes next."
        description="Following Jesus is not a one-time decision and then you are on your own. It is a friendship you walk into. Below is a simple place to start."
      />

      <section className="bg-white pb-24 md:pb-36">
        <div className="mx-auto flex max-w-[1180px] flex-wrap items-center gap-6 border-t border-[#1d1d1f]/10 px-5 pt-10 sm:px-8">
          <Link
            href="#day-one"
            className="inline-flex items-center gap-2 rounded-full bg-[#1d1d1f] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-black"
          >
            Start with day one
          </Link>
          <Link
            href="#bible-app"
            className="group inline-flex items-center gap-1.5 text-base font-medium text-[#1d1d1f]"
          >
            Get the Bible app
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>
      </section>

      {welcomeVideo.youtubeId && (
        <Section
          eyebrow="Watch this"
          title="60 seconds. Why this matters."
          description="A short word from the collective before you start the guide."
        >
          <div className="relative aspect-video max-w-4xl overflow-hidden rounded-[20px] bg-[#1d1d1f] md:rounded-[28px]">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${welcomeVideo.youtubeId}?rel=0`}
              title={welcomeVideo.title}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          </div>
        </Section>
      )}

      <Section
        tone="cream"
        eyebrow="Start here"
        title="The basics, in plain words."
        description="Before plans or habits, three things to settle in your heart."
      >
        <EditorialList items={foundations} />
      </Section>

      <Section
        id="bible-app"
        eyebrow="The Bible app"
        title="Read the Bible on your phone."
        description="The YouVersion Bible app is free, works offline, and has reading plans built for new believers. Install it, then start a plan."
      >
        <ul className="grid border-t border-[#1d1d1f]/10 sm:grid-cols-3">
          {apps.map((a) => (
            <li
              key={a.label}
              className="border-b border-[#1d1d1f]/10 sm:border-b-0 sm:[&:not(:first-child)]:border-l"
            >
              <a
                href={a.href}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between gap-4 py-6 sm:px-6 sm:first:pl-0"
              >
                <span>
                  <span className="block text-lg font-medium text-[#1d1d1f]">
                    {a.label}
                  </span>
                  <span className="block text-sm text-[#6e6e73]">{a.note}</span>
                </span>
                <ArrowUpRight
                  className="h-5 w-5 shrink-0 text-[#1d1d1f] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </a>
            </li>
          ))}
        </ul>

        <p className={`mt-16 ${eyebrow}`}>Reading plans</p>
        <EditorialList
          className="mt-4"
          items={biblePlans.map((p) => ({
            title: p.title,
            meta: p.length,
            body: p.body,
            link: { href: p.href, label: "Open in YouVersion", external: true },
          }))}
        />
      </Section>

      <Section
        id="day-one"
        tone="cream"
        eyebrow="Seven days"
        title="A simple guide for your first week."
        description="One verse, one prayer, one small action. Open a day."
      >
        <div className="border-t border-[#1d1d1f]/10">
          {sevenDays.map((d, i) => (
            <ScrollReveal key={d.day} delay={i * 40}>
              <details className="group border-b border-[#1d1d1f]/10">
                <summary className="flex cursor-pointer list-none items-center gap-6 py-6 md:py-7 [&::-webkit-details-marker]:hidden">
                  <span className="w-10 shrink-0 font-display text-sm font-medium tabular-nums text-[#6e6e73]">
                    {String(d.day).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-xl font-semibold tracking-[-0.02em] text-[#1d1d1f] md:text-2xl">
                      {d.title}
                    </span>
                    <span className="mt-0.5 block text-sm text-[#6e6e73]">
                      {d.reference}
                    </span>
                  </span>
                  <Plus
                    className="h-5 w-5 shrink-0 text-[#1d1d1f] transition-transform duration-300 group-open:rotate-45"
                    aria-hidden="true"
                  />
                </summary>
                <div className="grid gap-8 pb-10 md:grid-cols-[2.5rem_2fr_1fr] md:gap-6">
                  <span className="hidden md:block" />
                  <blockquote className="font-display text-2xl font-medium tracking-[-0.02em] text-[#1d1d1f] text-balance md:text-3xl">
                    &ldquo;{d.verse}&rdquo;
                    <footer className="mt-3 font-sans text-sm font-normal tracking-normal text-[#6e6e73]">
                      {d.reference}
                    </footer>
                  </blockquote>
                  <div className="space-y-6">
                    <div>
                      <p className={eyebrow}>Prayer</p>
                      <p className="mt-2 text-base leading-relaxed text-[#6e6e73]">
                        {d.prayer}
                      </p>
                    </div>
                    <div>
                      <p className={eyebrow}>Today</p>
                      <p className="mt-2 text-base leading-relaxed text-[#6e6e73]">
                        {d.action}
                      </p>
                    </div>
                  </div>
                </div>
              </details>
            </ScrollReveal>
          ))}
        </div>
      </Section>

      <Section
        tone="navy"
        eyebrow="Do not walk alone"
        title="Find your people."
      >
        <EditorialList
          dark
          items={[
            {
              title: "Join a club on your campus.",
              body: "Twenty high schools. Real friendships. We meet, we eat, we ask hard questions.",
              link: { href: "/clubs", label: "Find your campus" },
            },
            {
              title: "Come to Everything Night.",
              body: "The whole valley in one room. Worship, food, friends, Jesus. Bring someone.",
              link: { href: "/everything-night", label: "Everything Night" },
            },
          ]}
        />
      </Section>

      <Section
        id="get-connected"
        eyebrow="Get connected"
        title="Find a church that will know you by name."
        description="A club is for the school year. A church is for life. These are the partner churches walking with us across the valley."
      >
        <ScrollReveal className="rounded-[20px] bg-[#f5f5f7] p-7 md:rounded-[28px] md:p-10">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className={eyebrow}>Want someone to reach out?</p>
              <h3 className="mt-2 font-display text-2xl font-semibold tracking-[-0.03em] text-[#1d1d1f] md:text-3xl">
                Drop your name, number, and city.
              </h3>
              <p className="mt-2 max-w-xl text-base leading-relaxed text-[#6e6e73] md:text-lg">
                A youth leader from the collective will text you within 48
                hours. No spam, just hello.
              </p>
            </div>
            {reachOutFormUrl ? (
              <a
                href={reachOutFormUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 self-start rounded-full bg-[#1d1d1f] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-black md:self-auto"
              >
                Fill out the form
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            ) : (
              <Link
                href="/contact?type=join"
                className="inline-flex items-center gap-2 self-start rounded-full bg-[#1d1d1f] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-black md:self-auto"
              >
                Send us a note
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            )}
          </div>
        </ScrollReveal>

        <EditorialList
          className="mt-16"
          items={churches.map((c) => ({
            title: c.name,
            meta: [c.pastor ?? c.pastors?.join(", "), c.city]
              .filter(Boolean)
              .join(", "),
            body: c.blurb ?? c.support,
            link: c.url
              ? { href: c.url, label: "Visit church", external: true }
              : { href: "/contact?type=church", label: "Ask for an intro" },
          }))}
        />

        {affiliates.length > 0 && (
          <>
            <p className={`mt-16 ${eyebrow}`}>Trusted partners</p>
            <EditorialList
              className="mt-4"
              items={affiliates.map((a) => ({
                title: a.name,
                body: a.blurb ?? a.description,
                link: a.url
                  ? { href: a.url, label: "Visit site", external: true }
                  : undefined,
              }))}
            />
          </>
        )}
      </Section>
    </>
  );
}
