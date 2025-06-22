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
      searchableName: z.string().describe("A Google Maps-friendly searchable name for the activity, e.g., 'Musée du Louvre, Paris, France'."),
      description: z.string().describe("A brief, engaging description of the activity."),
      emoji: z.string().describe("An emoji that represents the activity.")
    })),
    restaurants: z.array(z.object({
      name: z.string().describe("The name of the restaurant."),
      searchableName: z.string().describe("A Google Maps-friendly searchable name for the restaurant, e.g., 'Le Procope, Paris, France'."),
      description: z.string().describe("A brief, engaging description of the restaurant's atmosphere and cuisine."),
      emoji: z.string().describe("An emoji that represents the restaurant.")
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
      You are a mystical Journey Oracle. Based on the following soul profile, craft a personalized, magical, and practical travel itinerary.

      **Soul Profile:**
      - **Archetype:** ${soulProfile.archetype.label} (${soulProfile.archetype.description})
      - **Current Mood:** ${soulProfile.mood.label} (${soulProfile.mood.description})
      - **Journey Philosophy:** ${soulProfile.philosophy}
      - **Intention:** ${soulProfile.intention}
      - **Desired Destinations/Vibes:** ${soulProfile.destinations.join(", ")}

      **Practical Details:**
      - **Destination:** ${soulProfile.practical.destination}
      - **Travel Dates:** From ${soulProfile.practical.startDate} to ${soulProfile.practical.endDate}
      - **Budget:** ${soulProfile.practical.budget}
      - **Companions:** ${soulProfile.practical.companions}
      - **Additional Prompt:** ${soulProfile.practical.additionalPrompt || "None"}

      **Your Mission:**
      Generate a structured JSON itinerary that brings this journey to life. The tone should be inspiring and aligned with the user's soul profile. Be creative and thoughtful. Ensure the dates in the daily itinerary correctly correspond to the travel dates provided.

      For each activity and restaurant, you MUST provide two names:
      1. A descriptive, human-readable 'name' (e.g., 'Explore the historic Montmartre district').
      2. A 'searchableName' that is optimized for a Google Maps search (e.g., 'Montmartre, Paris, France').
      
      Generate nothing but the raw JSON object. Do not include any introductory text, closing text, or markdown formatting.
      Your entire response must be the JSON object that strictly follows the schema.

      Here is the user's soul profile:
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
