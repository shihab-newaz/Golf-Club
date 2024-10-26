// app/admin/courses/client.tsx
'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { deleteCourse } from './actions'
import { Star, MapPin, Trees, TreePine, Droplets, Building2 } from 'lucide-react'

interface ICourse {
  _id: string
  name: string
  description: string
  layout: {
    totalHoles: number
    totalPar: number
    courseType: "lakeside" | "links" | "parkland" | "desert"
    terrain: string
    waterFeatures: {
      mainLake: boolean
      streams: boolean
      ponds: number
    }
  }
  facilities: {
    drivingRange: {
      available: boolean
      underRenovation: boolean
    }
    practice: {
      puttingGreen: boolean
      chippingArea: boolean
    }
    clubhouse: {
      available: boolean
      amenities: string[]
    }
  }
  holes: any[]
  overallRating: {
    difficulty: number
    maintenance: number
    scenic: number
  }
  gpsCoordinates: {
    latitude: number
    longitude: number
  }
  mainImageUrl: string
  holeLayouts: string[]
}

interface CourseListProps {
  initialCourses: ICourse[]
}

export default function CourseList({ initialCourses }: CourseListProps) {
  const [courses, setCourses] = useState<ICourse[]>(initialCourses)
  const [editingCourse, setEditingCourse] = useState<ICourse | null>(null)

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      await deleteCourse(id)
      setCourses(courses.filter(course => course._id !== id))
    }
  }

  const CourseCard = ({ course }: { course: ICourse }) => (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{course.name}</CardTitle>
            <CardDescription>{course.description}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setEditingCourse(course)}>
              Edit
            </Button>
            <Button variant="destructive" onClick={() => handleDelete(course._id)}>
              Delete
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="facilities">Facilities</TabsTrigger>
            <TabsTrigger value="ratings">Ratings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Trees className="h-4 w-4" />
                  <span>Holes: {course.layout.totalHoles}</span>
                </div>
                <div className="flex items-center gap-2">
                  <TreePine className="h-4 w-4" />
                  <span>Type: {course.layout.courseType}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>
                    GPS: {course.gpsCoordinates.latitude}, {course.gpsCoordinates.longitude}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4" />
                  <span>
                    Water Features: {course.layout.waterFeatures.ponds} ponds
                    {course.layout.waterFeatures.mainLake && ", main lake"}
                    {course.layout.waterFeatures.streams && ", streams"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  <span>Par: {course.layout.totalPar}</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="facilities">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Practice Facilities</h4>
                <ul className="space-y-1">
                  <li>Driving Range: {course.facilities.drivingRange.available ? "Available" : "Unavailable"}
                    {course.facilities.drivingRange.underRenovation && " (Under Renovation)"}
                  </li>
                  <li>Putting Green: {course.facilities.practice.puttingGreen ? "Yes" : "No"}</li>
                  <li>Chipping Area: {course.facilities.practice.chippingArea ? "Yes" : "No"}</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Clubhouse</h4>
                {course.facilities.clubhouse.available ? (
                  <ul className="space-y-1">
                    {course.facilities.clubhouse.amenities.map((amenity, index) => (
                      <li key={index}>{amenity}</li>
                    ))}
                  </ul>
                ) : (
                  <p>Currently Unavailable</p>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ratings">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span>Difficulty:</span>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < course.overallRating.difficulty
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span>Maintenance:</span>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < course.overallRating.maintenance
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span>Scenic:</span>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < course.overallRating.scenic
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-4">
      <ScrollArea className="h-[800px] w-full rounded-md border p-4">
        {courses.map((course) => (
          <CourseCard key={course._id} course={course} />
        ))}
      </ScrollArea>
    </div>
  )
}