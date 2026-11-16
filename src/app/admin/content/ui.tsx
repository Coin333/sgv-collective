import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// Small form kit for the admin editors. Server-rendered, no client state.

const input =
  "w-full rounded-xl border border-[#1d1d1f]/15 bg-white px-4 py-3 text-base text-[#1d1d1f] placeholder:text-[#6e6e73]/60 focus:border-[#1d1d1f] focus:outline-none";

export function AdminHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-6">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#6e6e73] sm:text-xs">
          {eyebrow}
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-[-0.04em] text-[#1d1d1f] md:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#6e6e73]">
            {description}
          </p>
        )}
      </div>
      {action}
    </header>
  );
}

export function Field({
  label,
  name,
  defaultValue,
  type = "text",
  hint,
  error,
  required,
  textarea,
  rows = 4,
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  type?: string;
  hint?: string;
  error?: string[];
  required?: boolean;
  textarea?: boolean;
  rows?: number;
}) {
  const cls = cn(input, error && "border-rose-400");
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-[#1d1d1f]"
      >
        {label}
      </label>
      {textarea ? (
        <textarea
          id={name}
          name={name}
          rows={rows}
          defaultValue={defaultValue ?? ""}
          required={required}
          className={cn(cls, "resize-y")}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          defaultValue={defaultValue ?? ""}
          required={required}
          className={cls}
        />
      )}
      {hint && !error && <p className="mt-1 text-xs text-[#6e6e73]">{hint}</p>}
      {error && <p className="mt-1 text-xs text-rose-600">{error[0]}</p>}
    </div>
  );
}

export function Checkbox({
  label,
  name,
  defaultChecked,
  hint,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
  hint?: string;
}) {
  return (
    <label className="flex items-start gap-3 text-sm text-[#1d1d1f]">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="mt-0.5 h-4 w-4 accent-[#1d1d1f]"
      />
      <span>
        <span className="block font-medium">{label}</span>
        {hint && <span className="block text-xs text-[#6e6e73]">{hint}</span>}
      </span>
    </label>
  );
}

export function Select({
  label,
  name,
  defaultValue,
  options,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-[#1d1d1f]"
      >
        {label}
      </label>
      <select
        id={name}
        name={name}
        defaultValue={defaultValue ?? ""}
        className={input}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function PrimaryButton({ children }: { children: ReactNode }) {
  return (
    <button
      type="submit"
      className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#1d1d1f] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-black"
    >
      {children}
    </button>
  );
}

export function QuietButton({ children }: { children: ReactNode }) {
  return (
    <button
      type="submit"
      className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#1d1d1f]/15 bg-white px-5 py-2.5 text-sm font-medium text-[#1d1d1f] transition-colors hover:border-[#1d1d1f]"
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-full bg-[#1d1d1f] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-black"
    >
      {children}
    </Link>
  );
}

export function ErrorNote({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
    >
      {message}
    </div>
  );
}

export function EmptyState({
  what,
  seed,
}: {
  what: string;
  seed: (formData: FormData) => Promise<void>;
}) {
  return (
    <div className="rounded-[20px] bg-white p-8">
      <p className="font-display text-xl font-semibold tracking-[-0.03em] text-[#1d1d1f]">
        No {what} in the database yet.
      </p>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#6e6e73]">
        The site is showing the {what} from the code files. Load them in here
        once, then edit them on this page from now on. If this errors, the SQL
        in supabase/migrations has not been run yet.
      </p>
      <form action={seed} className="mt-5">
        <PrimaryButton>Load {what} from the files</PrimaryButton>
      </form>
    </div>
  );
}

export function Rows({ children }: { children: ReactNode }) {
  return <ul className="border-t border-[#1d1d1f]/10">{children}</ul>;
}

export function Row({
  href,
  title,
  meta,
  tag,
}: {
  href: string;
  title: string;
  meta?: string;
  tag?: string;
}) {
  return (
    <li className="border-b border-[#1d1d1f]/10">
      <Link
        href={href}
        className="flex items-center justify-between gap-6 py-4 transition-colors hover:bg-white/60"
      >
        <span className="min-w-0">
          <span className="block truncate text-base font-medium text-[#1d1d1f]">
            {title}
          </span>
          {meta && (
            <span className="block truncate text-sm text-[#6e6e73]">
              {meta}
            </span>
          )}
        </span>
        {tag && (
          <span className="shrink-0 rounded-full border border-[#1d1d1f]/15 px-2.5 py-0.5 text-xs text-[#1d1d1f]">
            {tag}
          </span>
        )}
      </Link>
    </li>
  );
}
