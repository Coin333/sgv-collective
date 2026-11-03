// Playbooks are what one club learned, written down so the next club starts
// from year three instead of year zero. Add one when a club figures something
// out worth passing on. Keep steps short enough to read on a phone.

export type Playbook = {
  slug: string;
  title: string;
  summary: string;
  time: string;
  before: string[];
  steps: { title: string; body: string }[];
  next?: { slug: string; label: string };
};

export const playbooks: Playbook[] = [
  {
    slug: "start-a-club",
    title: "Start a club at your school",
    summary:
      "From two friends and an idea to a chartered club with a room and a weekly time.",
    time: "Two to four weeks",
    before: [
      "Two friends who will show up every week",
      "A teacher who likes you",
      "Your school's club charter form, usually from the activities office or ASB",
    ],
    steps: [
      {
        title: "Find two friends.",
        body: "A club is students who decided to meet. It has to start with you, not with an adult, and not with us. Two friends who will come every week is enough.",
      },
      {
        title: "Ask your school for the rules.",
        body: "Go to the activities office or ASB and ask for the club charter form. Most schools want a name, a purpose, a list of founding members, and a faculty advisor. The advisor is there for supervision; the students lead.",
      },
      {
        title: "Know what the law says.",
        body: "If your public school lets any non-academic club meet on campus, it has to let yours meet on the same terms. That is the Equal Access Act. The same law says meetings are student-led and that people from outside the school cannot run them or regularly attend. Keep it that way; it is what protects you.",
      },
      {
        title: "Pick a time and a room.",
        body: "Lunch on the same day every week, in the same room, beats a better slot that moves around. Ask the advisor if their classroom is free.",
      },
      {
        title: "Tell us.",
        body: "Send a note through the contact form. We will put your club on the map, introduce you to the nearest club, and point you to a partner church near your school.",
      },
      {
        title: "Run the first meeting.",
        body: "Bring food. Learn every name. Ask one question everyone can answer. Read one short passage. End on time. Then do the exact same thing next week.",
      },
    ],
    next: { slug: "run-a-meeting", label: "Run a meeting" },
  },
  {
    slug: "run-a-meeting",
    title: "Run a meeting",
    summary:
      "A 45-minute rhythm that works at lunch, holds up when the room is full, and survives the week you forgot to prepare.",
    time: "45 minutes, every week",
    before: [
      "Food, even if it is a bag of chips",
      "One passage and three questions, written down",
      "Someone assigned to pray at the end",
    ],
    steps: [
      {
        title: "Minutes 0 to 10: food and names.",
        body: "People arrive late. Use the first ten minutes for food and for making sure every new person has been greeted by name.",
      },
      {
        title: "Minutes 10 to 15: one question.",
        body: "One question everyone in the room can answer in a sentence. Not a Bible question. Best thing that happened this week, worst class, anything.",
      },
      {
        title: "Minutes 15 to 35: the passage.",
        body: "Read one short passage out loud. Ask three questions in order: what does it say, what does it mean, what do we do about it. Let silence sit. Do not answer your own questions.",
      },
      {
        title: "Minutes 35 to 42: pray in twos.",
        body: "Pairs, not the whole circle. It is faster, quieter, and the shy ones actually pray.",
      },
      {
        title: "Minutes 42 to 45: next week and one invite.",
        body: "Say when and where next week is, then ask everyone to bring one person. End on time so people come back.",
      },
      {
        title: "Rotate who leads.",
        body: "Every month, hand the passage to someone else. The club that only works when one person is there dies when that person graduates.",
      },
    ],
    next: { slug: "host-a-worship-night", label: "Host a worship night" },
  },
  {
    slug: "host-a-worship-night",
    title: "Host a worship night",
    summary:
      "An evening gathering at a partner church, built back from the date so nothing is left for the last week.",
    time: "Eight weeks",
    before: [
      "A date that does not collide with finals, prom, or another club's night",
      "A partner church willing to open a room",
      "A student band, or a youth group that has one",
    ],
    steps: [
      {
        title: "Eight weeks out: the room.",
        body: "Ask a partner church for their space and their sound system. Every church on the churches page has said yes before. Agree on a time and who locks up.",
      },
      {
        title: "Six weeks out: the people.",
        body: "Confirm the band, the speaker, and who is bringing food. A student or a youth pastor can speak; keep it under fifteen minutes. If the collective is co-hosting, tell us now.",
      },
      {
        title: "Four weeks out: the word gets out.",
        body: "One flyer, one Instagram post, and a message to every club president in the valley. Send the details to the collective so it goes on the gatherings page.",
      },
      {
        title: "Two weeks out: the run of show.",
        body: "Write the night down minute by minute: doors, worship, talk, response, food. Book a sound check with the church for the week of.",
      },
      {
        title: "The week of: confirm everything.",
        body: "Text the band, the speaker, the church contact, and the food. Print club cutouts for the response moment.",
      },
      {
        title: "The night: one clear next step.",
        body: "Open doors thirty minutes early with name tags. Give people exactly one thing to do at the end: talk to someone, take a cutout, come to a club. Count the room honestly; write the number down.",
      },
      {
        title: "After: close the loop.",
        body: "Thank the church that week. Post photos. Send the collective the honest count and one sentence about what happened so it goes in the yearbook.",
      },
    ],
    next: { slug: "print-the-cutouts", label: "Print the cutouts" },
  },
  {
    slug: "print-the-cutouts",
    title: "Print the cutouts",
    summary:
      "Pocket cards that point a new believer to a next step. Free, and the whole thing takes an afternoon.",
    time: "One afternoon",
    before: [
      "A printer",
      "Scissors or a paper cutter",
      "Card stock if you have it",
    ],
    steps: [
      {
        title: "Open the cutouts page.",
        body: "Pick the version that matches your club's style. Each sheet prints several cards.",
      },
      {
        title: "Print on the heaviest paper you have.",
        body: "Card stock survives a backpack. Plain paper is fine if that is what you have.",
      },
      {
        title: "Cut and keep them on you.",
        body: "A stack in your bag means you never miss the moment someone asks what comes next.",
      },
      {
        title: "Hand them out at the end, not the start.",
        body: "After the passage, after the prayer, after the worship night. A card means more when it answers a question someone just asked.",
      },
    ],
    next: { slug: "hand-it-off", label: "Hand it off" },
  },
  {
    slug: "hand-it-off",
    title: "Hand it off in June",
    summary:
      "How a club outlives its founders. Start in April, finish before the last day of school.",
    time: "April to June",
    before: [
      "Two people a year younger than you who already show up",
      "The Instagram login and the advisor's email",
      "Your honest count of what happened this year",
    ],
    steps: [
      {
        title: "April: pick the next leads.",
        body: "Two people, not one. Younger than you. Ask them in person and give them a week to say yes.",
      },
      {
        title: "May: lead together.",
        body: "They run the passage; you sit in the circle. Introduce them to the advisor and to the activities office. Hand over the Instagram login and the charter paperwork.",
      },
      {
        title: "June: write the year down.",
        body: "Send the collective your leads, your gatherings, and one honest number. It goes on the yearbook so the next team knows what happened before them.",
      },
      {
        title: "Tell us who is next.",
        body: "Send the new leads' names through the contact form so we can introduce them to the valley before summer.",
      },
      {
        title: "Then let go.",
        body: "The club is theirs now. Come back as a guest once, in the fall, and sit in the back.",
      },
    ],
  },
];

export function getPlaybook(slug: string) {
  return playbooks.find((p) => p.slug === slug);
}
