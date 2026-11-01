import { ArrowRight } from "lucide-react";
import { CTAButton } from "@/components/buttons";
import { ScrollReveal } from "@/components/scroll-reveal";
import { ClubCard } from "@/components/club-card";
import { ValleyCrossHero } from "@/components/hero/valley-cross-hero";
import { clubs } from "@/lib/data/clubs";
import { cn } from "@/lib/utils";

const ink = "text-[#1d1d1f]";
const muted = "text-[#6e6e73]";
const h2 =
  "font-display font-semibold tracking-[-0.04em] leading-[1] text-balance text-[clamp(2.5rem,6.5vw,5.5rem)]";

function Eyebrow({ children, dark }: { children: string; dark?: boolean }) {
  return (
    <p
      className={cn(
        "text-xs sm:text-sm font-medium tracking-[0.18em] uppercase",
        dark ? "text-[var(--color-baby)]" : muted,
      )}
    >
      {children}
    </p>
  );
}

function TextLink({ href, children }: { href: string; children: string }) {
  return (
    <CTAButton
      href={href}
      variant="ghost"
      className="rounded-full px-0 py-0 text-[var(--color-sky-600)] hover:bg-transparent hover:text-[var(--color-navy)] text-lg"
    >
      {children}
      <ArrowRight className="w-4 h-4" aria-hidden="true" />
    </CTAButton>
  );
}

