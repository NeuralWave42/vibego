"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Clock,
  Star,
  Utensils,
  Coffee,
  Sparkles,
  Download,
  Share2,
  Heart,
  Navigation,
  Calendar,
  DollarSign,
  Users,
} from "lucide-react"

interface ItineraryDisplayProps {
  tripData: any
  personalityData: any
}

export default function ItineraryDisplay({ tripData, personalityData }: ItineraryDisplayProps) {
  const [itinerary, setItinerary] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate AI itinerary generation
    const generateItinerary = async () => {
      setLoading(true)

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Generate mock itinerary based on personality and trip data
      const mockItinerary = generateMockItinerary(tripData, personalityData)
      setItinerary(mockItinerary)
      setLoading(false)
    }

    generateItinerary()
  }, [tripData, personalityData])

  const generateMockItinerary = (trip: any, personality: any) => {
    const days =
      Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1

    const activities = {
      "Adventure Seeker": [
        { name: "Hiking Mount Fuji Trail", type: "adventure", icon: "🏔️", duration: "6 hours", cost: "$50" },
        { name: "Tokyo Skydiving Experience", type: "adventure", icon: "🪂", duration: "4 hours", cost: "$200" },
        { name: "Shibuya Go-Kart Tour", type: "adventure", icon: "🏎️", duration: "2 hours", cost: "$80" },
      ],
      "Culture Enthusiast": [
        { name: "Senso-ji Temple Visit", type: "culture", icon: "⛩️", duration: "2 hours", cost: "Free" },
        { name: "Traditional Tea Ceremony", type: "culture", icon: "🍵", duration: "1.5 hours", cost: "$40" },
        { name: "Kabuki Theatre Performance", type: "culture", icon: "🎭", duration: "3 hours", cost: "$60" },
      ],
      "Mindful Explorer": [
        { name: "Zen Garden Meditation", type: "wellness", icon: "🧘", duration: "1 hour", cost: "$20" },
        { name: "Traditional Onsen Experience", type: "wellness", icon: "♨️", duration: "2 hours", cost: "$30" },
        { name: "Peaceful Bamboo Forest Walk", type: "nature", icon: "🎋", duration: "1.5 hours", cost: "Free" },
      ],
    }

    const restaurants = [
      { name: "Sukiyabashi Jiro", type: "Sushi", rating: 4.9, price: "$$$", icon: "🍣" },
      { name: "Ramen Yokocho", type: "Ramen", rating: 4.7, price: "$$", icon: "🍜" },
      { name: "Tsukiji Fish Market", type: "Street Food", rating: 4.8, price: "$", icon: "🐟" },
    ]

    const dailyItinerary = Array.from({ length: days }, (_, index) => ({
      day: index + 1,
      date: new Date(new Date(trip.startDate).getTime() + index * 24 * 60 * 60 * 1000).toLocaleDateString(),
      activities:
        activities[personality.type as keyof typeof activities]?.slice(0, 2) ||
        activities["Culture Enthusiast"].slice(0, 2),
      restaurants: restaurants.slice(0, 2),
      tips: [
        "Best visited in the morning for fewer crowds",
        "Don't forget to bring comfortable walking shoes",
        "Try to learn a few basic Japanese phrases",
      ],
    }))

    return {
      destination: trip.destination,
      duration: `${days} days`,
      totalBudget: "$1,200 - $1,800",
      highlights: [
        "Authentic cultural experiences",
        "Hidden local gems",
        "Perfect photo opportunities",
        "Personality-matched activities",
      ],
      dailyItinerary,
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md border-0 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardContent className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-6"></div>
            <h3 className="text-xl font-semibold mb-2">Creating Your Perfect Itinerary</h3>
            <p className="text-gray-600">Our AI is analyzing your personality and preferences...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <Card className="mb-8 border-0 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-4xl">{personalityData.emoji}</span>
                <div>
                  <CardTitle className="text-3xl font-bold text-gray-800">
                    Your Perfect {itinerary.destination} Adventure
                  </CardTitle>
                  <CardDescription className="text-lg flex items-center gap-4 mt-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {itinerary.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      {itinerary.totalBudget}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {tripData.groupSize} travelers
                    </span>
                  </CardDescription>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button size="sm" className="bg-red-500 hover:bg-red-600">
                  <Heart className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Trip Highlights */}
        <Card className="mb-8 border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              Trip Highlights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {itinerary.highlights.map((highlight: string, index: number) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
                  <Star className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium">{highlight}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Daily Itinerary */}
        <div className="space-y-6">
          {itinerary.dailyItinerary.map((day: any) => (
            <Card key={day.day} className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {day.day}
                  </div>
                  <div>
                    <span className="text-xl">Day {day.day}</span>
                    <p className="text-sm text-gray-600 font-normal">{day.date}</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Activities */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Navigation className="h-4 w-4" />
                    Activities
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {day.activities.map((activity: any, index: number) => (
                      <div
                        key={index}
                        className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{activity.icon}</span>
                          <div className="flex-1">
                            <h5 className="font-semibold">{activity.name}</h5>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {activity.duration}
                              </span>
                              <span className="flex items-center gap-1">
                                <DollarSign className="h-3 w-3" />
                                {activity.cost}
                              </span>
                            </div>
                            <Badge variant="secondary" className="mt-2 text-xs">
                              {activity.type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Restaurants */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Utensils className="h-4 w-4" />
                    Recommended Dining
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {day.restaurants.map((restaurant: any, index: number) => (
                      <div
                        key={index}
                        className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{restaurant.icon}</span>
                          <div className="flex-1">
                            <h5 className="font-semibold">{restaurant.name}</h5>
                            <p className="text-sm text-gray-600">{restaurant.type}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm">{restaurant.rating}</span>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {restaurant.price}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Tips */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Coffee className="h-4 w-4" />
                    Pro Tips
                  </h4>
                  <ul className="space-y-2">
                    {day.tips.map((tip: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-purple-600 mt-1">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer Actions */}
        <Card className="mt-8 border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardContent className="text-center py-8">
            <h3 className="text-xl font-semibold mb-4">Ready for Your Adventure?</h3>
            <div className="flex justify-center gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Full Itinerary
              </Button>
              <Button variant="outline" size="lg">
                <Share2 className="mr-2 h-4 w-4" />
                Share with Friends
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
