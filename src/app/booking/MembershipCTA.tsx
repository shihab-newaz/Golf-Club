// app/booking/MembershipCTA.tsx
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function MembershipCTA() {
  return (
    <section className="bg-background-alt text-emerald-900 dark:text-white py-16">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-4">
            Ready to Join Daeho Country Club?
          </h2>
          <p className="mb-6">
            Become a member today and unlock exclusive benefits and
            privileges.
          </p>
          <Button
            variant="outline"
            className="text-white bg-green-800 border-white hover:bg-white hover:text-green-800"
          >
            <Link href="/subscription">
              Explore Memberships 
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}