import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: Request) {
  try {
    const { personalityData, tripData } = await request.json()

    const prompt = `
    Create a personalized travel itinerary based on the following information:
    
    Traveler Personality: ${personalityData.type} - ${personalityData.description}
    Destination: ${tripData.destination}
    Duration: ${tripData.startDate} to ${tripData.endDate}
    Budget: ${tripData.budget}
    Group Size: ${tripData.groupSize}
    Interests: ${tripData.interests.join(", ")}
    Special Requests: ${tripData.specialRequests}
    
    Please create a detailed day-by-day itinerary that matches their personality type and includes:
    - Specific activities and attractions
    - Restaurant recommendations
    - Transportation suggestions
    - Budget estimates
    - Local tips and insights
    - Photo opportunities
    
    Format the response as a structured JSON object with daily activities, costs, and recommendations.
    `

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      maxTokens: 2000,
    })

    return Response.json({ itinerary: text })
  } catch (error) {
    console.error("Error generating itinerary:", error)
    return Response.json({ error: "Failed to generate itinerary" }, { status: 500 })
  }
}
