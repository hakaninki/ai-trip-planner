export type Interest =
  | "museums"
  | "traditional_food"
  | "nightlife"
  | "nature"
  | "shopping"
  | "art_galleries"
  | "historical_sites"
  | "local_markets";

export interface TripDetails {
  city: string;
  arrivalDatetime: string; // ISO 8601
  departureDatetime: string; // ISO 8601
  budget: number; // in USD
  interests: Interest[];
}

export interface YesNoQuestion {
  id: string;
  question: string;
  answer: boolean | null; // null = unanswered
}

// --- AI OUTPUT FORMAT ---

export interface ScheduleItem {
  time: string; // "HH:MM" 24h format
  activity: string;
  location: string;
}

export interface TripDay {
  day: number;
  date: string; // "YYYY-MM-DD"
  schedule: ScheduleItem[];
}

export interface TripPlan {
  trip_summary: string;
  days: TripDay[];
}

// --- Supabase DB Row ---

export interface SavedPlan {
  id: string;
  user_id: string;
  city: string;
  arrival_datetime: string;
  departure_datetime: string;
  budget: number;
  interests: Interest[];
  questions: { question: string; answer: boolean }[];
  plan: TripPlan;
  created_at: string;
}

export const INTEREST_OPTIONS: { value: Interest; label: string }[] = [
  { value: "museums", label: "🏛️ Museums" },
  { value: "traditional_food", label: "🍜 Traditional Food" },
  { value: "nightlife", label: "🌙 Nightlife" },
  { value: "nature", label: "🌿 Nature & Parks" },
  { value: "shopping", label: "🛍️ Shopping" },
  { value: "art_galleries", label: "🎨 Art Galleries" },
  { value: "historical_sites", label: "🏰 Historical Sites" },
  { value: "local_markets", label: "🧺 Local Markets" },
];
