import { ClubsGrid } from "./clubs-grid";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { CTAButton } from "@/components/buttons";
import { clubs } from "@/lib/data/clubs";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Clubs",
  description:
    "Find your campus. 20 high school Christian clubs across the SGV.",
};

export default function ClubsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Clubs"
        title="Find your campus."
        description="20 high school clubs across the San Gabriel Valley. If your school is here, show up. If it is not, start one."
      />

      <Section tone="white">
        <ClubsGrid clubs={clubs} />
      </Section>

      <Section tone="cream" align="center">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[var(--color-navy)] text-balance">
            Do not see your school?
          </h2>
          <p className="mt-4 text-base md:text-lg text-[var(--color-sky-700)] leading-relaxed">
            We would love to help you start a club at your campus.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <CTAButton href="/contact?type=start" variant="primary" size="lg">
              Start a club
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </CTAButton>
            <CTAButton href="/contact" variant="outline" size="lg">
              Just say hi
            </CTAButton>
          </div>
        </div>
      </Section>
    </>
  );
}
