import { redirect } from "next/navigation";
import Link from "next/link";
import { Calendar, Megaphone, MessageSquare, Users2 } from "lucide-react";
import { createSupabaseServer } from "@/lib/supabase/server";

export const metadata = {
  title: "Admin overview",
  robots: { index: false, follow: false },
};

export default async function AdminHomePage() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const [{ count: rsvpCount }, { count: msgCount }] = await Promise.all([
    supabase.from("rsvps").select("*", { count: "exact", head: true }),
    supabase
      .from("contact_messages")
      .select("*", { count: "exact", head: true }),
  ]);

  const tiles = [
    {
      icon: Calendar,
      label: "Upcoming events",
      value: "Everything Night :: May 24",
      href: "/everything-night",
      external: false,
    },
    {
      icon: Users2,
      label: "RSVPs",
      value: rsvpCount?.toString() ?? "0",
      href: "/admin/rsvps",
    },
    {
      icon: MessageSquare,
      label: "Contact messages",
      value: msgCount?.toString() ?? "0",
      href: "/admin/messages",
    },
    {
      icon: Megaphone,
      label: "Handoff",
      value: "How to keep this alive",
      href: "/admin/handoff",
    },
  ];

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs font-semibold tracking-[0.25em] uppercase text-[var(--color-sky-600)]">
          Welcome back
        </p>
        <h1 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight text-[var(--color-navy)]">
          Admin overview
        </h1>
        <p className="mt-2 text-sm text-[var(--color-sky-700)]">
          Signed in as {user.email}
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {tiles.map((t) => (
          <Link
            key={t.label}
            href={t.href}
            className="rounded-2xl bg-white border border-[var(--color-sky-100)] p-5 hover:border-[var(--color-baby)] hover:shadow-md hover:shadow-[var(--color-navy)]/5 transition-all duration-300 group"
          >
            <div className="w-10 h-10 rounded-xl bg-[var(--color-sky-50)] grid place-items-center text-[var(--color-navy)] group-hover:bg-[var(--color-baby)] transition">
              <t.icon className="w-4 h-4" aria-hidden="true" />
            </div>
            <p className="mt-4 text-xs uppercase tracking-widest text-[var(--color-sky-600)]">
              {t.label}
            </p>
            <p className="mt-1 text-lg font-semibold text-[var(--color-navy)]">
              {t.value}
            </p>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl bg-white border border-[var(--color-sky-100)] p-6">
        <h2 className="text-base font-semibold text-[var(--color-navy)]">
          Quick tips
        </h2>
        <ul className="mt-3 space-y-2 text-sm text-[var(--color-sky-700)] list-disc pl-5">
          <li>
            Add admin users in the Supabase dashboard under Authentication &gt;
            Users.
          </li>
          <li>
            Run the SQL in <code>supabase/schema.sql</code> once to create
            tables and policies.
          </li>
          <li>
            Edit static content (clubs, leadership) in{" "}
            <code>src/lib/data/</code>. The DB tables are ready when you want to
            migrate to a CMS.
          </li>
        </ul>
      </div>
    </div>
  );
}
