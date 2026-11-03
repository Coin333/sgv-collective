import {
  ArrowRight,
  Apple,
  BookOpen,
  ChevronDown,
  Globe,
  HandHeart,
  Heart,
  PlayCircle,
  Smartphone,
  Sparkles,
  Sprout,
} from "lucide-react";
import { CTAButton } from "@/components/buttons";
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
import { Church, ExternalLink, MapPin, MessageCircle } from "lucide-react";

export const metadata = {
  title: "Next Steps",
  description:
    "You said yes to Jesus. Here is what comes next: a 7-day guide, the Bible app, and a clear path forward.",
};

export default function NextStepsPage() {
  return (
    <>
      <section className="relative min-h-[80svh] overflow-hidden bg-[var(--color-navy)]">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-navy)] via-[var(--color-sky-900)] to-[var(--color-navy)]" />
          <div className="absolute inset-0 bg-dot-grid-dark opacity-30" />
          <div
            className="absolute inset-0 opacity-40 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 70% 50% at 80% 10%, rgba(142,197,251,0.25), transparent), radial-gradient(ellipse 60% 50% at 10% 90%, rgba(184,220,255,0.18), transparent)",
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 md:pt-40 md:pb-28 min-h-[80svh] flex flex-col justify-center">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.25em] uppercase text-[var(--color-baby)]">
              <span className="w-6 h-px bg-[var(--color-baby)]" />
              Next Steps
            </p>
            <h1 className="mt-5 text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white text-balance [line-height:1.05]">
              You said yes.{" "}
              <span className="text-[var(--color-baby)]">
                Here is what comes next.
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-base md:text-lg text-[var(--color-sky-200)] leading-relaxed">
              Following Jesus is not a one-time decision and then you are on
              your own. It is a friendship you walk into. Below is a simple
              place to start.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <CTAButton href="#day-one" variant="secondary" size="lg">
                Start with day one
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </CTAButton>
              <CTAButton
                href="#bible-app"
                variant="ghost"
                size="lg"
                className="text-white hover:bg-white/10"
              >
                Get the Bible app
              </CTAButton>
            </div>

            <dl className="mt-14 grid grid-cols-3 gap-6 max-w-lg">
              {[
                { n: "1", l: "Decision" },
                { n: "7", l: "Day guide" },
                { n: "20", l: "Campuses" },
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
        eyebrow="Watch this"
        title="60 seconds. Why this matters."
        description="A short word from the collective before you start the guide."
      >
        <div className="max-w-4xl">
          {welcomeVideo.youtubeId ? (
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-[var(--color-sky-100)] shadow-xl shadow-[var(--color-navy)]/10 bg-[var(--color-navy)]">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${welcomeVideo.youtubeId}?rel=0`}
                title={welcomeVideo.title}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          ) : (
            <div className="relative aspect-video rounded-2xl border-2 border-dashed border-[var(--color-baby)] bg-gradient-to-br from-[var(--color-cream)] to-white grid place-items-center text-center px-6">
              <div>
                <div className="mx-auto w-14 h-14 rounded-2xl bg-[var(--color-baby)] grid place-items-center text-[var(--color-navy)]">
                  <PlayCircle className="w-7 h-7" aria-hidden="true" />
                </div>
                <p className="mt-5 text-base md:text-lg font-semibold text-[var(--color-navy)]">
                  Welcome video coming soon.
                </p>
                <p className="mt-2 text-sm text-[var(--color-sky-700)] max-w-md mx-auto">
                  Drop a YouTube ID into{" "}
                  <span className="font-mono text-[var(--color-navy)]">
                    lib/data/next-steps.ts
                  </span>{" "}
                  to go live.
                </p>
              </div>
            </div>
          )}
        </div>
      </Section>

      <Section
        eyebrow="Start here"
        title="The basics, in plain words."
        description="Before plans or habits, three things to settle in your heart."
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {foundations.map((f, i) => {
            const Icon = [Sparkles, Heart, Sprout][i] ?? Sparkles;
            return (
              <ScrollReveal key={f.title} delay={i * 90}>
                <article className="group h-full rounded-2xl border border-[var(--color-sky-100)] bg-white p-7 hover:border-[var(--color-baby)] hover:shadow-lg hover:shadow-[var(--color-navy)]/5 transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-[var(--color-sky-50)] grid place-items-center text-[var(--color-navy)] group-hover:bg-[var(--color-baby)] transition">
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-[var(--color-navy)]">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--color-sky-700)] leading-relaxed">
                    {f.body}
                  </p>
                </article>
              </ScrollReveal>
            );
          })}
        </div>
      </Section>

      <Section
        id="bible-app"
        tone="cream"
        eyebrow="The Bible app"
        title="Read the Bible on your phone."
        description="The YouVersion Bible app is free, works offline, and has reading plans built for new believers. Install it, then start a plan."
      >
        <div className="grid gap-3 sm:grid-cols-3 max-w-3xl">
          <a
            href={bibleAppLinks.iOS}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-3 rounded-2xl border border-[var(--color-sky-100)] bg-white p-5 hover:border-[var(--color-baby)] hover:shadow-md transition cursor-pointer"
          >
            <div className="w-11 h-11 rounded-xl bg-[var(--color-sky-50)] grid place-items-center text-[var(--color-navy)] group-hover:bg-[var(--color-baby)] transition">
              <Apple className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--color-navy)]">
                iPhone
              </p>
              <p className="text-xs text-[var(--color-sky-700)]">
                Open the App Store
              </p>
            </div>
          </a>
          <a
            href={bibleAppLinks.android}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-3 rounded-2xl border border-[var(--color-sky-100)] bg-white p-5 hover:border-[var(--color-baby)] hover:shadow-md transition cursor-pointer"
          >
            <div className="w-11 h-11 rounded-xl bg-[var(--color-sky-50)] grid place-items-center text-[var(--color-navy)] group-hover:bg-[var(--color-baby)] transition">
              <Smartphone className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--color-navy)]">
                Android
              </p>
              <p className="text-xs text-[var(--color-sky-700)]">
                Open Google Play
              </p>
            </div>
          </a>
          <a
            href={bibleAppLinks.web}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-3 rounded-2xl border border-[var(--color-sky-100)] bg-white p-5 hover:border-[var(--color-baby)] hover:shadow-md transition cursor-pointer"
          >
            <div className="w-11 h-11 rounded-xl bg-[var(--color-sky-50)] grid place-items-center text-[var(--color-navy)] group-hover:bg-[var(--color-baby)] transition">
              <Globe className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--color-navy)]">
                Web reader
              </p>
              <p className="text-xs text-[var(--color-sky-700)]">
                bible.com in your browser
              </p>
            </div>
          </a>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {biblePlans.map((p, i) => (
            <ScrollReveal key={p.id} delay={i * 90}>
              <a
                href={p.href}
                target="_blank"
                rel="noreferrer"
                className="group h-full flex flex-col rounded-2xl bg-white border border-[var(--color-sky-100)] p-7 hover:border-[var(--color-baby)] hover:shadow-lg hover:shadow-[var(--color-navy)]/5 transition cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-[var(--color-sky-50)] grid place-items-center text-[var(--color-navy)] group-hover:bg-[var(--color-baby)] transition">
                    <BookOpen className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <span className="text-xs font-semibold tracking-widest uppercase text-[var(--color-sky-600)]">
                    {p.length}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-semibold text-[var(--color-navy)]">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm text-[var(--color-sky-700)] leading-relaxed flex-1">
                  {p.body}
                </p>
                <p className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-sky-600)] group-hover:text-[var(--color-navy)] transition">
                  Open in YouVersion
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </p>
              </a>
            </ScrollReveal>
          ))}
        </div>
      </Section>

      <Section
        id="day-one"
        eyebrow="Seven days"
        title="A simple guide for your first week."
        description="One verse, one prayer, one small action. Tap a day to open it."
      >
        <div className="space-y-3 max-w-3xl">
          {sevenDays.map((d, i) => (
            <ScrollReveal key={d.day} delay={i * 50}>
              <details className="group rounded-2xl border border-[var(--color-sky-100)] bg-white open:shadow-lg open:shadow-[var(--color-navy)]/5 open:border-[var(--color-baby)] transition-all">
                <summary className="list-none flex items-center justify-between gap-4 p-5 cursor-pointer rounded-2xl">
                  <div className="flex items-center gap-4 min-w-0">
                    <span className="shrink-0 w-10 h-10 rounded-xl bg-[var(--color-sky-50)] grid place-items-center text-sm font-bold text-[var(--color-navy)] group-open:bg-[var(--color-baby)] transition">
                      {d.day}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-base font-semibold text-[var(--color-navy)] truncate">
                        {d.title}
                      </span>
                      <span className="block text-xs text-[var(--color-sky-600)] mt-0.5">
                        {d.reference}
                      </span>
                    </span>
                  </div>
                  <ChevronDown
                    className="w-5 h-5 text-[var(--color-sky-600)] transition-transform duration-300 group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <div className="px-5 pb-6 pt-1 grid gap-5 sm:grid-cols-3">
                  <div className="sm:col-span-2">
                    <p className="text-xs font-semibold tracking-widest uppercase text-[var(--color-sky-600)]">
                      Verse
                    </p>
                    <blockquote className="mt-2 text-base text-[var(--color-navy)] leading-relaxed text-balance">
                      &ldquo;{d.verse}&rdquo;
                    </blockquote>
                    <p className="mt-2 text-xs text-[var(--color-sky-600)]">
                      {d.reference}
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-semibold tracking-widest uppercase text-[var(--color-sky-600)]">
                        Prayer
                      </p>
                      <p className="mt-2 text-sm text-[var(--color-sky-700)] leading-relaxed">
                        {d.prayer}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold tracking-widest uppercase text-[var(--color-sky-600)]">
                        Today
                      </p>
                      <p className="mt-2 text-sm text-[var(--color-sky-700)] leading-relaxed">
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

      <Section tone="navy" eyebrow="Don't walk alone" title="Find your people.">
        <div className="grid gap-6 md:grid-cols-2 max-w-4xl">
          <article className="rounded-2xl bg-white/5 border border-white/10 p-7 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-xl bg-[var(--color-baby)] grid place-items-center text-[var(--color-navy)]">
              <HandHeart className="w-5 h-5" aria-hidden="true" />
            </div>
            <h3 className="mt-5 text-xl font-semibold text-white">
              Join a club on your campus.
            </h3>
            <p className="mt-2 text-sm text-[var(--color-sky-200)] leading-relaxed">
              Twenty high schools. Real friendships. We meet, we eat, we ask
              hard questions.
            </p>
            <CTAButton href="/clubs" variant="secondary" className="mt-6">
              Find your campus
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </CTAButton>
          </article>
          <article className="rounded-2xl bg-white/5 border border-white/10 p-7 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-xl bg-[var(--color-baby)] grid place-items-center text-[var(--color-navy)]">
              <PlayCircle className="w-5 h-5" aria-hidden="true" />
            </div>
            <h3 className="mt-5 text-xl font-semibold text-white">
              Come to Everything Night.
            </h3>
            <p className="mt-2 text-sm text-[var(--color-sky-200)] leading-relaxed">
              The whole valley in one room. Worship, food, friends, Jesus. Bring
              someone.
            </p>
            <CTAButton
              href="/everything-night"
              variant="secondary"
              className="mt-6"
            >
              RSVP for May 24
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </CTAButton>
          </article>
        </div>
      </Section>

      <Section
        id="get-connected"
        tone="cream"
        eyebrow="Get connected"
        title="Find a church that will know you by name."
        description="A club is for the school year. A church is for life. These are the partner churches walking with us across the valley."
      >
        <article className="md:col-span-2 mb-6 rounded-2xl bg-[var(--color-navy)] text-white p-7 md:p-9 overflow-hidden relative">
          <div className="absolute inset-0 bg-dot-grid-dark opacity-25 pointer-events-none" />
          <div className="relative grid gap-6 md:grid-cols-[auto_1fr_auto] md:items-center">
            <div className="shrink-0 w-14 h-14 rounded-2xl bg-[var(--color-baby)] grid place-items-center text-[var(--color-navy)]">
              <MessageCircle className="w-6 h-6" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--color-baby)]">
                Want someone to reach out?
              </p>
              <h3 className="mt-1 text-xl md:text-2xl font-semibold tracking-tight">
                Drop your name, number, and city.
              </h3>
              <p className="mt-2 text-sm md:text-base text-[var(--color-sky-200)] leading-relaxed max-w-xl">
                A youth leader from the collective will text you within 48
                hours. No spam, just hello.
              </p>
            </div>
            {reachOutFormUrl ? (
              <a
                href={reachOutFormUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm md:text-base font-semibold bg-[var(--color-baby)] hover:bg-[var(--color-sky-300)] text-[var(--color-navy)] transition-all duration-200 cursor-pointer shadow-md shadow-black/20 self-start md:self-auto"
              >
                Fill out the form
                <ExternalLink className="w-4 h-4" aria-hidden="true" />
              </a>
            ) : (
              <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-white/10 text-[var(--color-baby)] border border-dashed border-[var(--color-baby)] self-start md:self-auto">
                Form coming soon
              </span>
            )}
          </div>
        </article>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {churches.map((c, i) => (
            <ScrollReveal key={c.name} delay={i * 60}>
              <article className="group h-full flex flex-col rounded-2xl bg-white border border-[var(--color-sky-100)] p-6 hover:border-[var(--color-baby)] hover:shadow-lg hover:shadow-[var(--color-navy)]/5 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-11 h-11 rounded-xl bg-[var(--color-sky-50)] grid place-items-center text-[var(--color-navy)] group-hover:bg-[var(--color-baby)] transition">
                    <Church className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-semibold text-[var(--color-navy)]">
                      {c.name}
                    </h3>
                    {c.pastor && (
                      <p className="mt-0.5 text-sm font-medium text-[var(--color-sky-600)]">
                        {c.pastor}
                      </p>
                    )}
                    {c.pastors && (
                      <p className="mt-0.5 text-sm font-medium text-[var(--color-sky-600)]">
                        {c.pastors.join(", ")}
                      </p>
                    )}
                    {c.city && (
                      <p className="mt-2 inline-flex items-center gap-1 text-xs text-[var(--color-sky-700)]">
                        <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                        {c.city}
                      </p>
                    )}
                  </div>
                </div>
                <p className="mt-4 text-sm text-[var(--color-sky-700)] leading-relaxed flex-1">
                  {c.blurb ?? c.support}
                </p>
                {c.url ? (
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-sky-600)] hover:text-[var(--color-navy)] transition self-start"
                  >
                    Visit church
                    <ExternalLink className="w-4 h-4" aria-hidden="true" />
                  </a>
                ) : (
                  <p className="mt-5 text-xs text-[var(--color-sky-600)] italic self-start">
                    Reach out through the collective for an intro.
                  </p>
                )}
              </article>
            </ScrollReveal>
          ))}
        </div>

        {affiliates.length > 0 && (
          <div className="mt-12">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--color-sky-600)]">
              Trusted partners
            </p>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              {affiliates.map((a, i) => (
                <ScrollReveal key={a.name} delay={i * 60}>
                  <article className="group h-full flex flex-col rounded-2xl bg-white border border-dashed border-[var(--color-sky-200)] p-6 hover:border-[var(--color-baby)] transition-all duration-300">
                    <h3 className="text-base font-semibold text-[var(--color-navy)]">
                      {a.name}
                    </h3>
                    <p className="mt-2 text-sm text-[var(--color-sky-700)] leading-relaxed flex-1">
                      {a.blurb ?? a.description}
                    </p>
                    {a.url && (
                      <a
                        href={a.url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-sky-600)] hover:text-[var(--color-navy)] transition self-start"
                      >
                        Visit site
                        <ExternalLink className="w-4 h-4" aria-hidden="true" />
                      </a>
                    )}
                  </article>
                </ScrollReveal>
              ))}
            </div>
          </div>
        )}
      </Section>
    </>
  );
}
