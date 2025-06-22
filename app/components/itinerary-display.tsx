"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import JourneyMapView from "./journey-map-view"
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
  Map,
  LayoutList,
  MapPin,
  CheckCircle2,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DAY_COLOR_SCHEMES } from "./constants"

interface ItineraryDisplayProps {
  soulProfile: any;
  completedItems: Set<string>;
  onToggleComplete: (itemId: string) => void;
}

export default function ItineraryDisplay({ soulProfile, completedItems, onToggleComplete }: ItineraryDisplayProps) {
  const [itinerary, setItinerary] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"itinerary" | "map">("itinerary")

  useEffect(() => {
    const generateItinerary = async () => {
      if (!soulProfile) return

      setLoading(true)
      setError(null)
      console.log("Sending soul profile to API:", soulProfile)

      try {
        const response = await fetch("/api/generate-itinerary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ soulProfile }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        setItinerary(data)
      } catch (e: any) {
        console.error("Failed to generate itinerary:", e)
        setError(e.message || "An unknown error occurred.")
      } finally {
        setLoading(false)
      }
    }

    generateItinerary()
  }, [soulProfile])

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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-100 flex items-center justify-center">
        <Card className="w-full max-w-md border-0 shadow-xl bg-white/90 backdrop-blur-sm text-center">
          <CardHeader>
            <CardTitle className="text-2xl text-red-600">Oracle's Vision is Clouded</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">There was an error generating your sacred journey.</p>
            <p className="text-sm text-red-700 bg-red-100 p-3 rounded-md">{error}</p>
            <Button onClick={() => window.location.reload()} className="mt-6">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!itinerary) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100 flex items-center justify-center">
        <p>No itinerary could be generated. Please try again.</p>
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
                <span className="text-4xl">{soulProfile.archetype.emoji}</span>
                <div>
                  <CardTitle className="text-3xl font-bold text-gray-800">
                    {itinerary.tripTitle}
                  </CardTitle>
                  <CardDescription className="text-lg flex items-center gap-4 mt-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {itinerary.dailyItinerary.length} days
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      {soulProfile.practical.budget}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {soulProfile.practical.companions}
                    </span>
                  </CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="itinerary" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="itinerary"><LayoutList className="w-4 h-4 mr-2" /> Itinerary</TabsTrigger>
            <TabsTrigger value="map"><MapPin className="w-4 h-4 mr-2" /> Map View</TabsTrigger>
          </TabsList>
          <TabsContent value="itinerary">
            <div className="space-y-8 mt-4">
              {itinerary.dailyItinerary.map((day: any) => {
                const colorScheme = DAY_COLOR_SCHEMES[(day.day - 1) % DAY_COLOR_SCHEMES.length];
                return (
                  <Card key={day.day} className="border-0 shadow-lg bg-white/90 backdrop-blur-sm overflow-hidden">
                    <CardHeader className="bg-gray-50/50">
                      <CardTitle className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${colorScheme.circle} rounded-full flex items-center justify-center text-white font-bold`}>
                          {day.day}
                        </div>
                        <div>
                          <span className="text-xl">Day {day.day}</span>
                          <p className="text-sm text-gray-600 font-normal">{day.theme}</p>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2 text-gray-800">
                          <Navigation className="h-4 w-4" />
                          Activities
                        </h4>
                        <div className="grid md:grid-cols-2 gap-4">
                          {day.activities.map((activity: any, index: number) => {
                             const itemId = `item-${day.day}-${index}`;
                             const isCompleted = completedItems.has(itemId);
                              return (
                               <div key={itemId} className="p-4 border rounded-lg hover:shadow-md transition-all bg-white relative">
                                 <div className={`transition-opacity ${isCompleted ? 'opacity-50' : 'opacity-100'}`}>
                                   <div className="flex items-start gap-3">
                                     <span className="text-2xl mt-1">{activity.emoji}</span>
                                  <div className="flex-1">
                                    <h5 className="font-semibold">{activity.name}</h5>
                                    <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                                     </div>
                                   </div>
                                  </div>
                                 <button
                                   onClick={() => onToggleComplete(itemId)}
                                   className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                                   aria-label={isCompleted ? 'Mark as not completed' : 'Mark as completed'}
                                 >
                                   <CheckCircle2 className={`w-6 h-6 transition-colors ${isCompleted ? 'text-green-500 fill-green-100' : 'text-gray-300 hover:text-gray-400'}`} />
                                 </button>
                                </div>
                              )
                          })}
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2 text-gray-800">
                          <Utensils className="h-4 w-4" />
                          Dining
                        </h4>
                        <div className="grid md:grid-cols-2 gap-4">
                          {day.restaurants.map((restaurant: any, index: number) => {
                             const activityCount = day.activities.length;
                             const itemId = `item-${day.day}-${activityCount + index}`;
                             const isCompleted = completedItems.has(itemId);
                              return (
                               <div key={itemId} className="p-4 border rounded-lg hover:shadow-md transition-all bg-white relative">
                                 <div className={`transition-opacity ${isCompleted ? 'opacity-50' : 'opacity-100'}`}>
                                   <div className="flex items-start gap-3">
                                     <span className="text-2xl mt-1">{restaurant.emoji}</span>
                                  <div className="flex-1">
                                    <h5 className="font-semibold">{restaurant.name}</h5>
                                    <p className="text-sm text-gray-600 mt-1">{restaurant.description}</p>
                                     </div>
                                   </div>
                                  </div>
                                 <button
                                   onClick={() => onToggleComplete(itemId)}
                                   className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                                   aria-label={isCompleted ? 'Mark as not completed' : 'Mark as completed'}
                                 >
                                   <CheckCircle2 className={`w-6 h-6 transition-colors ${isCompleted ? 'text-green-500 fill-green-100' : 'text-gray-300 hover:text-gray-400'}`} />
                                 </button>
                                </div>
                              )
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
          <TabsContent value="map">
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm mt-4">
              <CardHeader>
                <CardTitle>Journey Map View</CardTitle>
                <CardDescription>A bird's eye view of your spiritual quest.</CardDescription>
              </CardHeader>
              <CardContent>
                <JourneyMapView itinerary={itinerary} completedItems={completedItems} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {itinerary.soulQuote && (
          <div className="mt-8 text-center">
            <p className="text-lg italic text-gray-700">"{itinerary.soulQuote}"</p>
          </div>
        )}

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
