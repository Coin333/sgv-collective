import type { Leader } from "@/lib/data/leadership";

export function LeaderCard({ leader }: { leader: Leader }) {
  return (
    <article className="flex h-full flex-col rounded-[20px] bg-[#f5f5f7] p-7 md:p-8">
      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#6e6e73]">
        {leader.role}
      </p>
      <h3 className="mt-3 font-display text-2xl font-semibold tracking-[-0.03em] text-[#1d1d1f]">
        {leader.name}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-[#6e6e73]">
        {leader.blurb}
      </p>
      {leader.events && leader.events.length > 0 ? (
        <ul className="mt-6 flex flex-wrap gap-x-3 gap-y-1 border-t border-[#1d1d1f]/10 pt-4 text-xs text-[#6e6e73]">
          {leader.events.map((ev) => (
            <li key={ev}>{ev}</li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
