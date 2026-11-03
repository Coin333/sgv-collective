import Image from "next/image";
import { ScrollReveal } from "@/components/scroll-reveal";
import { cn } from "@/lib/utils";

type Props = {
  eyebrow: string;
  title: string;
  description?: string;
  photo?: { src: string; alt: string; caption?: string };
};

// Light, typographic page opener shared by every inner page. A photo, when
// given, sits under the words rather than behind them.
export function PageHeader({ eyebrow, title, description, photo }: Props) {
  return (
    <section className="bg-white pt-28 md:pt-40">
      <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
        <ScrollReveal>
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#6e6e73] sm:text-xs">
            {eyebrow}
          </p>
          <h1 className="mt-5 max-w-[16ch] font-display font-semibold tracking-[-0.05em] leading-[0.96] text-[clamp(2.75rem,7.5vw,6.5rem)] text-[#1d1d1f]">
            {title}
          </h1>
        </ScrollReveal>
        {description && (
          <ScrollReveal delay={100}>
            <p className="mt-10 max-w-xl text-lg leading-relaxed text-[#6e6e73] md:text-xl">
              {description}
            </p>
          </ScrollReveal>
        )}
      </div>
      {photo && (
        <ScrollReveal
          delay={200}
          className="mx-auto mt-16 max-w-[1180px] px-5 sm:px-8 md:mt-24"
        >
          <figure>
            <div className="relative aspect-[3/2] overflow-hidden rounded-[20px] bg-[#f5f5f7] md:aspect-[21/9] md:rounded-[28px]">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                priority
                sizes="(max-width: 1180px) 100vw, 1180px"
                className="object-cover"
              />
            </div>
            {photo.caption && (
              <figcaption
                className={cn("mt-4 text-xs text-[#6e6e73] sm:text-sm")}
              >
                {photo.caption}
              </figcaption>
            )}
          </figure>
        </ScrollReveal>
      )}
    </section>
  );
}
