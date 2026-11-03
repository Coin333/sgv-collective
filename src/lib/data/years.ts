// One entry per school year. This is the site's memory: add a year here when
// a new team takes over, and the homepage strip and /legacy both pick it up.
// Numbers follow the documented figures only (see docs/PLAN.md).

export type Gathering = {
  name: string;
  date: string;
  venue: string;
  note?: string;
};

export type Year = {
  slug: string;
  label: string;
  theme: string;
  leads: string[];
  leadTitle: string;
  gatherings: Gathering[];
  summary: string;
  open?: boolean;
};

export const years: Year[] = [
  {
    slug: "2024-25",
    label: "2024–25",
    theme: "Chosen",
    leadTitle: "Founders",
    leads: ["Caleb Newton", "Rianna"],
    summary:
      "Started as a brainstorm on November 12, 2024: what if the Christian clubs across the valley actually knew each other? Six months later, 140 students from a dozen schools showed up to the first Everything Night.",
    gatherings: [
      {
        name: "Chosen Worship Night",
        date: "April 12, 2025",
        venue: "Arcadia Chinese Baptist Church",
      },
      {
        name: "Everything Night",
        date: "May 23, 2025",
        venue: "San Marino High School",
        note: "140+ students. 10 decided to follow Jesus.",
      },
    ],
  },
  {
    slug: "2025-26",
    label: "2025–26",
    theme: "Homeward",
    leadTitle: "Presidents",
    leads: ["Colin", "Tyler", "Elyse"],
    summary:
      "The founders graduated and the network kept going. An inner circle of eight students planned three nights across three churches and a second Everything Night on Pentecost Sunday.",
    gatherings: [
      {
        name: "Salt & Light Worship Night",
        date: "December 19, 2025",
        venue: "Epicenter Church, Pasadena",
      },
      {
        name: "Homeward Worship Night",
        date: "March 20, 2026",
        venue: "CA Church LA",
      },
      {
        name: "Everything Night",
        date: "May 24, 2026",
        venue: "Pasadena High School",
        note: "100+ students.",
      },
    ],
  },
  {
    slug: "2026-27",
    label: "2026–27",
    theme: "Joyful community",
    leadTitle: "Leads",
    leads: ["Elyse", "Colin"],
    summary:
      "Year three. The question this year is simple: how do Christians across the valley actually get to know each other, so no one feels alone at their school?",
    gatherings: [
      {
        name: "Commissioning Night",
        date: "August 28, 2026",
        venue: "Frontier Church",
        note: "With five youth groups. 200+ students.",
      },
      {
        name: "Leadership Interest Meeting",
        date: "September 13, 2026",
        venue: "Seeds of Life, Alhambra",
      },
    ],
  },
  {
    slug: "2027-28",
    label: "2027–28",
    theme: "Yours",
    leadTitle: "Leads",
    leads: [],
    summary:
      "This line is blank on purpose. Every year a new group of students picks this up. If you are reading this in high school, it might be you.",
    gatherings: [],
    open: true,
  },
];

export const founded = "November 12, 2024";
