"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/auth-context';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Plus, Calendar, MapPin, Users, DollarSign, Navigation, Utensils, LayoutList, CheckCircle2, Download, Share2, Heart, Dna } from 'lucide-react';
import Link from 'next/link';
import JourneyMapView from '../../components/journey-map-view';
import { DAY_COLOR_SCHEMES } from '../../components/constants';

// Country to flag emoji mapping (same as in journeys page)
const getCountryFlag = (destination: string): string => {
  const countryFlags: { [key: string]: string } = {
    // Europe
    'france': '🇫🇷', 'paris': '🇫🇷', 'italy': '🇮🇹', 'florence': '🇮🇹', 'rome': '🇮🇹', 'venice': '🇮🇹', 'milan': '🇮🇹',
    'spain': '🇪🇸', 'madrid': '🇪🇸', 'barcelona': '🇪🇸', 'seville': '🇪🇸', 'germany': '🇩🇪', 'berlin': '🇩🇪', 'munich': '🇩🇪',
    'uk': '🇬🇧', 'england': '🇬🇧', 'london': '🇬🇧', 'scotland': '🏴󠁧󠁢󠁳󠁣󠁴󠁿', 'edinburgh': '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
    'netherlands': '🇳🇱', 'amsterdam': '🇳🇱', 'portugal': '🇵🇹', 'lisbon': '🇵🇹', 'greece': '🇬🇷', 'athens': '🇬🇷', 'santorini': '🇬🇷',
    'norway': '🇳🇴', 'oslo': '🇳🇴', 'sweden': '🇸🇪', 'stockholm': '🇸🇪', 'denmark': '🇩🇰', 'copenhagen': '🇩🇰',
    'switzerland': '🇨🇭', 'zurich': '🇨🇭', 'austria': '🇦🇹', 'vienna': '🇦🇹',
    
    // Asia
    'japan': '🇯🇵', 'tokyo': '🇯🇵', 'kyoto': '🇯🇵', 'china': '🇨🇳', 'beijing': '🇨🇳', 'shanghai': '🇨🇳',
    'thailand': '🇹🇭', 'bangkok': '🇹🇭', 'india': '🇮🇳', 'delhi': '🇮🇳', 'mumbai': '🇮🇳', 'singapore': '🇸🇬',
    'south korea': '🇰🇷', 'seoul': '🇰🇷',
    
    // Americas
    'usa': '🇺🇸', 'united states': '🇺🇸', 'new york': '🇺🇸', 'los angeles': '🇺🇸', 'san francisco': '🇺🇸',
    'canada': '🇨🇦', 'toronto': '🇨🇦', 'vancouver': '🇨🇦', 'mexico': '🇲🇽', 'mexico city': '🇲🇽',
    'brazil': '🇧🇷', 'rio de janeiro': '🇧🇷', 'argentina': '🇦🇷', 'buenos aires': '🇦🇷',
    
    // Africa & Middle East
    'egypt': '🇪🇬', 'cairo': '🇪🇬', 'south africa': '🇿🇦', 'cape town': '🇿🇦', 'morocco': '🇲🇦', 'marrakech': '🇲🇦',
    'uae': '🇦🇪', 'dubai': '🇦🇪', 'abu dhabi': '🇦🇪',
    
    // Oceania
    'australia': '🇦🇺', 'sydney': '🇦🇺', 'melbourne': '🇦🇺', 'new zealand': '🇳🇿', 'auckland': '🇳🇿',
  };

  const destination_lower = destination.toLowerCase();
  for (const [key, flag] of Object.entries(countryFlags)) {
    if (destination_lower.includes(key)) {
      return flag;
    }
  }
  return '🌍'; // Default world emoji
};

export default function JourneyView() {
  const { user, loading: authLoading } = useAuth();
  const [journey, setJourney] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());
  const router = useRouter();
  const params = useParams();
  const journeyId = params.id as string;

  const handleToggleComplete = (itemId: string) => {
    setCompletedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/');
      return;
    }

    const fetchJourney = async () => {
      try {
        const journeyDoc = await getDoc(doc(db, "users", user.uid, "journeys", journeyId));
        if (journeyDoc.exists()) {
          setJourney({ id: journeyDoc.id, ...journeyDoc.data() });
        } else {
          setError("Journey not found");
        }
      } catch (error) {
        console.error("Error fetching journey: ", error);
        setError("Failed to load journey");
      } finally {
        setLoading(false);
      }
    };

    fetchJourney();
  }, [user, authLoading, router, journeyId]);

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error || !journey) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="py-12">
            <h2 className="text-xl font-semibold text-red-600 mb-4">Journey Not Found</h2>
            <p className="text-gray-600 mb-6">{error || "The requested journey could not be found."}</p>
            <Link href="/journeys">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Journeys
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Navigation Bar */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="container mx-auto max-w-6xl px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/journeys">
                <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  My Journeys
                </Button>
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">Saved Journey</h1>
            </div>
            <Link href="/">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <Plus className="mr-2 h-4 w-4" />
                New Journey
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl p-4 space-y-6">
        {/* Header Card */}
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="text-4xl">{getCountryFlag(journey.destination || '')}</span>
                <div>
                  <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-800">
                    {journey.tripTitle}
                  </CardTitle>
                  <div className="text-base sm:text-lg flex flex-wrap items-center gap-2 sm:gap-4 mt-2 text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {journey.dailyItinerary?.length || 0} days
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {journey.destination}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {journey.soulProfile?.practical?.companions || 'Solo'}
                    </span>
                    {journey.soulProfile?.practical?.budget && (
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        ${journey.soulProfile.practical.budget}
                      </span>
                    )}
                    {journey.soulProfile?.archetype?.name && (
                      <span className="flex items-center gap-1">
                        <Dna className="h-4 w-4" />
                        {journey.soulProfile.archetype.name}
                      </span>
                    )}
                  </div>
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
            {journey.dailyItinerary?.map((day: any) => {
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
                    {day.activities && day.activities.length > 0 && (
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
                                   onClick={() => handleToggleComplete(itemId)}
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
                    )}

                    {day.activities && day.restaurants && (
                      <Separator />
                    )}

                    {day.restaurants && day.restaurants.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2 text-gray-800">
                          <Utensils className="h-4 w-4" />
                          Dining
                        </h4>
                        <div className="grid gap-3 sm:gap-4">
                          {day.restaurants.map((restaurant: any, index: number) => {
                             const activityCount = day.activities?.length || 0;
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
                                   onClick={() => handleToggleComplete(itemId)}
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
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </TabsContent>
          
          <TabsContent value="map">
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Journey Map View</CardTitle>
                <CardDescription>A bird's eye view of your spiritual quest.</CardDescription>
              </CardHeader>
              <CardContent>
                <JourneyMapView itinerary={journey} completedItems={completedItems} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quote */}
        {journey.soulQuote && (
          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardContent className="text-center py-8">
              <p className="text-base sm:text-lg italic text-gray-700">"{journey.soulQuote}"</p>
            </CardContent>
          </Card>
        )}

        {/* Footer Actions */}
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardContent className="text-center py-6 sm:py-8">
            <h3 className="text-lg sm:text-xl font-semibold mb-4">Your Saved Adventure</h3>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
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
    </div>
  );
} 