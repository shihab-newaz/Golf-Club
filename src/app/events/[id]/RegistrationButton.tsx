// app/events/[id]/RegistrationButton.tsx
'use client'

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { registerForEvent, unregisterFromEvent } from './actions';

interface RegistrationButtonProps {
  event: {
    _id: string;
    registeredUsers: string[];
    capacity: number;
  };
  className?: string;
}

export default function RegistrationButton({ event, className }: RegistrationButtonProps) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const isRegistered = session?.user?.id && event.registeredUsers.includes(session.user.id);
  const isFull = event.registeredUsers.length >= event.capacity;

  const handleRegistration = async () => {
    if (!session) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to register for events",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      if (isRegistered) {
        await unregisterFromEvent(event._id, session.user.id);
        toast({
          title: "Successfully Unregistered",
          description: "You have been removed from the event",
        });
      } else {
        await registerForEvent(event._id, session.user.id);
        toast({
          title: "Registration Successful",
          description: "You have been registered for the event",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process registration",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      size="lg"
      className={className}
      onClick={handleRegistration}
      disabled={isFull && !isRegistered || isLoading}
    >
      {isLoading ? "Processing..." : 
       isRegistered ? "Cancel Registration" :
       isFull ? "Event Full" : 
       "Register Now"}
    </Button>
  );
}