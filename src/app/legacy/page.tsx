import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { years, founded } from "@/lib/data/years";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Our story",
  description:
    "Every school year of the SGV Christian Club Collective, who led it, and what they built. Started by students on November 12, 2024.",
};

const ink = "text-[#1d1d1f]";
const muted = "text-[#6e6e73]";

const photoByYear: Record<string, { src: string; alt: string }> = {
  "2024-25": {
    src: "/images/everything-night-crowd.jpg",
    alt: "Students singing and laughing in a packed auditorium at the first Everything Night",
  },
  "2025-26": {
    src: "/images/everything-night-main.jpg",
    alt: "Over a hundred students on stage at Everything Night 2026 with a wooden cross",
  },
  "2026-27": {
    src: "/images/everything-night-picnic.jpg",
    alt: "Students in a circle on the grass sharing dinner at dusk",
  },
};

export default function LegacyPage() {
  return (
    <>
      <section className="bg-white pt-28 md:pt-40">
        <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
          <ScrollReveal>
            <p
              className={cn(
                "text-[11px] font-medium uppercase tracking-[0.16em] sm:text-xs",
                muted,
              )}
            >
              Since {founded}
            </p>
            <h1
              className={cn(
                "mt-5 max-w-[16ch] font-display font-semibold tracking-[-0.05em] [line-height:0.96] text-[clamp(2.75rem,7.5vw,6.5rem)]",
                ink,
              )}
            >
              Leaders graduate. The network stays.
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <p
              className={cn(
                "mt-10 max-w-xl text-lg leading-relaxed md:text-xl",
                muted,
              )}
            >
              This page is the collective&apos;s memory. One entry per school
              year: who carried it, what they hosted, what happened. Every June
              a new group of students adds the next line.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
          <ol>
            {years.map((y, i) => {
              const photo = photoByYear[y.slug];
              return (
                <ScrollReveal
                  as="li"
                  key={y.slug}
                  className={cn(
                    "grid gap-10 border-t py-16 md:grid-cols-12 md:gap-8 md:py-24",
                    y.open ? "border-[#1d1d1f]" : "border-[#1d1d1f]/10",
                  )}
                >
                  <div className="md:col-span-4">
                    <p
                      className={cn(
                        "font-display text-5xl font-semibold tracking-[-0.05em] md:text-6xl",
                        ink,
                      )}
                    >
                      {y.label}
                    </p>
                    <p className={cn("mt-2 text-base", y.open ? ink : muted)}>
                      {y.theme}
                    </p>
                    <dl className="mt-10 space-y-6 text-sm">
                      <div>
                        <dt
                          className={cn(
                            "text-[11px] font-medium uppercase tracking-[0.14em]",
                            muted,
                          )}
                        >
                          {y.leadTitle}
                        </dt>
                        <dd className={cn("mt-1.5 text-base", ink)}>
                          {y.leads.length ? y.leads.join(", ") : "Open"}
                        </dd>
                      </div>
                      {y.gatherings.length > 0 && (
                        <div>
                          <dt
                            className={cn(
                              "text-[11px] font-medium uppercase tracking-[0.14em]",
                              muted,
                            )}
                          >
                            Gatherings
                          </dt>
                          <dd className="mt-1.5">
                            <ul className="space-y-3">
                              {y.gatherings.map((g) => (
                                <li key={g.name + g.date}>
                                  <p className={cn("text-base", ink)}>
                                    {g.name}
                                  </p>
                                  <p className={muted}>
                                    {g.date}, {g.venue}
                                  </p>
                                  {g.note && <p className={muted}>{g.note}</p>}
                                </li>
                              ))}
                            </ul>
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>

                  <div className="md:col-span-7 md:col-start-6">
                    {photo ? (
                      <div className="relative aspect-[3/2] overflow-hidden rounded-[20px] bg-[#f5f5f7]">
                        <Image
                          src={photo.src}
                          alt={photo.alt}
                          fill
                          priority={i === 0}
                          sizes="(max-width: 768px) 100vw, 680px"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div
                        aria-hidden="true"
                        className="aspect-[3/2] rounded-[20px] border border-dashed border-[#1d1d1f]/25"
                      />
                    )}
                    <p
                      className={cn(
                        "mt-8 max-w-xl text-lg leading-relaxed md:text-xl",
                        ink,
                      )}
                    >
                      {y.summary}
                    </p>
                    {y.open && (
                      <Link
                        href="/contact?type=lead"
                        className="group mt-8 inline-flex items-center gap-1.5 text-base font-medium text-[#1d1d1f]"
                      >
                        Tell us you are interested
                        <ArrowRight
                          className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </Link>
                    )}
                  </div>
                </ScrollReveal>
              );
            })}
          </ol>
          <div className="border-t border-[#1d1d1f]/10" />
        </div>
      </section>
    </>
  );
}
