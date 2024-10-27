// app/about/page.tsx
"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
// import { Button } from "@/components/ui/button";
import {
  Mail,
  Phone,
  MapPin,
  Hospital,
  Siren,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AboutPage: React.FC = () => {
  const staffMembers = [
    {
      name: "John Smith",
      position: "Head Golf Professional",
      image: "/placeholder.svg",
    },
    {
      name: "Sarah Johnson",
      position: "Membership Director",
      image: "/placeholder.png",
    },
    {
      name: "Michael Brown",
      position: "Course Superintendent",
      image: "/placeholder.svg",
    },
    {
      name: "Emily Davis",
      position: "Events Coordinator",
      image: "/placeholder.png",
    },
  ];

  const emergencyServices = [
    {
      name: "City General Hospital",
      type: "Hospital",
      distance: "3.2 miles",
      icon: Hospital,
    },
    {
      name: "Central Police Station",
      type: "Police",
      distance: "2.5 miles",
      icon: Siren,
    },
    {
      name: "Greenville Fire Department",
      type: "Fire Station",
      distance: "1.8 miles",
      icon: AlertTriangle,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen w-full bg-green-50 dark:bg-gray-900">
      <header className="bg-green-50 dark:bg-gray-900 text-green-800 dark:text-white mt-20 text-center">
        <h1 className="text-4xl font-bold">Daeho Golf & Country Club</h1>
      </header>
      <main className="container mx-auto px-4 py-8 space-y-12">
        {/* About Section */}
        <motion.section
          className="flex flex-col md:flex-row items-center gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="md:w-1/2">
            <h2 className="text-3xl font-semibold mb-4 text-green-800 dark:text-green-400">
              About Us
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300">
             Daeho Golf & Country Club is a premier destination for golf
              enthusiasts and those seeking a luxurious retreat. Established in
              1975, our club boasts a championship 18-hole golf course,
              state-of-the-art facilities, and a vibrant community of members.
              Nestled in the heart of lush landscapes, we offer an unparalleled
              golfing experience combined with top-notch amenities and services.
            </p>
          </div>
          <div className="md:w-1/2">
            <Image
              src="/clubhouse.jpg"
              alt="Evergreen Golf & Country Club"
              width={600}
              height={400}
              className="rounded-lg shadow-lg"
            />
          </div>
        </motion.section>

        {/* Vision Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col md:flex-row items-center gap-8"
        >
          <div className="md:w-1/3">
            <Image
              src="/placeholder.svg"
              alt="CEO"
              width={300}
              height={400}
              className="rounded-lg shadow-lg"
            />
          </div>
          <div className="md:w-2/3">
            <h2 className="text-3xl font-semibold mb-4 text-green-800 dark:text-green-400">CEO's Vision</h2>
            <Card>
              <CardHeader>
                <CardTitle>A Message from Our CEO, Mr.X</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300">
                  "At Daeho Golf & Country Club, we envision more than just a golf course. We're creating a community 
                  where passion for the sport meets luxury living. Our goal is to provide an exceptional experience for 
                  every member and guest, fostering a sense of belonging and pride. We're committed to maintaining the 
                  highest standards in course conditions, customer service, and environmental stewardship. As we look to 
                  the future, we aim to be at the forefront of innovation in the golfing world while preserving the 
                  timeless traditions that make this sport so special."
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.section>

        {/* Staff Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h2 className="text-3xl font-semibold mb-4 text-green-800 dark:text-green-400">
            Our Staff
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {staffMembers.map((staff, index) => (
              <Card key={index}>
                <CardContent className="flex flex-col items-center p-6">
                  <Image
                    src={staff.image}
                    alt={staff.name}
                    width={100}
                    height={100}
                    className="rounded-full mb-4"
                  />
                  <h3 className="font-semibold text-lg">{staff.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {staff.position}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.section>

        {/* Emergency Services Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h2 className="text-3xl font-semibold mb-4 text-green-800 dark:text-green-400">
            Nearby Emergency Services
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {emergencyServices.map((service, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <service.icon className="mr-2" />
                    {service.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400">
                    {service.type}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Distance: {service.distance}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.section>

        {/* Contact Information Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <h2 className="text-3xl font-semibold mb-4 text-green-800 dark:text-green-400">
            Contact Information
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="mr-2" />
                  Phone
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>(+66) 99 065 6994</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="mr-2" />
                  Email
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>info@daehocc.com</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="mr-2" />
                  Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>123 Fairway Lane, Greenville, GS 12345</p>
              </CardContent>
            </Card>
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default AboutPage;
