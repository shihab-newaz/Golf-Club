// app/admin/seed/page.tsx
"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, CheckCircle, XCircle, Trash } from "lucide-react"

export default function SeedPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })
  const [courseData, setCourseData] = useState<any>(null)

  // Function to seed the database
  const handleSeed = async () => {
    try {
      setIsLoading(true)
      setStatus({ type: null, message: '' })

      const response = await fetch('/api/seed/course', {
        method: 'POST',
      })
      const data = await response.json()

      if (response.ok) {
        setStatus({
          type: 'success',
          message: 'Database seeded successfully!'
        })
        // Fetch the current data after seeding
        fetchCurrentData()
      } else {
        throw new Error(data.error || 'Failed to seed database')
      }
    } catch (error: any) {
      setStatus({
        type: 'error',
        message: error.message
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Function to clear the database
  const handleClear = async () => {
    try {
      setIsLoading(true)
      setStatus({ type: null, message: '' })

      const response = await fetch('/api/seed/course', {
        method: 'DELETE',
      })
      const data = await response.json()

      if (response.ok) {
        setStatus({
          type: 'success',
          message: 'Database cleared successfully!'
        })
        setCourseData(null)
      } else {
        throw new Error(data.error || 'Failed to clear database')
      }
    } catch (error: any) {
      setStatus({
        type: 'error',
        message: error.message
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Function to fetch current data
  const fetchCurrentData = async () => {
    try {
      const response = await fetch('/api/seed/course')
      const data = await response.json()

      if (response.ok && data.data.course) {
        setCourseData(data.data)
      }
    } catch (error) {
      console.error('Error fetching current data:', error)
    }
  }

  // Fetch current data on component mount
  React.useEffect(() => {
    fetchCurrentData()
  }, [])

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Database Seeding Interface</h1>
      
      <div className="grid gap-6">
        {/* Status Alert */}
        {status.type && (
          <Alert variant={status.type === 'success' ? 'default' : 'destructive'}>
            {status.type === 'success' ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            <AlertTitle>
              {status.type === 'success' ? 'Success' : 'Error'}
            </AlertTitle>
            <AlertDescription>{status.message}</AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Database Actions</CardTitle>
            <CardDescription>
              Manage your database seeding operations
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Button
              onClick={handleSeed}
              disabled={isLoading}
              className="w-32"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Seed Database
            </Button>
            
            <Button
              onClick={handleClear}
              disabled={isLoading}
              variant="destructive"
              className="w-32"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash className="mr-2 h-4 w-4" />
              )}
              Clear Data
            </Button>
          </CardContent>
        </Card>

        {/* Current Data Display */}
        {courseData && (
          <Card>
            <CardHeader>
              <CardTitle>Current Database Status</CardTitle>
              <CardDescription>
                Overview of the current course data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Course Info:</h3>
                  <p>Name: {courseData.course.name}</p>
                  <p>Total Holes: {courseData.totalHoles}</p>
                  <p>Images: {courseData.course.imageUrls?.length || 0}</p>
                  <p>Hole Layouts: {courseData.course.holeLayouts?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}