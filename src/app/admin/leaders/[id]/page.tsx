import { notFound, redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
import { deleteLeader, saveLeader } from "../../content/actions";
import { SaveForm } from "../../content/save-form";
import { AdminHeader, Field, QuietButton, Select } from "../../content/ui";

export const metadata = {
  title: "Edit leader",
  robots: { index: false, follow: false },
};

export default async function EditLeaderPage({
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
      : (await supabase.from("leaders").select("*").eq("id", id).maybeSingle())
          .data;
  if (id !== "new" && !row) notFound();

  const save = saveLeader.bind(null, id);

  return (
    <div className="max-w-2xl space-y-8">
      <AdminHeader eyebrow="Leader" title={row ? row.name : "New leader"} />
      <SaveForm action={save} submitLabel={row ? "Save changes" : "Add leader"}>
        {(fe) => (
          <>
            <Field
              label="Name"
              name="name"
              defaultValue={row?.name}
              error={fe.name}
              required
              hint="First name only is fine."
            />
            <Field
              label="Role"
              name="role"
              defaultValue={row?.role}
              error={fe.role}
              required
              hint="President, Worship Co-Lead, Inner Circle, Founder"
            />
            <Select
              label="Era"
              name="era"
              defaultValue={row?.era ?? "current"}
              options={[
                { value: "current", label: "Current team" },
                { value: "past", label: "Past" },
              ]}
            />
            <Field
              label="One line about them"
              name="blurb"
              defaultValue={row?.blurb}
              textarea
              rows={3}
            />
            <Field
              label="Gatherings they helped run"
              name="events"
              defaultValue={row?.events?.join(", ")}
              hint="Comma separated. Everything Night Logistics, Salt & Light Worship Night"
            />
            <Field
              label="Sort order"
              name="sort_order"
              type="number"
              defaultValue={row?.sort_order ?? 0}
              hint="Lower numbers first within current or past."
            />
          </>
        )}
      </SaveForm>
      {row && (
        <form
          action={deleteLeader}
          className="border-t border-[#1d1d1f]/10 pt-6"
        >
          <input type="hidden" name="id" value={row.id} />
          <QuietButton>Delete this leader</QuietButton>
        </form>
      )}
    </div>
  );
}
