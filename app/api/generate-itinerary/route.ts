import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"
import { Client } from "@googlemaps/google-maps-services-js"

const gmaps = new Client({})

const JourneyBlueprintSchema = z.object({
  journey_blueprint: z.object({
    title: z.string(),
    day_by_day_itinerary: z.array(
      z.object({
        day: z.number(),
        theme: z.string(),
        locations: z.array(
          z.object({
            name: z.string(),
            category: z.string(),
            vibe: z.string(),
            coordinates: z.object({
              lat: z.number(),
              lng: z.number(),
            }),
            transport: z.string(),
            cost_estimate: z.string(),
          })
        ),
      })
    ),
  }),
})

export async function POST(request: Request) {
  try {
    const { soulProfile } = await request.json()

    // Step 1: Fetch real-world places from Google Places API
    const interests = soulProfile.destinations.join(" OR ")
    const { data } = await gmaps.textSearch({
      params: {
        query: `${interests} in ${soulProfile.practical.destination}`,
        key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        maxprice: 4,
      },
    })

    const places = data.results.map((place) => ({
      name: place.name,
      rating: place.rating,
      address: place.formatted_address,
      types: place.types,
      lat: place.geometry?.location.lat,
      lng: place.geometry?.location.lng,
    }))

    // Step 2: Use AI to curate the fetched places into an itinerary
    const prompt = `
      You are a creative travel agent. Based on the user's soul profile and a list of real-world locations, create a personalized travel itinerary.
      
      User Profile:
      - Archetype: "${soulProfile.archetype.label}" (${soulProfile.archetype.description})
      - Mood: "${soulProfile.mood.label}"
      - Travel Philosophy: "${soulProfile.philosophy}"
      - Intention: "${soulProfile.intention}"
      - Destination: ${soulProfile.practical.destination}
      - Duration: ${soulProfile.practical.startDate} to ${soulProfile.practical.endDate}
      - Budget: $${soulProfile.practical.budget}
      - Interests: ${soulProfile.destinations.join(", ")}

      Available Locations (from Google Places):
      ${JSON.stringify(places, null, 2)}

      Your Task:
      Generate a complete "journey_blueprint" JSON object.
      - Select the most fitting locations from the list provided.
      - The title should be creative and reflect the user's archetype and destination.
      - Create a day-by-day itinerary for the entire trip duration.
      - Each day must have a theme that resonates with the user's profile.
      - For each day, select 2-3 locations.
      - For each location, you must provide: name, category (with emoji), vibe, real-world coordinates, suggested transport, and a cost estimate.
      - Ensure the itinerary is logical, geographically feasible, and aligns with the user's budget and philosophy.
      - Do not invent places. Use only the locations provided in the list.
    `

    const { object } = await generateObject({
      model: openai("gpt-4o"),
      schema: JourneyBlueprintSchema,
      prompt,
    })

    return Response.json(object)
  } catch (error) {
    console.error("Error generating itinerary:", error)
    if (error instanceof Error && error.message.includes("API key")) {
      return Response.json({ error: "Invalid or missing Google Maps API key." }, { status: 500 })
    }
    return Response.json({ error: "Failed to generate itinerary" }, { status: 500 })
  }
}
