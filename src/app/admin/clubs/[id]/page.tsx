import { notFound, redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
import { deleteClub, saveClub } from "../../content/actions";
import { SaveForm } from "../../content/save-form";
import { AdminHeader, Field, QuietButton } from "../../content/ui";

export const metadata = {
  title: "Edit club",
  robots: { index: false, follow: false },
};

export default async function EditClubPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const row =
    id === "new"
      ? null
      : (await supabase.from("clubs").select("*").eq("id", id).maybeSingle())
          .data;
  if (id !== "new" && !row) notFound();

  const save = saveClub.bind(null, id);
  const handles = Array.isArray(row?.instagrams)
    ? (row!.instagrams as { handle: string; label?: string }[])
        .map((h) => (h.label ? `${h.handle}:${h.label}` : h.handle))
        .join(", ")
    : "";

  return (
    <div className="max-w-2xl space-y-8">
      <AdminHeader eyebrow="Club" title={row ? row.school : "New club"} />
      <SaveForm action={save} submitLabel={row ? "Save changes" : "Add club"}>
        {(fe) => (
          <>
            <Field
              label="School"
              name="school"
              defaultValue={row?.school}
              error={fe.school}
              required
            />
            <div className="grid gap-6 sm:grid-cols-2">
              <Field
                label="Short name"
                name="short_name"
                defaultValue={row?.short_name}
                hint="Pasadena HS"
              />
              <Field label="City" name="city" defaultValue={row?.city} />
            </div>
            <Field
              label="Slug"
              name="slug"
              defaultValue={row?.slug}
              error={fe.slug}
              hint="Lowercase with dashes, like san-marino. Becomes the link on the homepage index."
              required
            />
            <Field
              label="Description"
              name="description"
              defaultValue={row?.description}
              textarea
              rows={3}
            />
            <Field
              label="Instagram handles"
              name="instagrams"
              defaultValue={handles}
              hint="Comma separated, no @. Add a label with a colon when a school has two: arcadiafca:FCA, alliesarcadia:Allies"
            />
            <Field
              label="Logo path"
              name="logo_url"
              defaultValue={row?.logo_url}
              hint="/images/clubs/school.png, after adding the file to public/images/clubs in the repo."
            />
            <Field
              label="Leader contact (private)"
              name="leader_contact"
              defaultValue={row?.leader_contact}
              hint="Never shown on the site."
            />
            <Field
              label="Sort order"
              name="sort_order"
              type="number"
              defaultValue={row?.sort_order ?? 0}
            />
          </>
        )}
      </SaveForm>
      {row && (
        <form action={deleteClub} className="border-t border-[#1d1d1f]/10 pt-6">
          <input type="hidden" name="id" value={row.id} />
          <QuietButton>Delete this club</QuietButton>
        </form>
      )}
    </div>
  );
}
