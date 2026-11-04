"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSupabaseServer } from "@/lib/supabase/server";
import { events as fileEvents } from "@/lib/data/events";
import { clubs as fileClubs } from "@/lib/data/clubs";
import { leaders as fileLeaders } from "@/lib/data/leadership";

export type SaveState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

async function requireUser() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return supabase;
}

// Every public page that reads editable content. Called after each write so
// the 5 minute read cache does not hide an edit from the person who made it.
function revalidatePublic() {
  for (const p of [
    "/",
    "/events",
    "/everything-night",
    "/clubs",
    "/leadership",
  ]) {
    revalidatePath(p);
  }
}

const str = (v: FormDataEntryValue | null) => String(v ?? "").trim();
const opt = (v: FormDataEntryValue | null) => {
  const s = str(v);
  return s ? s : null;
};
const slugRe = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function flatten(err: z.ZodError): SaveState {
  const fieldErrors: Record<string, string[]> = {};
  for (const issue of err.issues) {
    const key = String(issue.path[0] ?? "form");
    (fieldErrors[key] ??= []).push(issue.message);
  }
  return { error: "Check the highlighted fields.", fieldErrors };
}

// Events --------------------------------------------------------------

const eventSchema = z.object({
  slug: z.string().regex(slugRe, "Lowercase letters, numbers, and dashes."),
  title: z.string().min(1, "Required."),
  tagline: z.string().nullable(),
  description: z.string().nullable(),
  date_label: z.string().nullable(),
  time_label: z.string().nullable(),
  starts_at: z.string().nullable(),
  location: z.string().nullable(),
  rsvp_url: z.url("Must be a full URL.").nullable(),
  image_url: z.string().nullable(),
  category: z.string().nullable(),
  featured: z.boolean(),
  is_upcoming: z.boolean(),
  sort_order: z.number().int(),
});

export async function saveEvent(
  id: string,
  _prev: SaveState | undefined,
  formData: FormData,
): Promise<SaveState> {
  const supabase = await requireUser();
  const parsed = eventSchema.safeParse({
    slug: str(formData.get("slug")),
    title: str(formData.get("title")),
    tagline: opt(formData.get("tagline")),
    description: opt(formData.get("description")),
    date_label: opt(formData.get("date_label")),
    time_label: opt(formData.get("time_label")),
    starts_at: opt(formData.get("starts_at")),
    location: opt(formData.get("location")),
    rsvp_url: opt(formData.get("rsvp_url")),
    image_url: opt(formData.get("image_url")),
    category: opt(formData.get("category")),
    featured: formData.get("featured") === "on",
    is_upcoming: formData.get("is_upcoming") === "on",
    sort_order: Number(str(formData.get("sort_order")) || 0),
  });
  if (!parsed.success) return flatten(parsed.error);

  // Only one event is the flagship at a time.
  if (parsed.data.featured) {
    await supabase
      .from("events")
      .update({ featured: false })
      .eq("featured", true);
  }
  const q =
    id === "new"
      ? supabase.from("events").insert(parsed.data)
      : supabase.from("events").update(parsed.data).eq("id", id);
  const { error } = await q;
  if (error) return { error: error.message };
  revalidatePublic();
  redirect("/admin/events");
}

export async function deleteEvent(formData: FormData): Promise<void> {
  const supabase = await requireUser();
  await supabase
    .from("events")
    .delete()
    .eq("id", str(formData.get("id")));
  revalidatePublic();
  redirect("/admin/events");
}

export async function seedEvents(): Promise<void> {
  const supabase = await requireUser();
  const upcoming = new Set([
    "everything-night-may-2026",
    "worship-nights-summer",
  ]);
  await supabase.from("events").upsert(
    fileEvents.map((e, i) => ({
      slug: e.slug,
      title: e.title,
      tagline: e.tagline,
      description: e.description,
      date_label: e.date,
      time_label: e.time,
      starts_at: e.iso || null,
      location: e.location,
      rsvp_url: e.rsvpUrl ?? null,
      image_url: e.image,
      category: e.category,
      featured: Boolean(e.featured),
      is_upcoming: upcoming.has(e.slug),
      sort_order: i,
    })),
    { onConflict: "slug" },
  );
  revalidatePublic();
  redirect("/admin/events");
}

// Clubs ---------------------------------------------------------------

