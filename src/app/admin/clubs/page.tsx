import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
import { seedClubs } from "../content/actions";
import {
  AdminHeader,
  ButtonLink,
  EmptyState,
  ErrorNote,
  Row,
  Rows,
} from "../content/ui";

export const metadata = {
  title: "Clubs",
  robots: { index: false, follow: false },
};

export default async function AdminClubsPage() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data, error } = await supabase
    .from("clubs")
    .select("id, slug, school, short_name, city, sort_order")
    .order("sort_order")
    .order("school");

  return (
    <div className="max-w-4xl space-y-8">
      <AdminHeader
        eyebrow="Content"
        title="Clubs"
        description="Every campus on /clubs, the homepage index, and the logo strip."
        action={<ButtonLink href="/admin/clubs/new">Add a club</ButtonLink>}
      />
      <ErrorNote message={error?.message} />
      {!error && (!data || data.length === 0) ? (
        <EmptyState what="clubs" seed={seedClubs} />
      ) : (
        <Rows>
          {(data ?? []).map((c) => (
            <Row
              key={c.id}
              href={`/admin/clubs/${c.id}`}
              title={c.short_name ?? c.school}
              meta={[c.school, c.city].filter(Boolean).join(", ")}
            />
          ))}
        </Rows>
      )}
    </div>
  );
}
