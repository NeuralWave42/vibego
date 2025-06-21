"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Sparkles, Star, Heart, Compass } from "lucide-react"

const oracleSteps = [
  {
    id: "archetype",
    title: "Soul Archetype Discovery",
    question: "Which essence resonates with your soul's everyday rhythm?",
    subtitle: "Feel into your deepest nature...",
    options: [
      {
        value: "contemplative",
        label: "The Contemplative",
        emoji: "🧘",
        description: "Calm & reflective",
        colors: "from-blue-400 to-teal-500",
        bgColor: "bg-blue-500/20",
      },
      {
        value: "spark",
        label: "The Spark",
        emoji: "🧨",
        description: "Energetic & outgoing",
        colors: "from-orange-400 to-red-500",
        bgColor: "bg-orange-500/20",
      },
      {
        value: "seeker",
        label: "The Seeker",
        emoji: "🧠",
        description: "Curious & thoughtful",
        colors: "from-purple-400 to-indigo-500",
        bgColor: "bg-purple-500/20",
      },
      {
        value: "creator",
        label: "The Creator",
        emoji: "🎨",
        description: "Creative & whimsical",
        colors: "from-pink-400 to-purple-500",
        bgColor: "bg-pink-500/20",
      },
    ],
  },
  {
    id: "mood",
    title: "Present Moment Witness",
    question: "What energy flows through you in this moment?",
    subtitle: "Honor your current state...",
    options: [
      {
        value: "flowing",
        label: "Flowing",
        emoji: "😌",
        description: "Relaxed and easygoing",
        colors: "from-blue-300 to-green-400",
        bgColor: "bg-blue-400/20",
      },
      {
        value: "refuge",
        label: "Seeking Refuge",
        emoji: "😵‍💫",
        description: "Stressed and need a break",
        colors: "from-orange-400 to-red-400",
        bgColor: "bg-orange-400/20",
      },
      {
        value: "spark",
        label: "Craving Spark",
        emoji: "🥱",
        description: "Bored, need excitement",
        colors: "from-purple-400 to-yellow-400",
        bgColor: "bg-purple-400/20",
      },
      {
        value: "deep",
        label: "Diving Deep",
        emoji: "🧠",
        description: "Reflective or introspective",
        colors: "from-indigo-500 to-gray-600",
        bgColor: "bg-indigo-500/20",
      },
    ],
  },
  {
    id: "philosophy",
    title: "Journey Philosophy",
    question: "How does your spirit prefer to dance with the unknown?",
    subtitle: "Choose your sacred approach...",
    options: [
      {
        value: "architect",
        label: "The Architect",
        emoji: "📐",
        description: "Well-planned and detailed",
        colors: "from-gray-400 to-blue-500",
        bgColor: "bg-gray-500/20",
      },
      {
        value: "wanderer",
        label: "The Wanderer",
        emoji: "🌙",
        description: "Spontaneous and open",
        colors: "from-purple-400 to-pink-500",
        bgColor: "bg-purple-500/20",
      },
      {
        value: "harmonizer",
        label: "The Harmonizer",
        emoji: "⚖️",
        description: "Balanced mix of both",
        colors: "from-green-400 to-teal-500",
        bgColor: "bg-green-500/20",
      },
      {
        value: "dreamer",
        label: "The Dreamer",
        emoji: "🌀",
        description: "Imaginative and intuitive",
        colors: "from-cyan-400 to-purple-500",
        bgColor: "bg-cyan-500/20",
      },
    ],
  },
  {
    id: "intention",
    title: "Emotional Intention",
    question: "Should this journey honor your current energy or transform it?",
    subtitle: "Set your soul's intention...",
    options: [
      {
        value: "honor",
        label: "Honor",
        emoji: "🙏",
        description: "Match current mood",
        colors: "from-blue-400 to-purple-500",
        bgColor: "bg-blue-500/20",
      },
      {
        value: "transform",
        label: "Transform",
        emoji: "🦋",
        description: "Shift current mood",
        colors: "from-orange-400 to-pink-500",
        bgColor: "bg-orange-500/20",
      },
      {
        value: "discover",
        label: "Discover",
        emoji: "✨",
        description: "I'm not sure yet",
        colors: "from-yellow-400 to-purple-500",
        bgColor: "bg-yellow-500/20",
      },
      {
        value: "heal",
        label: "Heal",
        emoji: "🌿",
        description: "Soothe and restore your energy",
        colors: "from-green-400 to-teal-500",
        bgColor: "bg-green-500/20",
      },
    ],
  },
  {
    id: "destinations",
    title: "Soul Destinations",
    question: "Which realms call to your spirit?",
    subtitle: "Select all that resonate...",
    multiSelect: true,
    options: [
      {
        value: "nature",
        label: "Natural Landscapes",
        emoji: "🏔️",
        description: "Mountains, forests, oceans",
        colors: "from-green-400 to-blue-500",
        bgColor: "bg-green-500/20",
      },
      {
        value: "culture",
        label: "Cultural Wonders",
        emoji: "🏛️",
        description: "History, art, traditions",
        colors: "from-amber-400 to-orange-500",
        bgColor: "bg-amber-500/20",
      },
      {
        value: "adventure",
        label: "Adventure Realms",
        emoji: "🎢",
        description: "Thrills and excitement",
        colors: "from-red-400 to-pink-500",
        bgColor: "bg-red-500/20",
      },
      {
        value: "culinary",
        label: "Culinary Journeys",
        emoji: "🍜",
        description: "Food and flavors",
        colors: "from-yellow-400 to-red-500",
        bgColor: "bg-yellow-500/20",
      },
      {
        value: "spiritual",
        label: "Spiritual Retreats",
        emoji: "🕯️",
        description: "Sacred spaces and festivals",
        colors: "from-purple-400 to-indigo-500",
        bgColor: "bg-purple-500/20",
      },
      {
        value: "learning",
        label: "Educational Experiences",
        emoji: "📚",
        description: "Knowledge and growth",
        colors: "from-blue-400 to-teal-500",
        bgColor: "bg-blue-500/20",
      },
    ],
  },
  {
    id: "practical",
    title: "Grounding Your Vision",
    question: "Let's anchor your dreams in reality...",
    subtitle: "Practical foundations for your journey",
    practical: true,
  },
]

