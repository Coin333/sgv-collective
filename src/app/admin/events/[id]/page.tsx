import { notFound, redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
import { deleteEvent, saveEvent } from "../../content/actions";
import { SaveForm } from "../../content/save-form";
import {
  AdminHeader,
  Checkbox,
  Field,
  QuietButton,
  Select,
} from "../../content/ui";

export const metadata = {
  title: "Edit gathering",
  robots: { index: false, follow: false },
};

const categories = ["Everything Night", "Worship Night", "Summer"];

export default async function EditEventPage({
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
      : (await supabase.from("events").select("*").eq("id", id).maybeSingle())
          .data;
  if (id !== "new" && !row) notFound();

  const save = saveEvent.bind(null, id);

  return (
    <div className="max-w-2xl space-y-8">
      <AdminHeader
        eyebrow="Gathering"
        title={row ? row.title : "New gathering"}
        description="Dates and times are written out as people should read them, so TBA is fine. The ISO field only orders the list."
      />
      <SaveForm
        action={save}
        submitLabel={row ? "Save changes" : "Add gathering"}
      >
        {(fe) => (
          <>
            <Field
              label="Title"
              name="title"
              defaultValue={row?.title}
              error={fe.title}
              required
            />
            <Field
              label="Slug"
              name="slug"
              defaultValue={row?.slug}
              error={fe.slug}
              hint="Lowercase with dashes, like everything-night-may-2027. Used in RSVP records."
              required
            />
            <Field label="Tagline" name="tagline" defaultValue={row?.tagline} />
            <Field
              label="Description"
              name="description"
              defaultValue={row?.description}
              textarea
              rows={5}
            />
            <div className="grid gap-6 sm:grid-cols-2">
              <Field
                label="Date, as written"
                name="date_label"
                defaultValue={row?.date_label}
                hint="Sunday, May 24"
              />
              <Field
                label="Time, as written"
                name="time_label"
                defaultValue={row?.time_label}
                hint="3:30 PM"
              />
            </div>
            <Field
              label="Start (ISO, optional)"
              name="starts_at"
              defaultValue={row?.starts_at}
              hint="2027-05-23T15:30:00-07:00. Orders the list; leave blank for TBA."
            />
            <Field
              label="Location"
              name="location"
              defaultValue={row?.location}
            />
            <Field
              label="RSVP link"
              name="rsvp_url"
              defaultValue={row?.rsvp_url}
              error={fe.rsvp_url}
              hint="Partiful or a form. Leave blank for none."
            />
            <Field
              label="Image path"
              name="image_url"
              defaultValue={row?.image_url}
              hint="/images/your-photo.jpg, after adding it to public/images in the repo."
            />
            <Select
              label="Category"
              name="category"
              defaultValue={row?.category ?? "Worship Night"}
              options={categories.map((c) => ({ value: c, label: c }))}
            />
            <div className="space-y-3">
              <Checkbox
                label="Flagship"
                name="featured"
                defaultChecked={row?.featured}
                hint="Shown on the homepage and /everything-night. Only one at a time."
              />
              <Checkbox
                label="Upcoming"
                name="is_upcoming"
                defaultChecked={row?.is_upcoming}
                hint="Untick after it happens; it moves to past gatherings."
              />
            </div>
            <Field
              label="Sort order"
              name="sort_order"
              type="number"
              defaultValue={row?.sort_order ?? 0}
              hint="Lower numbers first."
            />
          </>
        )}
      </SaveForm>
      {row && (
        <form
          action={deleteEvent}
          className="border-t border-[#1d1d1f]/10 pt-6"
        >
          <input type="hidden" name="id" value={row.id} />
          <QuietButton>Delete this gathering</QuietButton>
        </form>
      )}
    </div>
  );
}
