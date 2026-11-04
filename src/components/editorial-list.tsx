import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { cn } from "@/lib/utils";

export type EditorialItem = {
  title: string;
  meta?: string;
  body: string;
  link?: { href: string; label: string; external?: boolean };
};

// Hairline rows: title and a small meta line on the left, the body on the
// right. Used in place of cards everywhere the content is a list of things.
export function EditorialList({
  items,
  dark,
  className,
}: {
  items: EditorialItem[];
  dark?: boolean;
  className?: string;
}) {
  const rule = dark ? "border-white/15" : "border-[#1d1d1f]/10";
  return (
    <div className={className}>
      {items.map((c, i) => (
        <ScrollReveal
          key={c.title}
          delay={i * 70}
          className={cn(
            "grid gap-3 border-t py-8 md:grid-cols-[1fr_2fr] md:gap-8 md:py-10",
            rule,
          )}
        >
          <div>
            <h3
              className={cn(
                "font-display text-2xl font-semibold tracking-[-0.03em] md:text-3xl",
                dark ? "text-white" : "text-[#1d1d1f]",
              )}
            >
              {c.title}
            </h3>
            {c.meta && (
              <p
                className={cn(
                  "mt-2 text-sm",
                  dark ? "text-white/60" : "text-[#6e6e73]",
                )}
              >
                {c.meta}
              </p>
            )}
          </div>
          <div>
            <p
              className={cn(
                "text-base leading-relaxed md:text-lg",
                dark ? "text-white/70" : "text-[#6e6e73]",
              )}
            >
              {c.body}
            </p>
            {c.link &&
              (c.link.external ? (
                <a
                  href={c.link.href}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(
                    "group mt-5 inline-flex items-center gap-1.5 text-base font-medium",
                    dark ? "text-white" : "text-[#1d1d1f]",
                  )}
                >
                  {c.link.label}
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </a>
              ) : (
                <Link
                  href={c.link.href}
                  className={cn(
                    "group mt-5 inline-flex items-center gap-1.5 text-base font-medium",
                    dark ? "text-white" : "text-[#1d1d1f]",
                  )}
                >
                  {c.link.label}
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              ))}
          </div>
        </ScrollReveal>
      ))}
      <div className={cn("border-t", rule)} />
    </div>
  );
}
