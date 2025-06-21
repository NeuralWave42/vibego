import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

// Define the schema for the itinerary object
const itinerarySchema = z.object({
  itinerary: z.object({
    title: z.string().describe("A mystical and inspiring title for the journey."),
    destination: z.string(),
    duration: z.number().describe("Total number of days for the trip."),
    totalBudget: z.number().describe("An estimated total budget for the entire trip."),
    days: z.array(
      z.object({
        day: z.number(),
        date: z.string().describe("The date for this day's activities, e.g., 'July 29, 2024'."),
        theme: z.string().describe("A creative theme for the day, like 'Day of Wonder'."),
        activities: z.array(
          z.object({
            name: z.string().describe("Name of the activity."),
            type: z.string().describe("Category of the activity (e.g., spiritual, cultural, adventure)."),
            cost: z.number().describe("Estimated cost for this activity."),
            duration: z.string().describe("Estimated time to complete the activity (e.g., '2 hours')."),
            icon: z.string().describe("A single emoji that represents the activity. E.g., '🧘' or '🍵'."),
          })
        ),
        restaurants: z.array(
          z.object({
            name: z.string().describe("Name of the restaurant."),
            type: z.string().describe("Type of cuisine."),
            rating: z.number().describe("A rating out of 5, e.g., 4.7."),
            cost: z.number().describe("Estimated cost for a meal."),
            icon: z.string().describe("A single emoji that represents the restaurant. E.g., '🍜' or '🌱'."),
          })
        ),
        mysticalNote: z.string().describe("A short, inspiring or mystical tip for the day."),
      })
    ),
    mapLocations: z.array(
        z.object({
            id: z.number(),
            name: z.string().describe("Name of the location pin on the map."),
            lat: z.number().describe("Latitude coordinate."),
            lng: z.number().describe("Longitude coordinate."),
            type: z.string().describe("Category of the location."),
            day: z.number().describe("Which day of the itinerary this location corresponds to."),
        })
    ).describe("An array of locations to be plotted on a map.")
  }),
})

export async function POST(request: Request) {
  try {
    const { answers } = await request.json()
    console.log("Received answers for itinerary generation:", JSON.stringify(answers, null, 2));

    if (!answers || !answers.practical || !answers.archetype) {
        console.error("Incomplete answers received:", answers);
        return Response.json({ error: "The oracle received an incomplete vision. Critical data was missing. Please try again." }, { status: 400 });
    }

    const prompt = `
    You are a mystical travel oracle. Create a personalized and soulful travel itinerary based on the following sacred reading:

    **Traveler's Soul Profile:**
    - Soul Archetype: ${answers.archetype}
    - Current Energy: ${answers.mood}
    - Journey Philosophy: ${answers.philosophy}
    - Sacred Intention: ${answers.intention}
    - Realms that Call to Them: ${answers.destinations.join(", ")}

    **Practical Journey Details:**
    - Destination: ${answers.practical.destination}
    - Duration: From ${answers.practical.startDate} to ${answers.practical.endDate}
    - Budget: Around $${answers.practical.budget}
    - Companions: ${answers.practical.companions}
    - Special Requests: ${answers.practical.specialRequests || "None"}

    Based on this complete profile, weave a detailed day-by-day itinerary. The itinerary should be magical and inspiring, matching their personality and practical needs.
    Generate map coordinates that are realistic for the specified destination.
    `
    
    const { object } = await generateObject({
      model: openai("gpt-4o"),
      schema: itinerarySchema,
      prompt,
    });

    return Response.json(object)

  } catch (error) {
    console.error("Error in generate-itinerary endpoint:", error)
    
    let errorMessage = "A cosmic disturbance interrupted the connection."
    if (error instanceof Error) {
        if (error.message.includes('authentication')) {
            errorMessage = "Mystical connection failed. Please verify your OpenAI API key."
        } else if (error.message.includes('quota')) {
            errorMessage = "You have exceeded your OpenAI quota. Please check your plan and billing details."
        } else {
            errorMessage = error.message;
        }
    }
    
    return Response.json({ error: errorMessage }, { status: 500 })
  }
}
