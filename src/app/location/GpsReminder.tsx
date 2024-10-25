"use client";
import React, { useState, useEffect } from 'react';
import { Smartphone, Navigation2Off } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

const GPSReminder = () => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if device is mobile only on client side
    const checkMobile = () => {
      const userAgent = window.navigator.userAgent;
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      setIsMobile(mobile);
    };

    checkMobile();
  }, []);

  if (!isMobile || isDismissed) return null;

  return (
    <Alert className="mb-4 animate-fade-in">
      <Navigation2Off className="h-5 w-5" />
      <AlertTitle className="flex items-center gap-2">
        <Smartphone className="h-4 w-4" />
        Enable Location Services
      </AlertTitle>
      <AlertDescription className="mt-2">
        <p className="mb-3">
          Please ensure your device's GPS/Location Services are turned on to use location tracking. 
          You can usually find this in your device's:
        </p>
        <ul className="list-disc list-inside mb-3 space-y-1">
          <li>Quick Settings panel (swipe down)</li>
          <li>Settings → Privacy/Location</li>
          <li>Settings → GPS/Location Services</li>
        </ul>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setIsDismissed(true)}
          className="mt-2"
        >
          Got it, thanks!
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default GPSReminder;