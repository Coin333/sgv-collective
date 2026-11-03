import { Suspense } from "react";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { ContactForm } from "./contact-form";
import { Mail, Sparkles } from "lucide-react";
import { InstagramIcon } from "@/components/icons/instagram";

export const metadata = {
  title: "Contact",
  description:
    "Join a club, start a club, or get in touch with the SGV Christian Club Collective.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Say hi. Ask anything."
        description="We read every message. Whether you want to join, start, lead, or just ask a question, drop a note."
      />

      <Section tone="white">
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <Suspense fallback={<div className="h-96" />}>
              <ContactForm />
            </Suspense>
          </div>

          <aside className="space-y-5">
            <div className="rounded-2xl bg-[var(--color-cream)] border border-[var(--color-sky-100)] p-6">
              <div className="w-10 h-10 rounded-xl bg-white grid place-items-center text-[var(--color-navy)]">
                <Mail className="w-4 h-4" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-[var(--color-navy)]">
                Email us
              </h3>
              <a
                href="mailto:sgvchristianclubs@gmail.com"
                className="mt-1 inline-block text-sm text-[var(--color-sky-700)] fancy-link hover:text-[var(--color-navy)]"
              >
                sgvchristianclubs@gmail.com
              </a>
            </div>

            <div className="rounded-2xl bg-[var(--color-navy)] text-white p-6">
              <div className="w-10 h-10 rounded-xl bg-white/10 grid place-items-center text-[var(--color-baby)]">
                <Sparkles className="w-4 h-4" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-base font-semibold">
                Coming to Everything Night?
              </h3>
              <p className="mt-1 text-sm text-[var(--color-sky-200)]">
                RSVP on Partiful so we know how much food to make.
              </p>
              <a
                href="https://partiful.com/e/gy3BajXzxlnGA6VuPei2?c=Pgd2dAsW"
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--color-baby)] text-[var(--color-navy)] hover:bg-white transition cursor-pointer"
              >
                Partiful RSVP
              </a>
            </div>

            <div className="rounded-2xl bg-white border border-[var(--color-sky-100)] p-6">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-sky-50)] grid place-items-center text-[var(--color-navy)]">
                <InstagramIcon className="w-4 h-4" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-[var(--color-navy)]">
                Follow along
              </h3>
              <p className="mt-1 text-sm text-[var(--color-sky-700)]">
                We post upcoming events and recap photos on Instagram.
              </p>
              <a
                href="https://instagram.com/sgv_christiancc"
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--color-navy)] text-white hover:bg-[var(--color-baby)] hover:text-[var(--color-navy)] transition cursor-pointer"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
                @sgv_christiancc
              </a>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
