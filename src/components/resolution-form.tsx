"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { useToast } from '@/hooks/use-toast'

export default function ResolutionForm() {
  const [name, setName] = useState('')
  const [resolution, setResolution] = useState('')
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/resolutions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, resolution }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to submit resolution')
      }

      toast({
        title: "Resolution Submitted",
        description: "Your New Year's resolution has been submitted successfully!",
      })
      setName('')
      setResolution('')
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Enter your name..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Textarea
        placeholder="Enter your New Year's resolution..."
        value={resolution}
        onChange={(e) => setResolution(e.target.value)}
        required
      />
      <Button type="submit" className="w-full">Submit Resolution</Button>
    </form>
  )
}
