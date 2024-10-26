"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const MembershipSection: React.FC = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className={`
        min-h-[60vh] 
        flex items-center justify-center
        bg-gradient-to-r from-[#fae8b4]/90 to-[#e0cd95]/90 
        dark:from-black/90 dark:via-gray-900/90 dark:to-black/90 
        text-foreground
        px-4 sm:px-6 md:px-8
        py-12 md:py-16
      `}
    >
      <div className="max-w-4xl w-full mx-auto text-center space-y-6 md:space-y-8">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold"
        >
          Join Our Exclusive Membership
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg sm:text-xl md:text-2xl max-w-2xl mx-auto"
        >
          Enjoy premium benefits and access to our world-class facilities
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="pt-4"
        >
          <Link href="/subscription">
            <Button 
              variant="secondary" 
              size="lg" 
              className="
                text-foreground
                px-8 py-6 
                text-lg
                hover:scale-105 
                transition-transform 
                duration-200
                shadow-lg
                hover:shadow-xl
              "
            >
              Become a Member
            </Button>
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default MembershipSection;