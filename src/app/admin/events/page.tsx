import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
import { seedEvents } from "../content/actions";
import {
  AdminHeader,
  ButtonLink,
  EmptyState,
  ErrorNote,
  Row,
  Rows,
} from "../content/ui";

export const metadata = {
  title: "Events",
  robots: { index: false, follow: false },
};

export default async function AdminEventsPage() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data, error } = await supabase
    .from("events")
    .select(
      "id, slug, title, date_label, location, featured, is_upcoming, sort_order",
    )
    .order("sort_order")
    .order("starts_at", { ascending: false, nullsFirst: false });

  return (
    <div className="max-w-4xl space-y-8">
      <AdminHeader
        eyebrow="Content"
        title="Gatherings"
        description="Everything on /events and the flagship on the homepage. Mark one event as the flagship and tick upcoming for anything still ahead."
        action={
          <ButtonLink href="/admin/events/new">Add a gathering</ButtonLink>
        }
      />
      <ErrorNote message={error?.message} />
      {!error && (!data || data.length === 0) ? (
        <EmptyState what="gatherings" seed={seedEvents} />
      ) : (
        <Rows>
          {(data ?? []).map((e) => (
            <Row
              key={e.id}
              href={`/admin/events/${e.id}`}
              title={e.title}
              meta={[e.date_label, e.location].filter(Boolean).join(", ")}
              tag={
                e.featured ? "Flagship" : e.is_upcoming ? "Upcoming" : undefined
              }
            />
          ))}
        </Rows>
      )}
    </div>
  );
}
