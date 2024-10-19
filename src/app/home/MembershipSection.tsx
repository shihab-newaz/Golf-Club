"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const MembershipSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [blurAmount, setBlurAmount] = useState(8);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const intersectionRatio = entry.intersectionRatio;
          setBlurAmount(8 - intersectionRatio * 8);
        });
      },
      {
        threshold: new Array(101).fill(0).map((_, i) => i / 100),
        rootMargin: "0px 0px -100px 0px"
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <motion.section
      ref={sectionRef}
      className={`py-24 px-6 bg-gradient-to-r from-[#fae8b4]/90 to-[#e0cd95]/90 
                  dark:from-black/90 dark:via-gray-900/90 dark:to-black/90 
                  text-foreground-alt transition-all duration-300`}
      style={{
        filter: `blur(${blurAmount}px)`,
      }}
    >
      <div className="max-w-4xl w-full mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">
          Join Our Exclusive Membership
        </h2>
        <p className="text-xl mb-8">
          Enjoy premium benefits and access to our world-class facilities
        </p>
        <Button variant="secondary" size="lg" className="text-foreground">
          <Link href="/subscription">Become a Member</Link>
        </Button>
      </div>
    </motion.section>
  );
};

export default MembershipSection;