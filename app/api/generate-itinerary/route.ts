import { type CoreMessage, streamText, generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

export const maxDuration = 30

// Define the schema for the generated itinerary to match itinerary-display.tsx
const ItinerarySchema = z.object({
  destination: z.string().describe("The primary destination city and country. e.g., 'Paris, France'."),
  tripTitle: z.string().describe("A creative and exciting title for the trip, like 'Parisian Dreams' or 'Alpine Adventures'."),
  dailyItinerary: z.array(z.object({
    day: z.number().describe("The day number, e.g., 1, 2, 3."),
    theme: z.string().describe("A theme for the day, like 'Cultural Immersion' or 'Relaxation & Rejuvenation'."),
    activities: z.array(z.object({
      name: z.string().describe("The descriptive name of the activity, e.g., 'Morning Visit to the Louvre Museum'."),
      description: z.string().describe("A brief, engaging description of the activity."),
      emoji: z.string().describe("An emoji that represents the activity."),
      address: z.string().describe("The full, verifiable street address of the location. This is critical for mapping and must be accurate."),
    })),
    restaurants: z.array(z.object({
      name: z.string().describe("The name of the restaurant."),
      description: z.string().describe("A brief, engaging description of the restaurant's atmosphere and cuisine."),
      emoji: z.string().describe("An emoji that represents the restaurant."),
      address: z.string().describe("The full, verifiable street address of the restaurant. This is critical for mapping and must be accurate."),
    }))
  })).describe("An array of daily plans."),
  soulQuote: z.string().optional().describe("An inspirational quote that matches the trip's vibe.")
})

export async function POST(req: Request) {
  try {
    const { soulProfile } = await req.json()

    if (!soulProfile) {
      return new Response(JSON.stringify({ error: "Soul profile is required." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Construct the prompt
    const prompt = `
      You are a world-class, creative, and thoughtful travel agent AI.
      Your mission is to generate a structured JSON itinerary based on a user's "soul profile".
      This itinerary must be not only practical but also deeply resonant with the user's stated personality, mood, and intentions.

      **CRITICAL INSTRUCTIONS:**
      1.  For every single 'activity' and 'restaurant', you MUST provide a real, verifiable street address. The user will use this address to find the location on a map.
      2.  The name and address should correspond to a real-world location. Do not invent places.
      3.  The ENTIRE itinerary MUST take place within the user's specified 'destination'. Do not suggest locations in other cities.
      4.  Your entire response must be a raw JSON object that strictly follows the schema. Do not include any text before or after the JSON object.

      Here is the user's soul profile, which includes the destination:
      \`\`\`json
      ${JSON.stringify(soulProfile, null, 2)}
    `
    
    // Generate the structured object
    const { object: itinerary } = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: ItinerarySchema,
      prompt,
    })

    return new Response(JSON.stringify(itinerary), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error generating itinerary:", error)
    return new Response(JSON.stringify({ error: "Failed to generate itinerary." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
