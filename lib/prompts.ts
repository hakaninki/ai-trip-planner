import type { TripDetails } from "@/types";

export function buildQuestionsPrompt(tripDetails: TripDetails): string {
    return `
You are a professional travel advisor. A user is planning a trip with these details:

- City: ${tripDetails.city}
- Arrival: ${tripDetails.arrivalDatetime}
- Departure: ${tripDetails.departureDatetime}
- Budget (USD): ${tripDetails.budget}
- Interests: ${tripDetails.interests.join(", ")}

Generate between 7 and 10 yes/no questions to better personalize their itinerary.
Questions should uncover preferences like: pace of travel, dietary restrictions,
physical mobility, preference for popular vs hidden-gem spots, group or solo travel,
morning vs evening activity preference, etc.

Respond ONLY with a valid JSON array. No markdown, no explanation, no extra text.
Format:
[
  { "id": "q1", "question": "Do you prefer a relaxed pace with fewer activities per day?" },
  { "id": "q2", "question": "Are you open to trying street food from local vendors?" }
]
`.trim();
}

export function buildPlanPrompt(
    tripDetails: TripDetails,
    answers: { question: string; answer: boolean }[]
): string {
    const answersText = answers
        .map((a) => `- ${a.question}: ${a.answer ? "Yes" : "No"}`)
        .join("\n");

    return `
You are an expert travel planner. Create a detailed, realistic day-by-day trip itinerary.

Trip details:
- City: ${tripDetails.city}
- Arrival: ${tripDetails.arrivalDatetime}
- Departure: ${tripDetails.departureDatetime}
- Budget (USD): ${tripDetails.budget}
- Interests: ${tripDetails.interests.join(", ")}

User preferences (from yes/no questions):
${answersText}

Rules:
- Each day must start no earlier than 08:00 and end no later than 23:00
- Schedule realistic travel time between locations
- Include meal times (breakfast, lunch, dinner) with specific restaurant/cafe names
- Respect the user's budget
- Use only real, well-known, or highly-rated places in ${tripDetails.city}
- First day starts at the arrival time. Last day ends by the departure time.
- All times in 24h "HH:MM" format
- Dates in "YYYY-MM-DD" format

Respond ONLY with valid JSON. No markdown, no explanation, no extra text.
Use exactly this structure:
{
  "trip_summary": "A brief 2–3 sentence overview of the trip",
  "days": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "schedule": [
        {
          "time": "09:00",
          "activity": "Description of activity",
          "location": "Name and address of location"
        }
      ]
    }
  ]
}
`.trim();
}
