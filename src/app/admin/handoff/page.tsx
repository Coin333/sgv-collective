import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";

export const metadata = {
  title: "Handoff",
  robots: { index: false, follow: false },
};

// Everything a new lead needs to keep the site alive. No secrets live here:
// this page says where each account is and who should hold it, never the
// password. Update the "Held by" column every June.
const accounts = [
  {
    service: "Domain: sgvc.cc",
    where: "GoDaddy",
    does: "The address. If this lapses the site disappears.",
    heldBy:
      "Unconfirmed. Find the GoDaddy login, add a second contact, turn on auto-renew.",
    note: "Registered May 3, 2026. Renews May 3, 2027.",
  },
  {
    service: "DNS",
    where: "Cloudflare",
    does: "Points sgvc.cc at the hosting. Nameservers addyson and harvey.",
    heldBy: "Unconfirmed.",
    note: "Only touch this when moving hosts.",
  },
  {
    service: "Hosting",
    where: "Vercel, project sgv-collective",
    does: "Builds and serves the site. Every push to main deploys to production. Every pull request gets a preview URL.",
    heldBy: "Unconfirmed.",
    note: "Environment variables for Supabase live here under Settings.",
  },
  {
    service: "Code",
    where: "GitHub, Coin333/sgv-collective",
    does: "The source. All content that is not in Supabase lives in src/lib/data.",
    heldBy:
      "Colin's personal account. Plan: move to an organization with two owners.",
    note: "A fork of tylerclaw007/sgv-collective, which is no longer the live one.",
  },
  {
    service: "Database and admin login",
    where: "Supabase",
    does: "RSVPs, contact messages, and the admin accounts for this area.",
    heldBy: "Unconfirmed.",
    note: "Add admins under Authentication, then Users.",
  },
  {
    service: "Instagram",
    where: "@sgv_christiancc",
    does: "Where students actually find out about gatherings.",
    heldBy: "The current leads.",
    note: "Change the password every June and share it in the vault.",
  },
  {
    service: "Email",
    where: "sgvchristianclubs@gmail.com",
    does: "Contact form replies, partner churches, the school district.",
    heldBy: "The current leads.",
    note: "Recovery phone should belong to an adult who is not graduating.",
  },
];

const edits = [
  {
    what: "Add a school year",
    file: "src/lib/data/years.ts",
    how: "Copy the last entry, fill in theme, leads, and gatherings, and set the next year to open: true. The homepage strip and /legacy both read from this file.",
  },
  {
    what: "Events and gatherings",
    file: "/admin/events",
    how: "Edit in the admin. The first time, press Load from the files. src/lib/data/events.ts is the fallback the site shows when the table is empty.",
  },
  {
    what: "Clubs",
    file: "/admin/clubs",
    how: "Edit in the admin. Logos still go in public/images/clubs in the repo; paste the path into the logo field.",
  },
  {
    what: "Leaders",
    file: "/admin/leaders",
    how: "Edit in the admin. In June move graduates to past; never delete them. That is the point.",
  },
  {
    what: "Churches and partners",
    file: "src/lib/data/churches.ts",
    how: "Name, pastor, city, one sentence, and a link.",
  },
  {
    what: "Playbooks",
    file: "src/lib/data/playbooks.ts",
    how: "Each playbook is a list of steps. Add one when a club figures something out worth passing on.",
  },
];

export default async function HandoffPage() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  return (
    <div className="max-w-4xl space-y-14">
      <header>
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#6e6e73] sm:text-xs">
          Handoff
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-[-0.04em] text-[#1d1d1f] md:text-5xl">
          How to keep this alive.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#6e6e73] md:text-lg">
          Leaders graduate every June. This page is for whoever picks it up.
          Read it once now and again the week you hand it to the next team.
          Nothing here is secret; the passwords live in the shared vault.
        </p>
      </header>

      <section>
        <h2 className="font-display text-2xl font-semibold tracking-[-0.03em] text-[#1d1d1f]">
          What one person holds
        </h2>
        <p className="mt-2 text-sm text-[#6e6e73]">
          Every row should have two people on it. Rows marked unconfirmed are
          the first job for the next lead.
        </p>
        <div className="mt-6 border-t border-[#1d1d1f]/10">
          {accounts.map((a) => (
            <div
              key={a.service}
              className="grid gap-2 border-b border-[#1d1d1f]/10 py-5 md:grid-cols-[1fr_2fr] md:gap-8"
            >
              <div>
                <p className="font-medium text-[#1d1d1f]">{a.service}</p>
                <p className="text-sm text-[#6e6e73]">{a.where}</p>
              </div>
              <div className="text-sm leading-relaxed text-[#6e6e73]">
                <p>{a.does}</p>
                <p className="mt-1">
                  <span className="text-[#1d1d1f]">Held by: </span>
                  {a.heldBy}
                </p>
                <p className="mt-1">{a.note}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl font-semibold tracking-[-0.03em] text-[#1d1d1f]">
          Changing what the site says
        </h2>
        <p className="mt-2 text-sm text-[#6e6e73]">
          Content lives in plain files. Edit on GitHub, open a pull request,
          check the Vercel preview link, then merge. Merging to main is the
          deploy.
        </p>
        <div className="mt-6 border-t border-[#1d1d1f]/10">
          {edits.map((e) => (
            <div
              key={e.what}
              className="grid gap-2 border-b border-[#1d1d1f]/10 py-5 md:grid-cols-[1fr_2fr] md:gap-8"
            >
              <div>
                <p className="font-medium text-[#1d1d1f]">{e.what}</p>
                <p className="font-mono text-xs text-[#6e6e73]">{e.file}</p>
              </div>
              <p className="text-sm leading-relaxed text-[#6e6e73]">{e.how}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl font-semibold tracking-[-0.03em] text-[#1d1d1f]">
          Every June
        </h2>
        <ol className="mt-6 space-y-4 border-t border-[#1d1d1f]/10 pt-6 text-base leading-relaxed text-[#6e6e73]">
          <li>
            <span className="text-[#1d1d1f]">1.</span> Add the year that just
            ended to years.ts with leads, gatherings, and honest numbers. Open
            the next year.
          </li>
          <li>
            <span className="text-[#1d1d1f]">2.</span> Put the new leads on
            every account above. Take the graduates off.
          </li>
          <li>
            <span className="text-[#1d1d1f]">3.</span> Rotate the Instagram and
            Gmail passwords. Update the vault.
          </li>
          <li>
            <span className="text-[#1d1d1f]">4.</span> Check the domain renewal
            date. If it is within a year, renew it now.
          </li>
          <li>
            <span className="text-[#1d1d1f]">5.</span> Walk the new leads
            through this page in person.
          </li>
        </ol>
      </section>

      <section className="rounded-[20px] bg-white p-6">
        <h2 className="font-display text-xl font-semibold tracking-[-0.03em] text-[#1d1d1f]">
          The two rules that do not change
        </h2>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-[#6e6e73]">
          <li>
            The collective resources clubs and never runs them. Adults from
            outside a school may not direct, conduct, control, or regularly
            attend a club meeting. That boundary protects the clubs.
          </li>
          <li>
            No donation buttons until there is a legal entity or a fiscal
            sponsor. Taking money starts a state registration clock.
          </li>
        </ul>
        <p className="mt-4 text-sm text-[#6e6e73]">
          The public version of all this is{" "}
          <Link
            href="/playbooks/hand-it-off"
            className="text-[#1d1d1f] underline"
          >
            the hand-it-off playbook
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