const clubSchema = z.object({
  slug: z.string().regex(slugRe, "Lowercase letters, numbers, and dashes."),
  school: z.string().min(1, "Required."),
  short_name: z.string().nullable(),
  city: z.string().nullable(),
  description: z.string().nullable(),
  leader_contact: z.string().nullable(),
  logo_url: z.string().nullable(),
  instagrams: z.array(
    z.object({ handle: z.string(), label: z.string().optional() }),
  ),
  sort_order: z.number().int(),
});

// "handle, handle:Label" in one text field, so no JSON in the form.
function parseInstagrams(raw: string) {
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => {
      const [handle, label] = s.split(":").map((x) => x.trim());
      return label
        ? { handle: handle.replace(/^@/, ""), label }
        : { handle: handle.replace(/^@/, "") };
    });
}

export async function saveClub(
  id: string,
  _prev: SaveState | undefined,
  formData: FormData,
): Promise<SaveState> {
  const supabase = await requireUser();
  const parsed = clubSchema.safeParse({
    slug: str(formData.get("slug")),
    school: str(formData.get("school")),
    short_name: opt(formData.get("short_name")),
    city: opt(formData.get("city")),
    description: opt(formData.get("description")),
    leader_contact: opt(formData.get("leader_contact")),
    logo_url: opt(formData.get("logo_url")),
    instagrams: parseInstagrams(str(formData.get("instagrams"))),
    sort_order: Number(str(formData.get("sort_order")) || 0),
  });
  if (!parsed.success) return flatten(parsed.error);

  const q =
    id === "new"
      ? supabase.from("clubs").insert(parsed.data)
      : supabase.from("clubs").update(parsed.data).eq("id", id);
  const { error } = await q;
  if (error) return { error: error.message };
  revalidatePublic();
  redirect("/admin/clubs");
}

export async function deleteClub(formData: FormData): Promise<void> {
  const supabase = await requireUser();
  await supabase
    .from("clubs")
    .delete()
    .eq("id", str(formData.get("id")));
  revalidatePublic();
  redirect("/admin/clubs");
}

export async function seedClubs(): Promise<void> {
  const supabase = await requireUser();
  await supabase.from("clubs").upsert(
    fileClubs.map((c, i) => ({
      slug: c.slug,
      school: c.school,
      short_name: c.shortName ?? null,
      city: c.city,
      description: c.description,
      logo_url: c.logo,
      instagrams: c.instagrams,
      sort_order: i,
    })),
    { onConflict: "slug" },
  );
  revalidatePublic();
  redirect("/admin/clubs");
}

// Leaders -------------------------------------------------------------

const leaderSchema = z.object({
  name: z.string().min(1, "Required."),
  role: z.string().min(1, "Required."),
  era: z.enum(["current", "past"]),
  blurb: z.string(),
  events: z.array(z.string()),
  sort_order: z.number().int(),
});

export async function saveLeader(
  id: string,
  _prev: SaveState | undefined,
  formData: FormData,
): Promise<SaveState> {
  const supabase = await requireUser();
  const parsed = leaderSchema.safeParse({
    name: str(formData.get("name")),
    role: str(formData.get("role")),
    era: str(formData.get("era")) === "past" ? "past" : "current",
    blurb: str(formData.get("blurb")),
    events: str(formData.get("events"))
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    sort_order: Number(str(formData.get("sort_order")) || 0),
  });
  if (!parsed.success) return flatten(parsed.error);

  const q =
    id === "new"
      ? supabase.from("leaders").insert(parsed.data)
      : supabase.from("leaders").update(parsed.data).eq("id", id);
  const { error } = await q;
  if (error) return { error: error.message };
  revalidatePublic();
  redirect("/admin/leaders");
}

export async function deleteLeader(formData: FormData): Promise<void> {
  const supabase = await requireUser();
  await supabase
    .from("leaders")
    .delete()
    .eq("id", str(formData.get("id")));
  revalidatePublic();
  redirect("/admin/leaders");
}

export async function seedLeaders(): Promise<void> {
  const supabase = await requireUser();
  const { count } = await supabase
    .from("leaders")
    .select("*", { count: "exact", head: true });
  // Leaders have no natural key, so only seed into an empty table.
  if (!count) {
    await supabase.from("leaders").insert(
      fileLeaders.map((l, i) => ({
        name: l.name,
        role: l.role,
        era: l.era,
        blurb: l.blurb,
        events: l.events ?? [],
        sort_order: i,
      })),
    );
  }
  revalidatePublic();
  redirect("/admin/leaders");
}
