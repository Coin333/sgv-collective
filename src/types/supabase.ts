export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type RsvpRow = {
  id: string;
  name: string;
  email: string;
  school: string | null;
  event_slug: string;
  guests: number;
  notes: string | null;
  created_at: string;
};

type RsvpInsert = {
  id?: string;
  name: string;
  email: string;
  school?: string | null;
  event_slug: string;
  guests?: number;
  notes?: string | null;
  created_at?: string;
};

type ContactRow = {
  id: string;
  name: string;
  email: string;
  school: string | null;
  interest: string;
  message: string;
  created_at: string;
};

type ContactInsert = {
  id?: string;
  name: string;
  email: string;
  school?: string | null;
  interest: string;
  message: string;
  created_at?: string;
};

type EventRow = {
  id: string;
  slug: string;
  title: string;
  tagline: string | null;
  description: string | null;
  starts_at: string | null;
  location: string | null;
  rsvp_url: string | null;
  image_url: string | null;
  featured: boolean;
  category: string | null;
  date_label: string | null;
  time_label: string | null;
  is_upcoming: boolean;
  sort_order: number;
  created_at: string;
};

type EventInsert = {
  id?: string;
  slug: string;
  title: string;
  tagline?: string | null;
  description?: string | null;
  starts_at?: string | null;
  location?: string | null;
  rsvp_url?: string | null;
  image_url?: string | null;
  featured?: boolean;
  category?: string | null;
  date_label?: string | null;
  time_label?: string | null;
  is_upcoming?: boolean;
  sort_order?: number;
  created_at?: string;
};

type ClubRow = {
  id: string;
  slug: string;
  school: string;
  short_name: string | null;
  city: string | null;
  description: string | null;
  leader_contact: string | null;
  logo_url: string | null;
  instagrams: Json;
  sort_order: number;
  created_at: string;
};

type ClubInsert = {
  id?: string;
  slug: string;
  school: string;
  short_name?: string | null;
  city?: string | null;
  description?: string | null;
  leader_contact?: string | null;
  logo_url?: string | null;
  instagrams?: Json;
  sort_order?: number;
  created_at?: string;
};

type LeaderRow = {
  id: string;
  name: string;
  role: string;
  era: string;
  blurb: string;
  events: string[];
  sort_order: number;
  created_at: string;
};

type LeaderInsert = {
  id?: string;
  name: string;
  role: string;
  era?: string;
  blurb?: string;
  events?: string[];
  sort_order?: number;
  created_at?: string;
};

type AnnouncementRow = {
  id: string;
  title: string;
  body: string;
  created_at: string;
};

type AnnouncementInsert = {
  id?: string;
  title: string;
  body: string;
  created_at?: string;
};

export type Database = {
  public: {
    Tables: {
      rsvps: {
        Row: RsvpRow;
        Insert: RsvpInsert;
        Update: Partial<RsvpInsert>;
        Relationships: [];
      };
      contact_messages: {
        Row: ContactRow;
        Insert: ContactInsert;
        Update: Partial<ContactInsert>;
        Relationships: [];
      };
      events: {
        Row: EventRow;
        Insert: EventInsert;
        Update: Partial<EventInsert>;
        Relationships: [];
      };
      clubs: {
        Row: ClubRow;
        Insert: ClubInsert;
        Update: Partial<ClubInsert>;
        Relationships: [];
      };
      leaders: {
        Row: LeaderRow;
        Insert: LeaderInsert;
        Update: Partial<LeaderInsert>;
        Relationships: [];
      };
      announcements: {
        Row: AnnouncementRow;
        Insert: AnnouncementInsert;
        Update: Partial<AnnouncementInsert>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
