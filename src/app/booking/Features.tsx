// app/booking/Features.tsx
import React from "react";
import { motion } from "framer-motion";
import { ClubIcon, MapPin, Users } from "lucide-react";

export default function Features() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="text-white space-y-6"
    >
      <h2 className="text-3xl font-bold">
        Why Choose Daeho Country Club
      </h2>
      <ul className="space-y-4">
        <li className="flex items-start">
          <MapPin className="mr-2 mt-1 flex-shrink-0" />
          <span>
            Nestled in the breathtaking Jeju Island, offering stunning
            views and a serene environment.
          </span>
        </li>
        <li className="flex items-start">
          <ClubIcon className="mr-2 mt-1 flex-shrink-0" />
          <span>
            Championship 18-hole course designed by renowned architect
            Tom Fazio.
          </span>
        </li>
        <li className="flex items-start">
          <Users className="mr-2 mt-1 flex-shrink-0" />
          <span>
            Professional staff dedicated to ensuring an unparalleled
            golfing experience.
          </span>
        </li>
      </ul>
    </motion.div>
  );
}