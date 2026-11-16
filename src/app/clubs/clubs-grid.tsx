"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { ClubCard } from "@/components/club-card";
import type { Club } from "@/lib/data/clubs";

export function ClubsGrid({ clubs }: { clubs: Club[] }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return clubs;
    return clubs.filter(
      (c) =>
        c.school.toLowerCase().includes(term) ||
        c.shortName?.toLowerCase().includes(term) ||
        c.city.toLowerCase().includes(term),
    );
  }, [clubs, q]);

  return (
    <div>
      <div className="mb-8 max-w-md">
        <label htmlFor="club-search" className="sr-only">
          Search clubs
        </label>
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6e6e73]"
            aria-hidden="true"
          />
          <input
            id="club-search"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by school or city"
            className="w-full rounded-full border border-[#1d1d1f]/15 bg-white py-3 pl-11 pr-4 text-sm text-[#1d1d1f] placeholder-[#6e6e73] transition focus:border-[#1d1d1f] focus:outline-none"
          />
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((c) => (
            <ClubCard key={c.slug} club={c} />
          ))}
        </div>
      ) : (
        <div className="rounded-[20px] border border-dashed border-[#1d1d1f]/25 p-12 text-center">
          <p className="font-medium text-[#1d1d1f]">No matches.</p>
          <p className="mt-1 text-sm text-[#6e6e73]">
            Try a different school or city, or just browse all 20.
          </p>
        </div>
      )}
    </div>
  );
}
