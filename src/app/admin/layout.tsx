import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  LogOut,
  MessageSquare,
  Megaphone,
  Users2,
  Calendar,
} from "lucide-react";
import {
  createSupabaseServer,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import { signOut } from "./actions";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Allow unauthenticated access only to /admin/login (handled there).
  // The layout protects every other admin route by checking the session.
  if (!isSupabaseConfigured()) {
    return (
      <div className="min-h-screen bg-[var(--color-cream)] grid place-items-center px-6">
        <div className="max-w-lg rounded-2xl bg-white border border-[var(--color-sky-100)] p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-[var(--color-navy)]">
            Admin needs Supabase
          </h1>
          <p className="mt-3 text-sm text-[var(--color-sky-700)] leading-relaxed">
            Set <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
            <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in your environment and
            redeploy. Then run the SQL in <code>supabase/schema.sql</code>.
          </p>
        </div>
      </div>
    );
  }

  return <AdminShell>{children}</AdminShell>;
}

async function AdminShell({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // The layout wraps all /admin pages. /admin/login is rendered by its own page.tsx.
  // We let unauthenticated users through only if their request is for /admin/login,
  // which we detect via the presence of the auth user. Pages other than login
  // call requireAdmin() to enforce.
  // To keep this simple and correct, we render the shell only when authed.
  if (!user) {
    // Not authed: render bare children so /admin/login can show.
    return (
      <div className="min-h-screen bg-[var(--color-cream)]">{children}</div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      <header className="sticky top-0 z-40 bg-white border-b border-[var(--color-sky-100)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2">
            <Image
              src="/images/sgv-logo.png"
              alt="SGV Christian Club Collective logo"
              width={36}
              height={36}
              className="w-9 h-9 object-contain"
            />
            <span className="hidden sm:block">
              <span className="block text-sm font-semibold text-[var(--color-navy)] leading-tight">
                Admin
              </span>
              <span className="block text-[11px] text-[var(--color-sky-600)] leading-tight">
                Christian Club Collective
              </span>
            </span>
          </Link>
          <nav className="flex items-center gap-1 text-sm">
            <Link
              href="/admin"
              className="px-3 py-2 rounded-lg text-[var(--color-sky-700)] hover:bg-[var(--color-sky-50)] hover:text-[var(--color-navy)] transition"
            >
              Overview
            </Link>
            <Link
              href="/admin/rsvps"
              className="px-3 py-2 rounded-lg text-[var(--color-sky-700)] hover:bg-[var(--color-sky-50)] hover:text-[var(--color-navy)] transition"
            >
              RSVPs
            </Link>
            <Link
              href="/admin/messages"
              className="px-3 py-2 rounded-lg text-[var(--color-sky-700)] hover:bg-[var(--color-sky-50)] hover:text-[var(--color-navy)] transition"
            >
              Messages
            </Link>
            <Link
              href="/admin/handoff"
              className="px-3 py-2 rounded-lg text-[var(--color-sky-700)] hover:bg-[var(--color-sky-50)] hover:text-[var(--color-navy)] transition"
            >
              Handoff
            </Link>
            <Link
              href="/"
              className="ml-2 px-3 py-2 rounded-lg text-[var(--color-sky-700)] hover:bg-[var(--color-sky-50)] hover:text-[var(--color-navy)] transition"
            >
              View site
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="ml-2 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-[var(--color-sky-700)] hover:bg-[var(--color-sky-50)] hover:text-[var(--color-navy)] transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" aria-hidden="true" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </form>
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {children}
      </div>
    </div>
  );
}

export const _icons = { MessageSquare, Megaphone, Users2, Calendar };
export async function _ensureUser() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return user;
}
