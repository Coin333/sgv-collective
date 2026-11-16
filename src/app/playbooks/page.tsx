import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { EditorialList } from "@/components/editorial-list";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { playbooks } from "@/lib/data/playbooks";

export const metadata = {
  title: "Playbooks",
  description:
    "How to start a club, run a meeting, host a worship night, print the cutouts, and hand it all off. Written by clubs, for clubs.",
};

export default function PlaybooksPage() {
  return (
    <>
      <PageHeader
        eyebrow="Playbooks"
        title="Start from year three, not year zero."
        description="What the clubs across the valley have figured out, written down for whoever is next. Short enough to read at lunch."
        photo={{
          src: "/images/everything-night-dinner.jpg",
          alt: "Students eating dinner at long tables in a courtyard",
          caption:
            "Dinner at Everything Night, Pasadena High School, May 24, 2026",
        }}
      />

      <Section eyebrow="The library" title="Five things every club has to do.">
        <EditorialList
          items={playbooks.map((p, i) => ({
            title: `${String(i + 1).padStart(2, "0")} ${p.title}`,
            meta: `${p.steps.length} steps, ${p.time.toLowerCase()}`,
            body: p.summary,
            link: { href: `/playbooks/${p.slug}`, label: "Open the playbook" },
          }))}
        />
      </Section>

      <Section
        tone="navy"
        eyebrow="Add one"
        title="Figured something out? Write it down."
        description="If your club learned something the valley should know, send it in. We will put your school's name on it."
      >
        <Link
          href="/contact?type=general"
          className="group inline-flex items-center gap-1.5 text-base font-medium text-white"
        >
          Send a playbook
          <ArrowRight
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      </Section>
    </>
  );
}