export default function HomePage() {
  const previewClubs = clubs.slice(0, 6);

  return (
    <>
      <ValleyCrossHero />

      <section id="who-we-are" className="bg-white py-28 md:py-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center">
            <Eyebrow>Who we are</Eyebrow>
            <h2 className={cn(h2, ink, "mt-4")}>One family. One purpose.</h2>
          </ScrollReveal>
          <div className="mt-20 grid gap-14 md:grid-cols-3 md:gap-10">
            {[
              {
                title: "We're family.",
                body: "Every follower of Jesus in this valley belongs to the same family, the family of Christ. Different schools, same household.",
                ref: "Ephesians 2:19",
              },
              {
                title: "We have a purpose.",
                body: "Like John the Baptist, we're here to prepare the way for Jesus. That means making room for Him on every campus, and making room for students to thrive in the gifts God gave them.",
                ref: "John 1:23, Isaiah 40:3",
              },
              {
                title: "We serve first.",
                body: "We exist to resource the clubs, not to ask the clubs to resource us. Whether our name is on it or not, if Jesus is lifted up, we rejoice.",
                ref: "Philippians 1:18",
              },
            ].map((p, i) => (
              <ScrollReveal key={p.title} delay={i * 100}>
                <h3
                  className={cn(
                    "font-display text-3xl font-semibold tracking-[-0.03em]",
                    ink,
                  )}
                >
                  {p.title}
                </h3>
                <p className={cn("mt-4 text-lg leading-relaxed", muted)}>
                  {p.body}
                </p>
                <p className="mt-4 text-sm font-medium text-[var(--color-sky-600)]">
                  {p.ref}
                </p>
              </ScrollReveal>
            ))}
          </div>
          <ScrollReveal className="mt-16 text-center">
            <TextLink href="/about">Read our mission</TextLink>
          </ScrollReveal>
        </div>
      </section>

      <section className="bg-[var(--color-navy)] py-28 md:py-40 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <Eyebrow dark>2026–27</Eyebrow>
            <h2 className={cn(h2, "mt-4")}>This year: joyful community.</h2>
            <p className="mt-8 mx-auto max-w-2xl text-lg md:text-xl leading-relaxed text-[var(--color-sky-200)]">
              Every year we pray and ask one question: what does God want us to
              do in the valley this year? For 2026–27, the answer was joyful
              community and connection: creating spaces and hosting gatherings
              where Christians across the valley actually get to know each
              other, so you never feel alone at your school.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={120}>
            <blockquote className="mt-16 mx-auto max-w-3xl">
              <p className="font-display text-2xl md:text-4xl font-medium tracking-[-0.02em] leading-snug text-white">
                &ldquo;They broke bread in their homes and ate together with
                glad and sincere hearts.&rdquo;
              </p>
              <footer className="mt-4 text-sm font-medium text-[var(--color-baby)]">
                Acts 2:46
              </footer>
            </blockquote>
            <div className="mt-12">
              <CTAButton
                href="/events"
                variant="secondary"
                size="lg"
                className="rounded-full"
              >
                See gatherings
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </CTAButton>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section
        id="for-clubs"
        className="scroll-mt-16 bg-[#f5f5f7] py-28 md:py-40"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center">
            <Eyebrow>For clubs</Eyebrow>
            <h2 className={cn(h2, ink, "mt-4")}>Built to serve your club.</h2>
            <p
              className={cn(
                "mt-6 mx-auto max-w-2xl text-lg md:text-xl leading-relaxed",
                muted,
              )}
            >
              Free resources for every Christian club in the SGV. There&apos;s
              no catch and nothing to sign up for. If your club wants to help
              plan a gathering later, we&apos;d love that. It&apos;s never the
              price of admission.
            </p>
          </ScrollReveal>
          <div className="mt-16 grid gap-5 md:grid-cols-3">
            {[
              {
                n: "01",
                title: "Leader training and support",
                body: "Running a meeting, leading a Bible study, inviting friends, keeping a club going.",
              },
              {
                n: "02",
                title: "Pocket cards",
                body: "Printable cards that point new believers to a next step.",
              },
              {
                n: "03",
                title: "Connection to local churches",
                body: "A youth group to point people toward, or a pastor for the hard questions.",
              },
            ].map((r, i) => (
              <ScrollReveal key={r.title} delay={i * 100}>
                <article className="h-full rounded-3xl bg-white p-8 md:p-10 transition-transform duration-300 hover:-translate-y-1">
                  <p className="font-display text-sm font-semibold text-[var(--color-sky-600)]">
                    {r.n}
                  </p>
                  <h3
                    className={cn(
                      "mt-6 font-display text-2xl md:text-3xl font-semibold tracking-[-0.03em] leading-tight",
                      ink,
                    )}
                  >
                    {r.title}
                  </h3>
                  <p className={cn("mt-4 text-base leading-relaxed", muted)}>
                    {r.body}
                  </p>
                </article>
              </ScrollReveal>
            ))}
          </div>
          <ScrollReveal className="mt-14 text-center">
            <TextLink href="/contact">Request a resource</TextLink>
          </ScrollReveal>
        </div>
      </section>

      <section className="bg-white py-28 md:py-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center">
            <Eyebrow>The clubs</Eyebrow>
            <h2 className={cn(h2, ink, "mt-4")}>20 schools. One family.</h2>
            <p className={cn("mt-6 text-lg md:text-xl", muted)}>
              From Pasadena to Glendora, La Crescenta to Temple City. Find your
              campus, or start a club at yours.
            </p>
          </ScrollReveal>
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {previewClubs.map((c, i) => (
              <ScrollReveal key={c.slug} delay={i * 60}>
                <ClubCard club={c} />
              </ScrollReveal>
            ))}
          </div>
          <ScrollReveal className="mt-14 text-center">
            <TextLink href="/clubs">See all 20 clubs</TextLink>
          </ScrollReveal>
        </div>
      </section>

      <section className="bg-[#f5f5f7] py-28 md:py-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center">
            <Eyebrow>Where we&apos;ve been</Eyebrow>
            <h2 className={cn(h2, ink, "mt-4")}>Gatherings so far.</h2>
          </ScrollReveal>
          <div className="mt-16 grid gap-5 md:grid-cols-3">
            {[
              { big: "140+", label: "students at Everything Night 2025" },
              { big: "100+", label: "students at Everything Night 2026" },
            ].map((s, i) => (
              <ScrollReveal key={s.label} delay={i * 100}>
                <div className="h-full rounded-3xl bg-white p-8 md:p-10">
                  <p
                    className={cn(
                      "font-display text-7xl md:text-8xl font-semibold tracking-[-0.05em]",
                      ink,
                    )}
                  >
                    {s.big}
                  </p>
                  <p className={cn("mt-4 text-lg", muted)}>{s.label}</p>
                </div>
              </ScrollReveal>
            ))}
            <ScrollReveal delay={200}>
              <div className="h-full rounded-3xl bg-white p-8 md:p-10 flex flex-col justify-between">
                <p className={cn("text-lg", muted)}>
                  Worship nights through the year
                </p>
                <ul
                  className={cn(
                    "mt-6 font-display text-3xl md:text-4xl font-semibold tracking-[-0.03em] leading-tight",
                    ink,
                  )}
                >
                  <li>Chosen</li>
                  <li>Salt &amp; Light</li>
                  <li>Homeward</li>
                </ul>
              </div>
            </ScrollReveal>
          </div>
          <ScrollReveal className="mt-14 text-center">
            <TextLink href="/events">Past gatherings</TextLink>
          </ScrollReveal>
        </div>
      </section>

      <section className="bg-white py-32 md:py-48">
        <ScrollReveal className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className={cn(h2, ink)}>Curious about Jesus? Come once.</h2>
          <p className={cn("mt-6 text-lg md:text-xl", muted)}>
            Find a club at your school and just show up. No pressure, no
            pretending.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <CTAButton href="/clubs" size="lg" className="rounded-full">
              Find a club
            </CTAButton>
            <CTAButton
              href="/contact"
              variant="outline"
              size="lg"
              className="rounded-full"
            >
              Get in touch
            </CTAButton>
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}
