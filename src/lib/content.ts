import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";
import { events as fileEvents, type Event } from "@/lib/data/events";
import { clubs as fileClubs, type Club } from "@/lib/data/clubs";
import { leaders as fileLeaders, type Leader } from "@/lib/data/leadership";

// Public reads for events, clubs, and leaders. Each one tries Supabase first
// and falls back to the file in src/lib/data when the table is empty, missing,
// or Supabase is not configured. The admin pages write to the tables; the
// files stay as the seed and the safety net.
//
// Reads go through a cookie-less client with a 5 minute cache so public pages
// stay static. Admin actions call revalidatePath after every write.

const REVALIDATE_SECONDS = 300;

function publicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  return createClient<Database>(url, anon, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) =>
        fetch(input, { ...init, next: { revalidate: REVALIDATE_SECONDS } }),
    },
  });
}

type EventRow = Database["public"]["Tables"]["events"]["Row"];
type ClubRow = Database["public"]["Tables"]["clubs"]["Row"];
type LeaderRow = Database["public"]["Tables"]["leaders"]["Row"];

export function eventFromRow(
  r: EventRow,
): Event & { id: string; isUpcoming: boolean } {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    tagline: r.tagline ?? "",
    date: r.date_label ?? "",
    time: r.time_label ?? "",
    iso: r.starts_at ?? "",
    location: r.location ?? "",
    description: r.description ?? "",
    rsvpUrl: r.rsvp_url ?? undefined,
    image: r.image_url ?? "/images/coming-soon.svg",
    featured: r.featured,
    category: (r.category as Event["category"]) ?? "Worship Night",
    isUpcoming: r.is_upcoming,
  };
}

export function clubFromRow(r: ClubRow): Club & { id: string } {
  const handles = Array.isArray(r.instagrams)
    ? (r.instagrams as { handle: string; label?: string }[]).filter(
        (h) => h && typeof h.handle === "string",
      )
    : [];
  return {
    id: r.id,
    slug: r.slug,
    school: r.school,
    shortName: r.short_name ?? undefined,
    city: r.city ?? "",
    description: r.description ?? "",
    logo: r.logo_url ?? "/images/sgv-logo.png",
    instagrams: handles,
  };
}

export function leaderFromRow(r: LeaderRow): Leader & { id: string } {
  return {
    id: r.id,
    name: r.name,
    role: r.role,
    era: r.era === "past" ? "past" : "current",
    blurb: r.blurb,
    events: r.events.length ? r.events : undefined,
  };
}

export type PublicEvent = Event & { isUpcoming: boolean };

// The file has no upcoming flag; this list mirrors what /events used to
// hardcode, so the fallback matches the old site exactly.
const FILE_UPCOMING = new Set([
  "everything-night-may-2026",
  "worship-nights-summer",
]);

export async function getEvents(): Promise<PublicEvent[]> {
  const db = publicClient();
  if (db) {
    const { data, error } = await db
      .from("events")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("starts_at", { ascending: false, nullsFirst: false });
    if (!error && data && data.length > 0) return data.map(eventFromRow);
  }
  return fileEvents.map((e) => ({
    ...e,
    isUpcoming: FILE_UPCOMING.has(e.slug),
  }));
}

export async function getFeaturedEvent(): Promise<PublicEvent> {
  const all = await getEvents();
  return all.find((e) => e.featured) ?? all[0];
}

export async function getClubs(): Promise<Club[]> {
  const db = publicClient();
  if (db) {
    const { data, error } = await db
      .from("clubs")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("school", { ascending: true });
    if (!error && data && data.length > 0) return data.map(clubFromRow);
  }
  return fileClubs;
}

export async function getLeaders(): Promise<Leader[]> {
  const db = publicClient();
  if (db) {
    const { data, error } = await db
      .from("leaders")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });
    if (!error && data && data.length > 0) return data.map(leaderFromRow);
  }
  return fileLeaders;
}
