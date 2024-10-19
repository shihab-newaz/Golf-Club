"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

const LocationSection: React.FC = () => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  const centerLat = 16.425;
  const centerLng = 103.275; 
  const golfClubName = "Bueng Aram Golf & Country Club";
  const golfClubAddress = "Yang Talat District, Kalasin 46120, Thailand";

  const handleOpenGoogleMaps = () => {
    const encodedName = encodeURIComponent(golfClubName);
    const encodedAddress = encodeURIComponent(golfClubAddress);
    const url = `https://www.google.com/maps/search/?api=1&query=${encodedName}+${encodedAddress}`;
    window.open(url, '_blank');
  };

  return (
    <section className="bg-gradient-to-r from-white to-white dark:from-gray-900 dark:to-black/60 py-8 text-black dark:text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
          Our Location
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="location-info bg-amber-200/20 dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              {golfClubName}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Tambon Yang Talat
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              {golfClubAddress}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              <strong>Phone:</strong> +66 42-123-4567
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              <strong>Email:</strong> info@buengaramgolf.com
            </p>
            <h3 className="text-xl font-semibold mt-6 mb-4 text-gray-800 dark:text-white">
              Hours of Operation
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Monday - Sunday: 6:00 AM - 7:00 PM
            </p>
            <Button
              onClick={handleOpenGoogleMaps}
              className="mt-6 bg-green-600 hover:bg-green-700 text-white"
            >
              <MapPin className="mr-2 h-4 w-4" /> Open in Google Maps
            </Button>
          </div>
          <div className="location-map h-[400px] md:h-full bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md overflow-hidden">
            <iframe
              src={`https://www.google.com/maps/embed/v1/place?key=${apiKey}&center=${centerLat},${centerLng}&q=Bueng+Aram+Golf+%26+Country+Club,Yang+Talat+District,Kalasin,Thailand&zoom=13`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;