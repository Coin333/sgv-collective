import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ScrollReveal } from "@/components/scroll-reveal";
import { getPlaybook, playbooks } from "@/lib/data/playbooks";

export function generateStaticParams() {
  return playbooks.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = getPlaybook(slug);
  if (!p) return {};
  return { title: p.title, description: p.summary };
}

export default async function PlaybookPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = getPlaybook(slug);
  if (!p) notFound();

  return (
    <>
      <PageHeader eyebrow="Playbook" title={p.title} description={p.summary} />

      <section className="bg-white pb-24 pt-6 md:pb-36 md:pt-10">
        <div className="mx-auto grid max-w-[1180px] gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:gap-8">
          <aside className="lg:col-span-4">
            <div className="border-t border-[#1d1d1f]/10 pt-6 lg:sticky lg:top-24">
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#6e6e73] sm:text-xs">
                Before you start
              </p>
              <ul className="mt-4 space-y-3 text-base leading-relaxed text-[#1d1d1f]">
                {p.before.map((b) => (
                  <li key={b} className="flex gap-3">
                    <span className="mt-[0.7em] h-px w-4 shrink-0 bg-[#1d1d1f]/30" />
                    {b}
                  </li>
                ))}
              </ul>
              <p className="mt-8 text-[11px] font-medium uppercase tracking-[0.16em] text-[#6e6e73] sm:text-xs">
                Time
              </p>
              <p className="mt-2 text-base text-[#1d1d1f]">{p.time}</p>
            </div>
          </aside>

          <ol className="border-t border-[#1d1d1f]/10 lg:col-span-7 lg:col-start-6">
            {p.steps.map((s, i) => (
              <ScrollReveal key={s.title} delay={i * 50}>
                <li className="grid gap-3 border-b border-[#1d1d1f]/10 py-8 md:grid-cols-[3rem_1fr] md:py-10">
                  <span className="font-display text-sm font-medium tabular-nums text-[#6e6e73]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h2 className="font-display text-2xl font-semibold tracking-[-0.03em] text-[#1d1d1f] md:text-3xl">
                      {s.title}
                    </h2>
                    <p className="mt-3 text-base leading-relaxed text-[#6e6e73] md:text-lg">
                      {s.body}
                    </p>
                  </div>
                </li>
              </ScrollReveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-[#f5f5f7] py-16 md:py-24">
        <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-6 px-5 sm:px-8">
          <Link
            href="/playbooks"
            className="text-base font-medium text-[#6e6e73] transition-colors hover:text-[#1d1d1f]"
          >
            All playbooks
          </Link>
          {p.next ? (
            <Link
              href={`/playbooks/${p.next.slug}`}
              className="group inline-flex items-center gap-2 font-display text-2xl font-semibold tracking-[-0.03em] text-[#1d1d1f] md:text-3xl"
            >
              Next: {p.next.label}
              <ArrowRight
                className="h-6 w-6 transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          ) : (
            <Link
              href="/contact?type=lead"
              className="group inline-flex items-center gap-2 font-display text-2xl font-semibold tracking-[-0.03em] text-[#1d1d1f] md:text-3xl"
            >
              Tell us who is next
              <ArrowRight
                className="h-6 w-6 transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          )}
        </div>
      </section>
    </>
  );
}
