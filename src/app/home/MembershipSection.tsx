"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const SubscriptionSection: React.FC = () => {
  return (
    <section
      className="bg-gradient-to-r from-gray-200/90 via-gray-100/90 to-gray-200/90 dark:from-black/90 dark:via-gray-900/90 dark:to-black/90
     text-black dark:text-white py-24 px-6 transition-colors duration-300"
    >
      <motion.div
        className="max-w-4xl w-full mx-auto text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
       <h2 className="text-3xl font-bold mb-4">Join Our Exclusive Membership</h2>
        <p className="text-xl mb-8">Enjoy premium benefits and access to our world-class facilities</p>
        <Button variant="secondary" size="lg">Become a Member</Button>
      </motion.div>
    </section>
  );
};

export default SubscriptionSection;