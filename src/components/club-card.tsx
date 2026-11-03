import Image from "next/image";
import { InstagramIcon } from "@/components/icons/instagram";
import type { Club } from "@/lib/data/clubs";

export function ClubCard({ club }: { club: Club }) {
  return (
    <article
      id={club.slug}
      className="flex h-full flex-col rounded-[20px] bg-[#f5f5f7] p-6 scroll-mt-24"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-base font-medium text-[#1d1d1f]">
            {club.school}
          </h3>
          <p className="mt-0.5 text-sm text-[#6e6e73]">{club.city}</p>
        </div>
        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-white ring-1 ring-[#1d1d1f]/5">
          <Image
            src={club.logo}
            alt=""
            fill
            sizes="44px"
            className="object-contain p-1.5"
            unoptimized={club.logo.endsWith(".gif")}
          />
        </div>
      </div>
      <p className="mt-4 flex-1 text-sm leading-relaxed text-[#6e6e73]">
        {club.description}
      </p>
      {club.instagrams.length > 0 && (
        <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-1">
          {club.instagrams.map((ig) => (
            <li key={ig.handle}>
              <a
                href={`https://www.instagram.com/${ig.handle}/`}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open ${club.shortName ?? club.school} Instagram${
                  ig.label ? ` (${ig.label})` : ""
                }`}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1d1d1f] hover:text-[#6e6e73]"
              >
                <InstagramIcon className="h-3.5 w-3.5" />
                <span>{ig.label ?? `@${ig.handle}`}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
