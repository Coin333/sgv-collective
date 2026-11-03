import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Event } from "@/lib/data/events";

export function EventCard({ event }: { event: Event }) {
  const isEverythingNight = event.category === "Everything Night";
  const href = isEverythingNight ? "/everything-night" : "/events";
  return (
    <Link href={href} className="group flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] bg-[#f5f5f7]">
        <Image
          src={event.image}
          alt={event.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex items-start justify-between gap-4 pt-5">
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#6e6e73]">
            {event.category}
          </p>
          <h3 className="mt-2 font-display text-2xl font-semibold tracking-[-0.03em] text-[#1d1d1f]">
            {event.title}
          </h3>
          <p className="mt-1 text-sm text-[#6e6e73]">{event.tagline}</p>
          <p className="mt-4 text-sm text-[#1d1d1f]">
            {event.date}
            {event.time ? `, ${event.time}` : ""}
          </p>
          <p className="text-sm text-[#6e6e73]">{event.location}</p>
        </div>
        <ArrowUpRight
          className="mt-1 h-5 w-5 shrink-0 text-[#1d1d1f] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </div>
    </Link>
  );
}
