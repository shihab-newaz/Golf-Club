// app/booking/page.tsx
'use client'

import { useRouter } from 'next/navigation'
import { BookingForm } from './form'
import { TeeTimeBooking } from './types'
import { bookTeeTime } from './actions'
import { useToast } from "@/hooks/use-toast"

export default function BookingPage() {
  const router = useRouter()
  const { toast } = useToast()

  const handleBookingComplete = async (bookingDetails: TeeTimeBooking) => {
    try {
      const result = await bookTeeTime(bookingDetails)
      if (result.success) {
        toast({
          title: "Success",
          description: "Your tee time has been booked successfully!",
        })
        router.push('/booking')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to book tee time. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <main className="min-h-screen py-8 bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto">
        <BookingForm onComplete={handleBookingComplete} />
      </div>
    </main>
  )
}