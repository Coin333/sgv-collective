# sgvc.cc: the generational build

Written 2026-11-02. A site that outlasts the students who built it. Leaders graduate every June; the site should not reset with them.

## What "generational" means here

1. **It remembers.** Every year, every gathering, every leader, kept in one timeline. The movement started 2024-11-12 (Caleb's first brainstorm). Year three starts now. The site should make year ten legible.
2. **It hands itself off.** A new lead can update events, clubs, leaders, and churches without touching code. Credentials, domain, hosting, and the "how this works" live in one handoff doc, not in one person's head.
3. **It resources clubs.** The mission is "we serve the clubs." That means a playbook library: how to start a club, run a meeting, host a worship night, print the cutouts. Every new club president starts from year three, not year zero.
4. **It stays honest.** Numbers on the site match the evidence (140+ at Night 1, 100+ at Night 2, 10 salvations at Night 1). No 200+ until a count exists.
5. **It looks like it will last.** Apple-grade restraint: one typeface family, black and white and one blue, large type, real photos, no decoration that dates. Motion is quiet and short.

## Design direction

- Reference points: apple.com product pages (type scale, calm sections), awwwards editorial sites (asymmetric grids, one hero idea, big numerals as structure).
- Type: Inter Tight display, Inter body. Already in place. Tighten the scale: one h1 size, one h2 size, one body size, one caption size.
- Color: ink `#1d1d1f`, muted `#6e6e73`, surfaces white and `#f5f5f7`, navy `#0d1f3d` for one dark band per page, baby blue `#8ec5fb` as the single accent.
- Each section has its own form. No repeated three-card grids. The yearbook timeline is a horizontal strip; the clubs are a typographic index; the gatherings are a photo ledger.
- Motion: entrance fade, soft scroll reveal, nothing that loops. Hero stays the valley-to-cross scene but gets a quieter close.

## Build order

1. **Design system pass**: tokens, type scale, nav, footer, buttons. Footer gets the handoff line ("Started 2024. Led by students since.").
2. **Homepage**: hero, the three convictions (typographic, not cards), This Year, Yearbook strip, Clubs index, Gatherings ledger, For Clubs, closing invite.
3. **/legacy**: the full timeline, year by year, with leaders and gatherings per year. The generational core.
4. **/handoff** (private, linked from admin): who holds the domain, Cloudflare, Vercel, Supabase, GitHub, Instagram, Gmail. Renewal dates. How to add a year.
5. **Playbook library** under /next-steps: start a club, run a meeting, host a worship night.
6. **Admin**: editable events, clubs, leaders (Supabase tables already exist for events; extend).

## Infrastructure to move off one person

- GitHub: `Coin333/sgv-collective` is a personal fork. Move to an org (`sgv-collective`) with two owners.
- Domain: GoDaddy, registered 2026-05-03, expires 2027-05-03. Confirm whose account, turn on auto-renew, add a second contact.
- DNS: Cloudflare (addyson/harvey). Hosting: Vercel (live headers say Vercel, README says Railway: fix the README).
- Supabase project, Instagram, sgvchristianclubs@gmail.com: shared vault, two people with access.
- `metadataBase` still points at sgvchristianclubs.org. Move to sgvc.cc.

## Not now

- Donations. No entity, no EIN. Receiving money starts the CA Attorney General clock. Revisit after fiscal sponsorship.
- Any government-grant language. Everything Night is not fundable with public money.
