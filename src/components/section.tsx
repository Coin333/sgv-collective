import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  align?: "left" | "center";
  tone?: "white" | "cream" | "navy";
};

export function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
  innerClassName,
  align = "left",
  tone = "white",
}: Props) {
  const dark = tone === "navy";
  const toneCls =
    tone === "white"
      ? "bg-white text-[#1d1d1f]"
      : tone === "cream"
        ? "bg-[#f5f5f7] text-[#1d1d1f]"
        : "bg-[#1d1d1f] text-white";
  return (
    <section
      id={id}
      className={cn("relative py-24 md:py-36", toneCls, className)}
    >
      <div
        className={cn("mx-auto max-w-[1180px] px-5 sm:px-8", innerClassName)}
      >
        {(eyebrow || title || description) && (
          <header
            className={cn(
              "max-w-2xl",
              align === "center" && "mx-auto text-center",
            )}
          >
            {eyebrow && (
              <p
                className={cn(
                  "text-[11px] font-medium uppercase tracking-[0.16em] sm:text-xs",
                  dark ? "text-white/60" : "text-[#6e6e73]",
                )}
              >
                {eyebrow}
              </p>
            )}
            {title && (
              <h2
                className={cn(
                  "mt-4 font-display font-semibold tracking-[-0.04em] [line-height:1.02] text-balance text-[clamp(2.25rem,5.2vw,4.25rem)]",
                  dark ? "text-white" : "text-[#1d1d1f]",
                )}
              >
                {title}
              </h2>
            )}
            {description && (
              <p
                className={cn(
                  "mt-5 text-base leading-relaxed md:text-lg",
                  dark ? "text-white/70" : "text-[#6e6e73]",
                )}
              >
                {description}
              </p>
            )}
          </header>
        )}
        <div className={cn(title || eyebrow ? "mt-14 md:mt-20" : "")}>
          {children}
        </div>
      </div>
    </section>
  );
}
