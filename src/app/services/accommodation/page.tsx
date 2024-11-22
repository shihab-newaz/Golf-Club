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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Building2, Hotel, HomeIcon, Warehouse } from "lucide-react";

const accommodations = [
  { name: "AD Twin Houses", units: 6, additionalFee: 10000 },
  { name: "AD House Deluxe Room", units: 7, additionalFee: 10000 },
  { name: "Lakeside BD House", units: 5, additionalFee: 10000 },
  { name: "GG. Residence", units: 7, additionalFee: 0 },
  { name: "Somjit Residence", units: 16, additionalFee: 0 },
  { name: "SP Resort", units: 10, additionalFee: 0 },
  { name: "SP Resort VIP1, VIP2", units: 2, additionalFee: 10000 },
  { name: "Woody House", units: 5, additionalFee: 10000 },
  { name: "KHR (Kidney Hospital Residences)", units: 6, additionalFee: 0 },
  { name: "BANN HOME RESORT", units: 4, additionalFee: 10000 },
  { name: "RIMPAO HOTEL", units: 30, additionalFee: 20000 },
  { name: "YOUR PLACE HOTEL", units: 30, additionalFee: 20000 },
];

const AccommodationFeatureCard = ({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
}) => (
  <Card className="bg-white/5 backdrop-blur-sm border-none hover:shadow-lg transition-shadow duration-200">
    <CardContent className="p-4 md:p-6 flex flex-col items-center text-center">
      <Icon className="w-8 h-8 md:w-12 md:h-12 mb-3 md:mb-4 text-green-500" />
      <h3 className="text-lg md:text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
        {description}
      </p>
    </CardContent>
  </Card>
);

const MobileAccommodationCard = ({
  accommodation,
}: {
  accommodation: { name: string; units: number; additionalFee: number };
}) => (
  <Card className="mb-4">
    <CardContent className="p-4">
      <h3 className="font-medium text-lg mb-2">{accommodation.name}</h3>
      <div className="flex justify-between text-sm">
        <span>Units: {accommodation.units}</span>
        <span className="text-right">
          {accommodation.additionalFee === 0
            ? "No additional fee"
            : `${accommodation.additionalFee.toLocaleString()}₩`}
        </span>
      </div>
    </CardContent>
  </Card>
);

const AccommodationPage = () => {
  const totalUnits = accommodations.reduce((sum, acc) => sum + acc.units, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="pt-20 md:pt-24 pb-8 md:pb-12 px-4">
        <div className="container mx-auto text-center">
          <motion.h1
            className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 text-green-800 dark:text-green-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Luxury Accommodations
          </motion.h1>
          <motion.p
            className="text-base md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Choose from our {totalUnits} premium lodging units spread across
            various luxurious properties
          </motion.p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8 md:py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <AccommodationFeatureCard
              icon={Hotel}
              title="Multiple Options"
              description="Choose from various accommodation types"
            />
            {/* ... other feature cards */}
          </div>
        </div>
      </section>

      {/* Accommodations List/Table */}
      <section className="py-8 md:py-12 px-4">
        <div className="container mx-auto">
          <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl">
                Available Accommodations
              </CardTitle>
              <CardDescription className="text-sm md:text-base">
                Complete list of our lodging options and their details
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Mobile View */}
              <div className="md:hidden">
                {accommodations.map((acc, index) => (
                  <MobileAccommodationCard key={index} accommodation={acc} />
                ))}
                <Card className="bg-gray-50 dark:bg-gray-700">
                  <CardContent className="p-4">
                    <div className="flex justify-between font-bold">
                      <span>Total Units</span>
                      <span>{totalUnits}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Desktop View */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Accommodation</TableHead>
                      <TableHead className="text-center">
                        Available Units
                      </TableHead>
                      <TableHead className="text-right">
                        Additional Fee (₩)
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accommodations.map((acc, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {acc.name}
                        </TableCell>
                        <TableCell className="text-center">
                          {acc.units}
                        </TableCell>
                        <TableCell className="text-right">
                          {acc.additionalFee === 0
                            ? "No additional fee"
                            : `${acc.additionalFee.toLocaleString()}₩`}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="font-bold">
                      <TableCell>Total</TableCell>
                      <TableCell className="text-center">
                        {totalUnits} Units
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Note Section */}
      <section className="py-8 md:py-12 px-4">
        <div className="container mx-auto">
          <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700">
            <CardContent className="p-4 md:p-6">
              <p className="text-sm md:text-base text-yellow-800 dark:text-yellow-200">
                Note: Additional fees are charged per room
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default AccommodationPage;
