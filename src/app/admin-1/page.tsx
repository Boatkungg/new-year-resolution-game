"use client"

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useToast } from '@/hooks/use-toast'

interface Resolution {
  id: number;
  name: string;
  resolution: string;
  vote_count: number;
  average_rating: number;
}

interface Settings {
  allow_submissions: 'true' | 'false';
  allow_voting: 'true' | 'false';
}

export default function AdminPage() {
  const [resolutions, setResolutions] = useState<Resolution[]>([])
  const [settings, setSettings] = useState<Settings>({ allow_submissions: 'true', allow_voting: 'true' })
  const { toast } = useToast()

  useEffect(() => {
    const fetchInitialData = async () => {
      await Promise.all([
        fetchResolutions(),
        fetchSettings()
      ]);
    };
    
    if (process.env.NEXT_PUBLIC_ADMIN_TOKEN) {
      fetchInitialData();
    }
  }, []); // Run only once on mount

  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_TOKEN}`,
    };
    const response = await fetch(url, { ...options, headers });
    if (response.status === 401) {
      throw new Error('Unauthorized - Invalid admin token');
    }
    return response;
  }

  const fetchResolutions = async () => {
    try {
      const response = await fetchWithAuth('/api/admin/resolutions')
      const data = await response.json()
      setResolutions(data)
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      })
    }
  }

  const fetchSettings = async () => {
    try {
      const response = await fetchWithAuth('/api/admin/settings')
      const data = await response.json()
      setSettings(data)
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const response = await fetchWithAuth('/api/admin/resolutions', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      })

      if (!response.ok) {
        throw new Error('Failed to delete resolution')
      }

      toast({
        title: "Resolution Deleted",
        description: "The resolution has been deleted successfully.",
      })
      fetchResolutions()
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      })
    }
  }

  const handleToggleSetting = async (key: string) => {
    try {
      const newValue = settings[key as keyof Settings] === 'true' ? 'false' : 'true'
      const response = await fetchWithAuth('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key, value: newValue }),
      })

      if (!response.ok) {
        throw new Error(`Failed to update ${key} setting`)
      }

      setSettings(prev => ({ ...prev, [key]: newValue }))
      toast({
        title: "Setting Updated",
        description: `${key.replace('_', ' ')} has been ${newValue === 'true' ? 'enabled' : 'disabled'}.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle>Admin Dashboard</CardTitle>
          <CardDescription>Manage resolutions and settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Allow Submissions</span>
              <Switch
                checked={settings.allow_submissions === 'true'}
                onCheckedChange={() => handleToggleSetting('allow_submissions')}
              />
            </div>
            <div className="flex justify-between items-center">
              <span>Allow Voting</span>
              <Switch
                checked={settings.allow_voting === 'true'}
                onCheckedChange={() => handleToggleSetting('allow_voting')}
              />
            </div>
          </div>
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Resolutions</h3>
            <div className="space-y-4">
              {resolutions.map((resolution) => (
                <div key={resolution.id} className="flex justify-between items-center p-4 bg-gray-100 rounded-lg">
                  <div>
                    <p className="font-medium">{resolution.name}</p>
                    <p className="text-sm text-gray-600">{resolution.resolution}</p>
                    <p className="text-sm text-gray-500">
                      Votes: {resolution.vote_count} | Average Rating: {resolution.average_rating?.toFixed(2) || 'N/A'}
                    </p>
                  </div>
                  <Button variant="destructive" onClick={() => handleDelete(resolution.id)}>Delete</Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