interface PreDepartureOracleProps {
  onComplete: (profile: any) => void
}

export default function PreDepartureOracle({ onComplete }: PreDepartureOracleProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [practicalData, setPracticalData] = useState({
    budget: 1000,
    startDate: "",
    endDate: "",
    companions: "solo",
    destination: "",
    additionalPrompt: "",
  })

  const currentStepData = oracleSteps[currentStep]
  const progress = ((currentStep + 1) / oracleSteps.length) * 100

  // Dynamic background color based on current mood selection
  const getMoodBackground = () => {
    if (answers.mood) {
      const moodOption = oracleSteps[1].options.find((opt) => opt.value === answers.mood)
      return moodOption?.bgColor || "bg-slate-900/20"
    }
    return "bg-slate-900/20"
  }

  const handleOptionSelect = (value: string) => {
    if (currentStepData.multiSelect) {
      const newSelection = selectedOptions.includes(value)
        ? selectedOptions.filter((opt) => opt !== value)
        : [...selectedOptions, value]
      setSelectedOptions(newSelection)
    } else {
      setAnswers((prev) => ({
        ...prev,
        [currentStepData.id]: value,
      }))
    }
  }

  const handleNext = () => {
    if (currentStepData.multiSelect) {
      setAnswers((prev) => ({
        ...prev,
        [currentStepData.id]: selectedOptions,
      }))
      setSelectedOptions([])
    }

    if (currentStep < oracleSteps.length - 1) {
      setCurrentStep((prev) => prev + 1)
    } else {
      // Complete the oracle
      const soulProfile = generateSoulProfile({ ...answers, practical: practicalData })
      onComplete(soulProfile)
    }
  }

  const generateSoulProfile = (allAnswers: any) => {
    const archetypeData = oracleSteps[0].options.find((opt) => opt.value === allAnswers.archetype)
    const moodData = oracleSteps[1].options.find((opt) => opt.value === allAnswers.mood)

    return {
      archetype: archetypeData,
      mood: moodData,
      philosophy: allAnswers.philosophy,
      intention: allAnswers.intention,
      destinations: allAnswers.destinations,
      practical: allAnswers.practical,
      soulQuote: generateSoulQuote(allAnswers),
      colors: moodData?.colors || "from-purple-400 to-pink-500",
    }
  }

  const generateSoulQuote = (answers: any) => {
    const quotes = {
      contemplative: "In stillness, the soul finds its truest direction.",
      spark: "Your energy lights the path to extraordinary adventures.",
      seeker: "Curiosity is the compass that leads to wonder.",
      creator: "Your imagination paints the world in vibrant possibilities.",
    }
    return quotes[answers.archetype as keyof typeof quotes] || "Your journey begins with a single sacred step."
  }

  const canProceed = () => {
    if (currentStepData.practical) {
      return practicalData.destination.length > 0 && practicalData.startDate && practicalData.endDate
    }
    if (currentStepData.multiSelect) {
      return selectedOptions.length > 0
    }
    return answers[currentStepData.id] !== undefined
  }

  if (currentStepData.practical) {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 ${getMoodBackground()} transition-all duration-1000`}
      >
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
          <Card className="w-full max-w-3xl border border-white/10 shadow-2xl bg-white/5 backdrop-blur-xl">
            <CardHeader className="text-center pb-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Compass className="h-8 w-8 text-amber-400 animate-pulse" />
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-amber-300 to-purple-300 bg-clip-text text-transparent">
                  {currentStepData.title}
                </CardTitle>
              </div>
              <Progress value={progress} className="mt-4 bg-white/10" />
            </CardHeader>

            <CardContent className="space-y-8">
              <div className="text-center">
                <h3 className="text-2xl font-semibold mb-2 text-slate-100">{currentStepData.question}</h3>
                <p className="text-slate-300">{currentStepData.subtitle}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-slate-200">Destination</label>
                  <input
                    type="text"
                    placeholder="Where does your soul wish to wander?"
                    value={practicalData.destination}
                    onChange={(e) => setPracticalData((prev) => ({ ...prev, destination: e.target.value }))}
                    className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:border-purple-400 focus:outline-none backdrop-blur-sm"
                  />
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-slate-200">Travel Companions</label>
                  <select
                    value={practicalData.companions}
                    onChange={(e) => setPracticalData((prev) => ({ ...prev, companions: e.target.value }))}
                    className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-purple-400 focus:outline-none backdrop-blur-sm"
                  >
                    <option value="solo" className="bg-slate-800">
                      Solo Journey
                    </option>
                    <option value="partner" className="bg-slate-800">
                      With Partner
                    </option>
                    <option value="friends" className="bg-slate-800">
                      With Friends
                    </option>
                    <option value="family" className="bg-slate-800">
                      With Family
                    </option>
                  </select>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-slate-200">Start Date</label>
                  <input
                    type="date"
                    value={practicalData.startDate}
                    onChange={(e) => setPracticalData((prev) => ({ ...prev, startDate: e.target.value }))}
                    className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-purple-400 focus:outline-none backdrop-blur-sm"
                  />
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-slate-200">End Date</label>
                  <input
                    type="date"
                    value={practicalData.endDate}
                    onChange={(e) => setPracticalData((prev) => ({ ...prev, endDate: e.target.value }))}
                    className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-purple-400 focus:outline-none backdrop-blur-sm"
                  />
                </div>

                <div className="md:col-span-2 space-y-4">
                  <label className="block text-sm font-medium text-slate-200">Sacred Budget Range</label>
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    step="100"
                    value={practicalData.budget}
                    onChange={(e) => setPracticalData((prev) => ({ ...prev, budget: Number.parseInt(e.target.value) }))}
                    className="w-full accent-purple-500"
                  />
                  <div className="text-center text-slate-200">
                    {practicalData.budget === 5000 ? "$5000+" : `$${practicalData.budget}`}
                  </div>
                </div>

                <div className="md:col-span-2 space-y-4">
                  <label className="block text-sm font-medium text-slate-200">Additional Preferences</label>
                  <textarea
                    placeholder="Share any additional preferences, requirements, or dreams for your journey..."
                    value={practicalData.additionalPrompt}
                    onChange={(e) => setPracticalData((prev) => ({ ...prev, additionalPrompt: e.target.value }))}
                    className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:border-purple-400 focus:outline-none backdrop-blur-sm"
                    rows={3}
                  />
                </div>
              </div>

              <div className="text-center pt-6">
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Complete the Oracle Ritual
                  <Sparkles className="ml-2 h-5 w-5 animate-spin" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 ${getMoodBackground()} transition-all duration-1000`}
    >
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-4xl border border-white/10 shadow-2xl bg-white/5 backdrop-blur-xl">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Star className="h-8 w-8 text-amber-400 animate-pulse" />
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-amber-300 to-purple-300 bg-clip-text text-transparent">
                {currentStepData.title}
              </CardTitle>
            </div>
            <Progress value={progress} className="mt-4 bg-white/10" />
          </CardHeader>

          <CardContent className="space-y-8">
            <div className="text-center">
              <h3 className="text-2xl font-semibold mb-2 text-slate-100">{currentStepData.question}</h3>
              <p className="text-slate-300">{currentStepData.subtitle}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {currentStepData.options.map((option) => {
                const isSelected = currentStepData.multiSelect
                  ? selectedOptions.includes(option.value)
                  : answers[currentStepData.id] === option.value

                return (
                  <div
                    key={option.value}
                    onClick={() => handleOptionSelect(option.value)}
                    className={`group cursor-pointer p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                      isSelected
                        ? `border-white/50 bg-gradient-to-br ${option.colors} shadow-2xl`
                        : "border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10"
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-6xl mb-4 group-hover:animate-bounce">{option.emoji}</div>
                      <h4 className="text-xl font-bold mb-2 text-white">{option.label}</h4>
                      <p className="text-slate-200 text-sm">{option.description}</p>
                      {isSelected && (
                        <Badge className="mt-3 bg-white/20 text-white border-white/30">
                          <Heart className="h-3 w-3 mr-1" />
                          Selected
                        </Badge>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="text-center pt-6">
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {currentStep === oracleSteps.length - 1 ? "Complete Oracle" : "Continue Journey"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
