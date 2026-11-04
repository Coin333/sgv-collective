"use client";

import { useActionState, type ReactNode } from "react";
import type { SaveState } from "./actions";
import { ErrorNote, PrimaryButton } from "./ui";

// Wraps an edit form so validation errors come back inline. The children
// render function receives the field errors from the last submit.
export function SaveForm({
  action,
  children,
  submitLabel,
}: {
  action: (
    prev: SaveState | undefined,
    formData: FormData,
  ) => Promise<SaveState>;
  children: (fieldErrors: Record<string, string[]>) => ReactNode;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);
  return (
    <form action={formAction} className="space-y-6">
      <ErrorNote message={state?.error} />
      {children(state?.fieldErrors ?? {})}
      <div className="flex items-center gap-4 pt-2">
        <PrimaryButton>{pending ? "Saving" : submitLabel}</PrimaryButton>
      </div>
    </form>
  );
}
