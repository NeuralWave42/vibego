"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, Moon, Sun, Stars, Heart } from "lucide-react"
import PreDepartureOracle from "./components/pre-departure-oracle"
import ItineraryDisplay from "./components/itinerary-display"
import SharingRealm from "./components/sharing-realm"

export default function MysticalTripOracle() {
  const [currentRealm, setCurrentRealm] = useState<"welcome" | "oracle" | "journey" | "sharing">("welcome")
  const [soulProfile, setSoulProfile] = useState(null)
  const [journeyBlueprint, setJourneyBlueprint] = useState(null)
  const [ambientAudio, setAmbientAudio] = useState(false)
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set())

  useEffect(() => {
    // Placeholder for ambient audio initialization
  }, [ambientAudio])

  const handleToggleComplete = (itemId: string) => {
    setCompletedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(itemId)) {
        newSet.delete(itemId)
      } else {
        newSet.add(itemId)
      }
      return newSet
    })
  }

  const handleOracleComplete = (profile: any) => {
    setSoulProfile(profile)
    setCurrentRealm("journey")
  }

  const handleJourneyComplete = (blueprint: any) => {
    setJourneyBlueprint(blueprint)
    setCurrentRealm("sharing")
  }

  if (currentRealm === "oracle") {
    return <PreDepartureOracle onComplete={handleOracleComplete} />
  }

  if (currentRealm === "journey") {
    return <ItineraryDisplay soulProfile={soulProfile} completedItems={completedItems} onToggleComplete={handleToggleComplete} />
  }

  if (currentRealm === "sharing") {
    return <SharingRealm journeyBlueprint={journeyBlueprint} soulProfile={soulProfile} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 animate-pulse"><Stars className="h-6 w-6 text-amber-300 opacity-70" /></div>
        <div className="absolute top-40 right-20 animate-bounce"><Moon className="h-8 w-8 text-blue-300 opacity-60" /></div>
        <div className="absolute bottom-32 left-1/4 animate-pulse"><Sun className="h-5 w-5 text-orange-300 opacity-50" /></div>
        <div className="absolute top-1/3 right-1/3 animate-ping"><div className="h-2 w-2 bg-pink-400 rounded-full opacity-40"></div></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
        <Card className="max-w-4xl w-full border border-white/10 shadow-2xl bg-white/5 backdrop-blur-xl">
          <CardContent className="p-12 text-center">
            <div className="mb-12">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="relative">
                  <Sparkles className="h-12 w-12 text-amber-400 animate-pulse" />
                  <div className="absolute inset-0 h-12 w-12 text-amber-400 animate-ping opacity-30"><Sparkles className="h-12 w-12" /></div>
                </div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-300 via-purple-300 to-blue-300 bg-clip-text text-transparent">
                  Journey Oracle
                </h1>
                <div className="relative">
                  <Heart className="h-12 w-12 text-rose-400 animate-pulse" />
                  <div className="absolute inset-0 h-12 w-12 text-rose-400 animate-ping opacity-30"><Heart className="h-12 w-12" /></div>
                </div>
              </div>
              <p className="text-2xl text-purple-200 mb-4 font-light">Where Soul Meets Adventure</p>
              <p className="text-lg text-slate-200 max-w-2xl mx-auto leading-relaxed">
                Step into a realm where travel transcends the ordinary. Let the ancient wisdom of the Journey Oracle
                guide you to experiences that resonate with your soul's deepest calling.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div className="group cursor-pointer">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg"><Moon className="h-10 w-10 text-white" /></div>
                  <h3 className="text-xl font-semibold mb-2 text-purple-200">Soul Archetype Discovery</h3>
                  <p className="text-slate-300 text-sm">Unveil your travel essence through mystical personality revelation</p>
                </div>
                <div className="group cursor-pointer">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg"><Stars className="h-10 w-10 text-white" /></div>
                  <h3 className="text-xl font-semibold mb-2 text-blue-200">Cosmic Itinerary Weaving</h3>
                  <p className="text-slate-300 text-sm">AI-channeled journeys aligned with your spiritual frequency</p>
                </div>
                <div className="group cursor-pointer">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg"><Heart className="h-10 w-10 text-white" /></div>
                  <h3 className="text-xl font-semibold mb-2 text-emerald-200">Sacred Journey Sharing</h3>
                  <p className="text-slate-300 text-sm">Connect kindred spirits through mystical travel bonds</p>
                </div>
            </div>
            <div className="mb-12 p-6 bg-gradient-to-r from-purple-900/40 to-pink-900/40 rounded-2xl border border-purple-400/20 backdrop-blur-sm">
              <p className="text-xl italic text-purple-100 mb-2">"The journey of a thousand miles begins with a single step into the unknown depths of your soul."</p>
              <p className="text-sm text-slate-400">— Ancient Travel Wisdom</p>
            </div>
            <div className="mb-8">
              <Button variant="outline" onClick={() => setAmbientAudio(!ambientAudio)} className="border-purple-300/50 text-purple-200 hover:bg-purple-800/20 bg-white/5">
                {ambientAudio ? "🔊 Silence the Cosmos" : "🎵 Awaken Ambient Sounds"}
              </Button>
            </div>
            <div className="space-y-4">
              <Button onClick={() => setCurrentRealm("oracle")} size="lg" className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 text-white px-12 py-4 text-xl font-semibold rounded-full shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 transform hover:scale-105">
                <Sparkles className="mr-3 h-6 w-6 animate-spin" />
                Begin the Oracle Ritual
                <Sparkles className="ml-3 h-6 w-6 animate-spin" />
              </Button>
              <p className="text-sm text-slate-400">✨ Your soul's journey awaits beyond the veil ✨</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
