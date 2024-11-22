"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car, Bus, Train, Plane, Clock, MapPin, Phone, ArrowRight, LucideIcon } from "lucide-react";

// Define interfaces for our data structures
interface TransportMethod {
  icon: LucideIcon;
  title: string;
  details: string[];
}

interface TransportCardProps {
  icon: LucideIcon;
  title: string;
  details: string[];
}

// Transport methods data
const transportMethods: TransportMethod[] = [
  {
    icon: Car,
    title: "By Car",
    details: [
      "Distance: 519 km from Bangkok",
      "Route: Bangkok → Saraburi → Korat (Hwy 2) → Ban Phai",
      "Continue on Hwy 23 and 213 → Hwy 209 (Maha Sarakham-Kalasin)"
    ]
  },
  {
    icon: Bus,
    title: "By Bus",
    details: [
      "The Transport Co., Ltd. provides daily services from Bangkok to Kalasin",
      "Available at Northeastern Bus Terminal (Mo Chit 2)",
      "Contact: +66 2 9362841-48, +66 2 9362852-66",
      "Minivan from Khon Kaen bus station: 80 baht (1 hour journey)"
    ]
  },
  {
    icon: Train,
    title: "By Train",
    details: [
      "Take train from Bangkok to Khon Kaen",
      "Then catch a bus from Khon Kaen to Kalasin (75 km)",
      "Services: Rapid, Express, and Air-conditioned Sprinter trains",
      "Contact SRT: Tel. 1690 or +66 2 2204334",
      "Khon Kaen Railway Station: +66 43 221112"
    ]
  },
  {
    icon: Plane,
    title: "By Air",
    details: [
      "20+ daily flights from Suwanabhumi Airport to Khonkaen",
      "Flight duration: ~1 hour 10 minutes",
      "Club arranges minibus transfer from Khonkaen Airport (1 hour journey)"
    ]
  }
];

const TransportCard: React.FC<TransportCardProps> = ({ icon: Icon, title, details }) => (
  <Card className="h-full bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all duration-200">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
        <Icon className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <ul className="space-y-2">
        {details.map((detail, index) => (
          <li key={index} className="flex items-start gap-2 text-sm md:text-base text-gray-600 dark:text-gray-300">
            <ArrowRight className="h-4 w-4 mt-1 flex-shrink-0 text-green-500" />
            <span>{detail}</span>
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

const LocationSection: React.FC = () => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  const centerLat = 16.425;
  const centerLng = 103.275; 
  const golfClubName = "Bueng Aram Golf & Country Club";
  const golfClubAddress = "Yang Talat District, Kalasin 46120, Thailand";

  const handleOpenGoogleMaps = (): void => {
    const encodedName = encodeURIComponent(golfClubName);
    const encodedAddress = encodeURIComponent(golfClubAddress);
    const url = `https://www.google.com/maps/search/?api=1&query=${encodedName}+${encodedAddress}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-gradient-to-r from-white to-white dark:from-gray-900 dark:to-black/60 py-8">
      <div className="container mx-auto px-4">
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
    </div>
  );
};

const LocationPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-24 md:py-32">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 text-green-800 dark:text-green-400">
            How to Reach Us
          </h1>
          <p className="text-base md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Multiple convenient transportation options to reach Bueng Aram Golf & Country Club
          </p>
        </motion.div>

        {/* Map Section */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <LocationSection />
        </motion.div>

        {/* Transportation Options */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {transportMethods.map((method, index) => (
            <TransportCard
              key={index}
              icon={method.icon}
              title={method.title}
              details={method.details}
            />
          ))}
        </motion.div>

        {/* Additional Information */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-4 md:p-6">
              <p className="text-sm md:text-base text-blue-800 dark:text-blue-200">
                For assistance with transportation arrangements or directions, please contact our concierge service.
                We can help arrange airport transfers and local transportation as needed.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default LocationPage;