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
  ArrowLeft,
  Plus,
  CheckCircle,
  X,
  AlertCircle,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DAY_COLOR_SCHEMES } from "./constants"
import { useAuth } from "../context/auth-context"
import { db } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"

interface ItineraryDisplayProps {
  soulProfile: any;
  completedItems: Set<string>;
  onToggleComplete: (itemId: string) => void;
  onCreateNew?: () => void;
  onBack?: () => void;
}

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  isVisible: boolean;
  onClose: () => void;
}

const Toast = ({ message, type, isVisible, onClose }: ToastProps) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white border-green-600';
      case 'error':
        return 'bg-red-500 text-white border-red-600';
      case 'info':
        return 'bg-blue-500 text-white border-blue-600';
      default:
        return 'bg-gray-500 text-white border-gray-600';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
      case 'info':
        return <Star className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
      <div className={`${getToastStyles()} px-6 py-4 rounded-lg shadow-lg border-2 backdrop-blur-sm max-w-sm`}>
        <div className="flex items-center gap-3">
          {getIcon()}
          <span className="font-medium">{message}</span>
          <button
            onClick={onClose}
            className="ml-auto hover:opacity-70 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ItineraryDisplay({ 
  soulProfile, 
  completedItems, 
  onToggleComplete, 
  onCreateNew, 
  onBack 
}: ItineraryDisplayProps) {
  const [itinerary, setItinerary] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"itinerary" | "map">("itinerary")
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  
  // Toast state
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
  }>({
    message: '',
    type: 'info',
    isVisible: false,
  });

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({
      message,
      type,
      isVisible: true,
    });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  const handleSaveJourney = async () => {
    if (!user || !itinerary) {
      showToast("You must be logged in to save a journey", "error");
      return;
    }

    setIsSaving(true);
    try {
      await addDoc(collection(db, "users", user.uid, "journeys"), {
        ...itinerary,
        soulProfile,
        createdAt: serverTimestamp(),
      });
      showToast("Journey saved successfully! ✨", "success");
    } catch (error) {
      console.error("Error saving journey: ", error);
      showToast("Failed to save journey. Please try again.", "error");
    } finally {
      setIsSaving(false);
    }
  };

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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
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
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 shadow-xl bg-white/90 backdrop-blur-sm text-center">
          <CardHeader>
            <CardTitle className="text-2xl text-red-600">Oracle's Vision is Clouded</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">There was an error generating your sacred journey.</p>
            <p className="text-sm text-red-700 bg-red-100 p-3 rounded-md">{error}</p>
            <div className="flex gap-2 mt-6">
              <Button onClick={() => window.location.reload()} className="flex-1">
                Try Again
              </Button>
              {onBack && (
                <Button variant="outline" onClick={onBack} className="flex-1">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!itinerary) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="py-12">
            <p className="text-gray-600 mb-4">No itinerary could be generated. Please try again.</p>
            {onBack && (
              <Button variant="outline" onClick={onBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Quiz
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <>
      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />

      <div className="space-y-6">
        {/* Header Card */}
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="text-4xl">{soulProfile.archetype.emoji}</span>
                <div>
                  <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-800">
                    {itinerary.tripTitle}
                  </CardTitle>
                  <CardDescription className="text-base sm:text-lg flex flex-wrap items-center gap-2 sm:gap-4 mt-2">
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

        {/* Tabs */}
        <Tabs defaultValue="itinerary" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="itinerary" className="flex items-center gap-2">
              <LayoutList className="w-4 h-4" /> 
              Itinerary
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" /> 
              Map View
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="itinerary" className="space-y-6">
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
                  <CardContent className="p-4 sm:p-6 space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2 text-gray-800">
                        <Navigation className="h-4 w-4" />
                        Activities
                      </h4>
                      <div className="grid gap-3 sm:gap-4">
                        {day.activities.map((activity: any, index: number) => {
                           const itemId = `item-${day.day}-${index}`;
                           const isCompleted = completedItems.has(itemId);
                            return (
                             <div key={itemId} className="p-3 sm:p-4 border rounded-lg hover:shadow-md transition-all bg-white relative">
                               <div className={`transition-opacity ${isCompleted ? 'opacity-50' : 'opacity-100'}`}>
                                 <div className="flex items-start gap-3">
                                   <span className="text-xl sm:text-2xl mt-1 flex-shrink-0">{activity.emoji}</span>
                                  <div className="flex-1 min-w-0">
                                    <h5 className="font-semibold text-sm sm:text-base">{activity.name}</h5>
                                    <p className="text-xs sm:text-sm text-gray-600 mt-1">{activity.description}</p>
                                     </div>
                                   </div>
                                  </div>
                                 <button
                                   onClick={() => onToggleComplete(itemId)}
                                   className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                                   aria-label={isCompleted ? 'Mark as not completed' : 'Mark as completed'}
                                 >
                                   <CheckCircle2 className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors ${isCompleted ? 'text-green-500 fill-green-100' : 'text-gray-300 hover:text-gray-400'}`} />
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
                      <div className="grid gap-3 sm:gap-4">
                        {day.restaurants.map((restaurant: any, index: number) => {
                           const activityCount = day.activities.length;
                           const itemId = `item-${day.day}-${activityCount + index}`;
                           const isCompleted = completedItems.has(itemId);
                            return (
                             <div key={itemId} className="p-3 sm:p-4 border rounded-lg hover:shadow-md transition-all bg-white relative">
                               <div className={`transition-opacity ${isCompleted ? 'opacity-50' : 'opacity-100'}`}>
                                 <div className="flex items-start gap-3">
                                   <span className="text-xl sm:text-2xl mt-1 flex-shrink-0">{restaurant.emoji}</span>
                                  <div className="flex-1 min-w-0">
                                    <h5 className="font-semibold text-sm sm:text-base">{restaurant.name}</h5>
                                    <p className="text-xs sm:text-sm text-gray-600 mt-1">{restaurant.description}</p>
                                     </div>
                                   </div>
                                  </div>
                                 <button
                                   onClick={() => onToggleComplete(itemId)}
                                   className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                                   aria-label={isCompleted ? 'Mark as not completed' : 'Mark as completed'}
                                 >
                                   <CheckCircle2 className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors ${isCompleted ? 'text-green-500 fill-green-100' : 'text-gray-300 hover:text-gray-400'}`} />
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
          </TabsContent>
          
          <TabsContent value="map">
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Journey Map View</CardTitle>
                <CardDescription>A bird&apos;s eye view of your spiritual quest.</CardDescription>
              </CardHeader>
              <CardContent>
                <JourneyMapView itinerary={itinerary} completedItems={completedItems} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quote */}
        {itinerary.soulQuote && (
          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardContent className="text-center py-8">
              <p className="text-base sm:text-lg italic text-gray-700">&quot;{itinerary.soulQuote}&quot;</p>
            </CardContent>
          </Card>
        )}

        {/* Footer Actions */}
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardContent className="text-center py-6 sm:py-8">
            <h3 className="text-lg sm:text-xl font-semibold mb-4">Ready for Your Adventure?</h3>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              {user && (
                <Button
                  size="lg"
                  onClick={handleSaveJourney}
                  disabled={isSaving}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                >
                  <Heart className="mr-2 h-4 w-4" />
                  {isSaving ? "Saving..." : "Save Journey"}
                </Button>
              )}
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Itinerary
              </Button>
              <Button variant="outline" size="lg">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
