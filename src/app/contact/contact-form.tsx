"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { submitContact, type ContactState } from "./actions";
import { cn } from "@/lib/utils";

const initial: ContactState = { ok: false };

const interests = [
  { value: "join", label: "Join a club" },
  { value: "start", label: "Start a club" },
  { value: "rsvp-help", label: "Everything Night question" },
  { value: "church", label: "Church partnership" },
  { value: "general", label: "Just say hi" },
];

const fieldCls =
  "w-full rounded-xl border bg-white px-4 py-3 text-base text-[#1d1d1f] placeholder:text-[#6e6e73]/70 transition-colors focus:border-[#1d1d1f] focus:outline-none";

export function ContactForm() {
  const sp = useSearchParams();
  const initialInterest = (() => {
    const t = sp.get("type");
    if (!t) return "general";
    if (interests.some((i) => i.value === t)) return t;
    return "general";
  })();

  const [interest, setInterest] = useState<string>(initialInterest);
  const [state, formAction, pending] = useActionState(submitContact, initial);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok && formRef.current) {
      formRef.current.reset();
      setInterest("general");
    }
  }, [state.ok]);

  const fe = state.fieldErrors ?? {};

  if (state.ok) {
    return (
      <div className="rounded-[20px] bg-[#f5f5f7] p-8 md:p-10">
        <h3 className="font-display text-2xl font-semibold tracking-[-0.03em] text-[#1d1d1f] md:text-3xl">
          Got it. Thanks for reaching out.
        </h3>
        <p className="mt-3 text-base text-[#6e6e73] md:text-lg">
          Someone from the team will get back to you within a few days.
        </p>
      </div>
    );
  }

  return (
    <form ref={formRef} action={formAction} noValidate className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          label="Name"
          name="name"
          required
          autoComplete="name"
          error={fe.name?.[0]}
        />
        <Field
          label="Email"
          name="email"
          type="email"
          required
          autoComplete="email"
          error={fe.email?.[0]}
        />
      </div>

      <Field
        label="School (optional)"
        name="school"
        autoComplete="organization"
        error={fe.school?.[0]}
      />

      <div>
        <p className="mb-2 text-sm font-medium text-[#1d1d1f]">
          Reason for reaching out
        </p>
        <input type="hidden" name="interest" value={interest} />
        <div className="flex flex-wrap gap-2">
          {interests.map((i) => (
            <button
              key={i.value}
              type="button"
              onClick={() => setInterest(i.value)}
              aria-pressed={interest === i.value}
              className={cn(
                "cursor-pointer rounded-full border px-3.5 py-2 text-sm font-medium transition-colors duration-200",
                interest === i.value
                  ? "border-[#1d1d1f] bg-[#1d1d1f] text-white"
                  : "border-[#1d1d1f]/15 bg-white text-[#1d1d1f] hover:border-[#1d1d1f]",
              )}
            >
              {i.label}
            </button>
          ))}
        </div>
        {fe.interest?.[0] && (
          <p className="mt-1 text-xs text-rose-600">{fe.interest[0]}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="message"
          className="mb-2 block text-sm font-medium text-[#1d1d1f]"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className={cn(
            fieldCls,
            "resize-y",
            fe.message?.[0] ? "border-rose-400" : "border-[#1d1d1f]/15",
          )}
          placeholder="Tell us a little about your school, your club, or what you are wondering."
        />
        {fe.message?.[0] && (
          <p className="mt-1 text-xs text-rose-600">{fe.message[0]}</p>
        )}
      </div>

      {state.error && !state.ok && (
        <div
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
        >
          {state.error}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#1d1d1f] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending && (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        )}
        {pending ? "Sending" : "Send message"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  autoComplete,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  error?: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-[#1d1d1f]"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        className={cn(
          fieldCls,
          error ? "border-rose-400" : "border-[#1d1d1f]/15",
        )}
      />
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </div>
  );
}
