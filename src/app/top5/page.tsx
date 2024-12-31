"use client"

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Trophy, ChevronDown } from 'lucide-react'
import { Button } from "@/components/ui/button"
import confetti from 'canvas-confetti'

interface Resolution {
  id: number;
  name: string;
  resolution: string;
  average_rating: number;
}

export default function Top5Page() {
  const [topResolutions, setTopResolutions] = useState<Resolution[]>([])
  const [revealedItems, setRevealedItems] = useState<Set<number>>(new Set())

  useEffect(() => {
    fetchTopResolutions()
  }, [])

  const fetchTopResolutions = async () => {
    const response = await fetch('/api/top5')
    const data = await response.json()
    setTopResolutions(data)
  }

  const getTrophyColor = (index: number) => {
    switch (index) {
      case 0: return 'text-yellow-400'
      case 1: return 'text-gray-400'
      case 2: return 'text-amber-600'
      default: return ''
    }
  }

  const handleReveal = (id: number, index: number) => {
    setRevealedItems(prev => new Set([...prev, id]))
    
    // Trigger confetti for first place
    if (index === 0) {
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#FFD700', '#FFA500', '#FFD700']
        });
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#FFD700', '#FFA500', '#FFD700']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Top 5 Resolutions</CardTitle>
          <CardDescription>Click to reveal each resolution!</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            <AnimatePresence>
              {topResolutions.map((resolution, index) => (
                <motion.li
                  key={resolution.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                    ease: "easeOut"
                  }}
                  className="relative overflow-hidden"
                >
                  {!revealedItems.has(resolution.id) ? (
                    <Button
                      onClick={() => handleReveal(resolution.id, index)}
                      className="w-full h-24 flex items-center justify-between p-4 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0 w-12 text-center">
                          {index < 3 ? (
                            <Trophy className={`w-8 h-8 mx-auto ${getTrophyColor(index)}`} />
                          ) : (
                            <span className="text-2xl font-bold">{index + 1}</span>
                          )}
                        </div>
                        <span className="text-lg font-medium">Click to Reveal #{index + 1}</span>
                      </div>
                      <ChevronDown className="w-6 h-6" />
                    </Button>
                  ) : (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      className="flex items-center space-x-4 p-4 bg-gray-100 rounded-lg"
                    >
                      <div className="flex-shrink-0 w-12 text-center">
                        {index < 3 ? (
                          <Trophy className={`w-8 h-8 mx-auto ${getTrophyColor(index)}`} />
                        ) : (
                          <span className="text-2xl font-bold">{index + 1}</span>
                        )}
                      </div>
                      <div className="flex-grow">
                        <p className="font-medium">{resolution.name}</p>
                        <p className="text-sm text-gray-600">{resolution.resolution}</p>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className="text-sm font-medium">Rating</p>
                        <p className="text-lg font-bold">{resolution.average_rating.toFixed(2)}</p>
                      </div>
                    </motion.div>
                  )}
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
