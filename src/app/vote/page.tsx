"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'

interface Resolution {
  id: number;
  resolution: string;
}

export default function VotePage() {
  const [resolutions, setResolutions] = useState<Resolution[]>([])
  const [currentResolution, setCurrentResolution] = useState<Resolution | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchResolutions()
  }, [])

  const fetchResolutions = async () => {
    const response = await fetch('/api/resolutions')
    const data = await response.json()
    setResolutions(data)
    setCurrentResolution(data[Math.floor(Math.random() * data.length)] || null)
  }

  const handleVote = async (rating: number) => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resolution_id: currentResolution?.id, rating }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to submit vote')
      }

      toast({
        title: "Vote Submitted",
        description: "Your vote has been recorded successfully!",
      })

      const remainingResolutions = resolutions.filter(r => r.id !== currentResolution?.id)
      setResolutions(remainingResolutions)
      
      if (remainingResolutions.length === 0) {
        setIsCompleted(true)
        setCurrentResolution(null)
      } else {
        setCurrentResolution(remainingResolutions[Math.floor(Math.random() * remainingResolutions.length)])
      }
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <AnimatePresence mode="wait">
        {isCompleted ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            key="completion"
          >
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>All Done! 🎉</CardTitle>
                <CardDescription>You&apos;ve voted on all available resolutions</CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key={currentResolution?.id || 'loading'}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Vote on Resolutions</CardTitle>
                <CardDescription>Rate other people&apos;s New Year&apos;s resolutions</CardDescription>
              </CardHeader>
              <CardContent>
                {currentResolution ? (
                  <div className="space-y-4">
                    <p className="text-lg font-medium">{currentResolution.resolution}</p>
                    <div className="flex justify-between">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <Button 
                          key={rating} 
                          onClick={() => handleVote(rating)}
                          disabled={isLoading}
                        >
                          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : rating}
                        </Button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p>Loading resolutions...</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
