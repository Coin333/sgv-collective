import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
import { seedLeaders } from "../content/actions";
import {
  AdminHeader,
  ButtonLink,
  EmptyState,
  ErrorNote,
  Row,
  Rows,
} from "../content/ui";

export const metadata = {
  title: "Leaders",
  robots: { index: false, follow: false },
};

export default async function AdminLeadersPage() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data, error } = await supabase
    .from("leaders")
    .select("id, name, role, era, sort_order")
    .order("era")
    .order("sort_order")
    .order("name");

  const current = (data ?? []).filter((l) => l.era === "current");
  const past = (data ?? []).filter((l) => l.era === "past");

  return (
    <div className="max-w-4xl space-y-8">
      <AdminHeader
        eyebrow="Content"
        title="Leaders"
        description="The team on /leadership. In June, move graduates to past instead of deleting them. The yearbook on /legacy is edited in src/lib/data/years.ts."
        action={<ButtonLink href="/admin/leaders/new">Add a leader</ButtonLink>}
      />
      <ErrorNote message={error?.message} />
      {!error && (!data || data.length === 0) ? (
        <EmptyState what="leaders" seed={seedLeaders} />
      ) : (
        <>
          <section>
            <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.16em] text-[#6e6e73]">
              Current team
            </p>
            <Rows>
              {current.map((l) => (
                <Row
                  key={l.id}
                  href={`/admin/leaders/${l.id}`}
                  title={l.name}
                  meta={l.role}
                />
              ))}
            </Rows>
          </section>
          <section>
            <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.16em] text-[#6e6e73]">
              Past
            </p>
            <Rows>
              {past.map((l) => (
                <Row
                  key={l.id}
                  href={`/admin/leaders/${l.id}`}
                  title={l.name}
                  meta={l.role}
                />
              ))}
            </Rows>
          </section>
        </>
      )}
    </div>
  );
}
