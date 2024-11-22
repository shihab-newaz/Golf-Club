"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Landmark,
  TreePine,
  Church,
  Amphora,
  Mountain,
  Waves,
  Music,
  Shirt,
  Calendar,
} from "lucide-react";

// Categories and their attractions
const categories = {
  historical: {
    icon: Landmark,
    title: "Historical Sites",
    attractions: [
      {
        name: "Phraya Chaisunthon Monument",
        description:
          "Life-sized bronze monument in a standing position, holding a teapot and magic sword.",
      },
      {
        name: "Wat Klang",
        description:
          "Temple featuring an ubosot building and a black bronze Buddha image used in rain-making ceremonies.",
      },
      {
        name: "Wat Si Bun Rueang",
        description:
          "Temple housing crafted boundary stones from Fa Daet Song Yang ancient city, featuring beautiful Dvaravati art.",
      },
      {
        name: "Mueang Fa Daet Song Yang",
        description:
          "Ancient town with religious ruins and sandstone boundary markers featuring bas-reliefs.",
      },
    ],
  },
  nature: {
    icon: TreePine,
    title: "Natural Attractions",
    attractions: [
      {
        name: "Lam Pao Wildlife Conservation",
        description:
          "Abundant deciduous dipterocarp forest with an open zoo featuring indigenous wildlife and nature trails.",
      },
      {
        name: "Phu Phra Forest Park",
        description:
          "Mountain park featuring ancient stone Buddha images, caves, and cliff formations.",
      },
      {
        name: "Namtok Pha Nang Khoi",
        description:
          "Huge waterfall cascading from the Phu Phan mountain range, surrounded by thick forest.",
      },
      {
        name: "Phu Faek Forest Park",
        description:
          "Hilly countryside with dipterocarp forest and visible dinosaur footprints.",
      },
    ],
  },
  cultural: {
    icon: Amphora,
    title: "Cultural Sites",
    attractions: [
      {
        name: "Kalasin Museum",
        description:
          "Museum showcasing the best collections from Kalasin Province.",
      },
      {
        name: "Ban Phokhru Plueang",
        description:
          "Traditional music school displaying northeastern musical instruments like phin, khaen, and pong lang.",
      },
      {
        name: "Phu Thai Cultural Village",
        description:
          "Small hillside village showcasing the lifestyle of the Phu Thai ethnic group.",
      },
      {
        name: "Sirindhorn Museum",
        description:
          "Houses over 700 fossilized dinosaur bones from seven specimens.",
      },
    ],
  },
  events: {
    icon: Calendar,
    title: "Local Events",
    attractions: [
      {
        name: "Kalasin Pong Lang Festival",
        description:
          "Annual February festival featuring parades, cultural competitions, and beauty pageants.",
      },
      {
        name: "Wichit Phrae Wa Silk Festival",
        description:
          "Annual August 12 event honoring Queen Sirikit and celebrating local silk craftsmanship.",
      },
    ],
  },
};
interface AttractionCardProps {
  name: string;
  description: string;
}

const AttractionCard = ({ name, description }: AttractionCardProps) => (
  <Card className="h-full">
    <CardHeader>
      <CardTitle className="text-lg">{name}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </CardContent>
  </Card>
);

const AttractionsPage = () => {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-24 md:py-32">
          {/* Hero Section */}
          <motion.div
            className="text-center mb-8 md:mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 text-green-800 dark:text-green-400">
              Local Attractions
            </h1>
            <p className="text-base md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
              Discover the rich cultural heritage, natural wonders, and exciting events around our club
            </p>
          </motion.div>
  
          {/* Attractions Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full max-w-6xl mx-auto"
          >
            <Tabs defaultValue="historical" className="w-full">
              <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 bg-transparent mb-6">
                {Object.entries(categories).map(([key, category]) => (
                  <TabsTrigger
                    key={key}
                    value={key}
                    className="flex items-center gap-2 data-[state=active]:bg-green-600 data-[state=active]:text-white px-2 py-1 md:px-4 md:py-2"
                  >
                    <category.icon className="h-4 w-4 hidden md:inline" />
                    <span className="text-xs md:text-sm">
                      {window.innerWidth < 768 ? category.title : ""} 
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>
  
              {Object.entries(categories).map(([key, category]) => (
                <TabsContent key={key} value={key}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {category.attractions.map((attraction, index) => (
                      <AttractionCard
                        key={index}
                        name={attraction.name}
                        description={attraction.description}
                      />
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </motion.div>
  
          {/* Additional Information */}
          <motion.div
            className="mt-8 md:mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-green-50 dark:bg-green-900/20">
              <CardContent className="p-4 md:p-6">
                <p className="text-sm md:text-base text-green-800 dark:text-green-200">
                  Our concierge service can help arrange visits to any of these attractions. 
                  Please contact the front desk for more information and transportation arrangements.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  };
  
  export default AttractionsPage;