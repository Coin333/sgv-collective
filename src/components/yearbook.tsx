import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { years } from "@/lib/data/years";
import { cn } from "@/lib/utils";

// Horizontal strip of school years. The last column is always the open one.
export function Yearbook({ compact = false }: { compact?: boolean }) {
  return (
    <div className="relative">
      <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <ol className="grid min-w-[760px] grid-cols-4 gap-6 border-t border-[#1d1d1f]/10 sm:min-w-0 sm:gap-8">
          {years.map((y, i) => (
            <ScrollReveal as="li" key={y.slug} delay={i * 80}>
              <div
                className={cn(
                  "-mt-px border-t pt-6",
                  y.open ? "border-[#1d1d1f]" : "border-[#1d1d1f]/10",
                )}
              >
                <p className="font-display text-3xl font-semibold tracking-[-0.04em] text-[#1d1d1f] md:text-4xl">
                  {y.label}
                </p>
                <p
                  className={cn(
                    "mt-1 text-sm",
                    y.open ? "text-[#1d1d1f]" : "text-[#6e6e73]",
                  )}
                >
                  {y.theme}
                </p>

                <dl className="mt-8 space-y-5 text-sm">
                  <div>
                    <dt className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#6e6e73]">
                      {y.leadTitle}
                    </dt>
                    <dd className="mt-1.5 leading-relaxed text-[#1d1d1f]">
                      {y.leads.length ? (
                        y.leads.join(", ")
                      ) : (
                        <span className="inline-block h-[1.1em] w-28 translate-y-[3px] border-b border-dashed border-[#1d1d1f]/40" />
                      )}
                    </dd>
                  </div>
                  {!compact && (
                    <div>
                      <dt className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#6e6e73]">
                        Gatherings
                      </dt>
                      <dd className="mt-1.5 space-y-1.5 leading-relaxed text-[#1d1d1f]">
                        {y.gatherings.length ? (
                          y.gatherings.map((g) => (
                            <p key={g.name + g.date}>{g.name}</p>
                          ))
                        ) : (
                          <span className="inline-block h-[1.1em] w-36 translate-y-[3px] border-b border-dashed border-[#1d1d1f]/40" />
                        )}
                      </dd>
                    </div>
                  )}
                </dl>

                {y.open && (
                  <Link
                    href="/contact?type=lead"
                    className="group mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-[#1d1d1f]"
                  >
                    Pick it up
                    <ArrowRight
                      className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </Link>
                )}
              </div>
            </ScrollReveal>
          ))}
        </ol>
      </div>
    </div>
  );
}
