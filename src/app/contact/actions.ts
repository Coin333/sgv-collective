"use server";

import { z } from "zod";
import {
  createSupabaseServer,
  isSupabaseConfigured,
} from "@/lib/supabase/server";

async function forwardEmail(
  kind: "contact" | "rsvp",
  record: Record<string, unknown>,
): Promise<void> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return;
  try {
    await fetch(`${url}/functions/v1/forward-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${anon}`,
      },
      body: JSON.stringify({ kind, record }),
    });
  } catch (err) {
    console.error("[forward-email] failed", err);
  }
}

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().email("Enter a valid email").max(200),
  school: z.string().trim().max(160).optional().or(z.literal("")),
  interest: z.enum(["join", "start", "lead", "church", "general", "rsvp-help"]),
  message: z.string().trim().min(1, "Add a short note").max(2000),
});

export type ContactState = {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export async function submitContact(
  _prev: ContactState | undefined,
  formData: FormData,
): Promise<ContactState> {
  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    school: String(formData.get("school") ?? ""),
    interest: String(formData.get("interest") ?? "general"),
    message: String(formData.get("message") ?? ""),
  };

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  if (!isSupabaseConfigured()) {
    // Graceful fallback so the form works even before Supabase is wired up.
    console.warn("[contact] Supabase env not set, accepting in dev only.");
    return { ok: true };
  }

  try {
    const supabase = await createSupabaseServer();
    const { error } = await supabase.from("contact_messages").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      school: parsed.data.school || null,
      interest: parsed.data.interest,
      message: parsed.data.message,
    });
    if (error) {
      console.error("[contact] insert failed", error);
      return {
        ok: false,
        error:
          "Something went wrong saving your message. Try again in a moment.",
      };
    }
    await forwardEmail("contact", {
      name: parsed.data.name,
      email: parsed.data.email,
      school: parsed.data.school || null,
      interest: parsed.data.interest,
      message: parsed.data.message,
    });
    return { ok: true };
  } catch (err) {
    console.error("[contact] unexpected", err);
    return {
      ok: false,
      error: "We could not reach the server. Try again in a moment.",
    };
  }
}

const rsvpSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  school: z.string().trim().max(160).optional().or(z.literal("")),
  guests: z.coerce.number().int().min(1).max(10).default(1),
  notes: z.string().trim().max(800).optional().or(z.literal("")),
  event_slug: z.string().trim().min(1).max(120),
});

export type RsvpState = {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export async function submitRsvp(
  _prev: RsvpState | undefined,
  formData: FormData,
): Promise<RsvpState> {
  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    school: String(formData.get("school") ?? ""),
    guests: String(formData.get("guests") ?? "1"),
    notes: String(formData.get("notes") ?? ""),
    event_slug: String(formData.get("event_slug") ?? ""),
  };

  const parsed = rsvpSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Check the form and try again.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  if (!isSupabaseConfigured()) {
    console.warn("[rsvp] Supabase env not set, accepting in dev only.");
    return { ok: true };
  }

  try {
    const supabase = await createSupabaseServer();
    const { error } = await supabase.from("rsvps").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      school: parsed.data.school || null,
      guests: parsed.data.guests,
      notes: parsed.data.notes || null,
      event_slug: parsed.data.event_slug,
    });
    if (error) {
      console.error("[rsvp] insert failed", error);
      return { ok: false, error: "Could not save your RSVP. Try again." };
    }
    await forwardEmail("rsvp", {
      name: parsed.data.name,
      email: parsed.data.email,
      school: parsed.data.school || null,
      guests: parsed.data.guests,
      notes: parsed.data.notes || null,
      event_slug: parsed.data.event_slug,
    });
    return { ok: true };
  } catch (err) {
    console.error("[rsvp] unexpected", err);
    return { ok: false, error: "Network error. Try again." };
  }
}
