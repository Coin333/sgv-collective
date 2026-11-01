export type Club = {
  slug: string;
  school: string;
  shortName?: string;
  city: string;
  description: string;
  logo: string;
  instagrams: { handle: string; label?: string }[];
};

const instagramsBySlug: Record<string, { handle: string; label?: string }[]> = {
  pasadena: [{ handle: "phs.jesusclub" }],
  "san-marino": [{ handle: "smhsactsclub" }],
  arcadia: [
    { handle: "arcadiafca", label: "FCA" },
    { handle: "alliesarcadia", label: "Allies" },
  ],
  "south-pasadena": [{ handle: "sphs.ccf" }],
  "john-muir": [{ handle: "jmhs_mission316" }],
  "crescenta-valley": [{ handle: "cvhsfcf" }],
  "cs-arts": [{ handle: "csartssgv_christianclub" }],
  gabrielino: [{ handle: "gabchristianclub" }],
  "marshall-fundamental": [{ handle: "marshallchristianclub" }],
  monrovia: [{ handle: "monroviachristianclub" }],
  "temple-city": [{ handle: "tchs.christian.club" }],
  glendora: [{ handle: "ghschristianclub" }],
  "san-gabriel": [{ handle: "sghs.christianclub" }],
};

const logoBySlug: Record<string, string> = {
  pasadena: "/images/clubs/pasadena.jpeg",
  "san-marino": "/images/clubs/san-marino.png",
  arcadia: "/images/clubs/arcadia.jpg",
  "south-pasadena": "/images/clubs/south-pasadena.png",
  "john-muir": "/images/clubs/john-muir.jpg",
  "crescenta-valley": "/images/clubs/crescenta-valley.jpg",
  "cs-arts": "/images/clubs/cs-arts.png",
  duarte: "/images/clubs/duarte.png",
  gabrielino: "/images/clubs/gabrielino.webp",
  maranatha: "/images/clubs/maranatha.jpg",
  "mark-keppel": "/images/clubs/mark-keppel.jpg",
  "marshall-fundamental": "/images/clubs/marshall-fundamental.png",
  monrovia: "/images/clubs/monrovia.png",
  "temple-city": "/images/clubs/temple-city.jpeg",
  westridge: "/images/clubs/westridge.png",
  glendale: "/images/clubs/glendale.gif",
  glendora: "/images/clubs/glendora.png",
  "san-gabriel": "/images/clubs/san-gabriel.png",
  "rio-hondo-prep": "/images/clubs/rio-hondo-prep.png",
  "flintridge-prep": "/images/clubs/flintridge-prep.jpeg",
};

const clubsRaw: Omit<Club, "logo" | "instagrams">[] = [
  {
    slug: "pasadena",
    school: "Pasadena High School",
    shortName: "Pasadena HS",
    city: "Pasadena",
    description:
      "Pasadena High's Jesus Club. Host campus for Everything Night 2026.",
  },
  {
    slug: "san-marino",
    school: "San Marino High School",
    shortName: "San Marino HS",
    city: "San Marino",
    description: "Weekly fellowship rooted in scripture and friendship.",
  },
  {
    slug: "arcadia",
    school: "Arcadia High School",
    shortName: "Arcadia HS",
    city: "Arcadia",
    description: "Two clubs, one campus: FCA and Allies.",
  },
  {
    slug: "south-pasadena",
    school: "South Pasadena High School",
    shortName: "South Pas HS",
    city: "South Pasadena",
    description:
      "Tight-knit community focused on real conversations about faith.",
  },
  {
    slug: "john-muir",
    school: "John Muir High School",
    shortName: "John Muir HS",
    city: "Pasadena",
    description: "Bringing students together for worship and bible study.",
  },
  {
    slug: "crescenta-valley",
    school: "Crescenta Valley High School",
    shortName: "CV HS",
    city: "La Crescenta",
    description: "A welcoming space for anyone curious about Jesus.",
  },
  {
    slug: "cs-arts",
    school: "CS Arts (California School of the Arts)",
    shortName: "CS Arts",
    city: "Duarte",
    description: "Faith and creativity, side by side.",
  },
  {
    slug: "duarte",
    school: "Duarte High School",
    shortName: "Duarte HS",
    city: "Duarte",
    description: "Small club, big heart for the campus.",
  },
  {
    slug: "gabrielino",
    school: "Gabrielino High School",
    shortName: "Gabrielino HS",
    city: "San Gabriel",
    description: "Praying for the school and showing up for each other.",
  },
  {
    slug: "maranatha",
    school: "Maranatha High School",
    shortName: "Maranatha HS",
    city: "Pasadena",
    description:
      "Christian school community plugged into the wider collective.",
  },
  {
    slug: "mark-keppel",
    school: "Mark Keppel High School",
    shortName: "Mark Keppel HS",
    city: "Alhambra",
    description: "Lunchtime gatherings, real talk, real friendships.",
  },
  {
    slug: "marshall-fundamental",
    school: "Marshall Fundamental",
    shortName: "Marshall",
    city: "Pasadena",
    description: "Open doors, open bibles, anyone welcome.",
  },
  {
    slug: "monrovia",
    school: "Monrovia High School",
    shortName: "Monrovia HS",
    city: "Monrovia",
    description: "Faith in action across the Monrovia campus.",
  },
  {
    slug: "temple-city",
    school: "Temple City High School",
    shortName: "Temple City HS",
    city: "Temple City",
    description: "Students seeking Jesus together every week.",
  },
  {
    slug: "westridge",
    school: "Westridge School",
    shortName: "Westridge",
    city: "Pasadena",
    description: "All-girls campus club rooted in scripture.",
  },
  {
    slug: "glendale",
    school: "Glendale High School",
    shortName: "Glendale HS",
    city: "Glendale",
    description: "New chapter joining the SGV collective.",
  },
  {
    slug: "glendora",
    school: "Glendora High School",
    shortName: "Glendora HS",
    city: "Glendora",
    description: "Worship and fellowship on the east side of the valley.",
  },
  {
    slug: "san-gabriel",
    school: "San Gabriel High School",
    shortName: "San Gabriel HS",
    city: "San Gabriel",
    description: "Community and prayer at the heart of the SGV.",
  },
  {
    slug: "rio-hondo-prep",
    school: "Rio Hondo Prep",
    shortName: "Rio Hondo Prep",
    city: "Arcadia",
    description: "A small school with a strong faith community.",
  },
  {
    slug: "flintridge-prep",
    school: "Flintridge Prep",
    shortName: "Flintridge Prep",
    city: "La Cañada Flintridge",
    description:
      "Students from across the area meeting weekly to grow in faith.",
  },
];

export const clubs: Club[] = clubsRaw.map((c) => ({
  ...c,
  logo: logoBySlug[c.slug] ?? "/images/sgv-logo.png",
  instagrams: instagramsBySlug[c.slug] ?? [],
}));
