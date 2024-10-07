import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

const tiers = [
  {
    name: 'Silver',
    price: '$500',
    description: 'Perfect for casual golfers',
    features: ['Weekday access', '10% Pro shop discount', '1 guest pass/month'],
  },
  {
    name: 'Gold',
    price: '$1000',
    description: 'Ideal for regular players',
    features: ['Full course access', '20% Pro shop discount', '3 guest passes/month', 'Access to tournaments'],
  },
  {
    name: 'Platinum',
    price: '$2000',
    description: 'The ultimate golf experience',
    features: ['Priority tee times', '30% Pro shop discount', 'Unlimited guest passes', 'Personal locker', 'Exclusive events'],
  },
];

const SubscriptionTiers = () => {

  return (
    <section className="py-24 bg-gradient-to-r from-white/90 via-gray-200/90 to-white/90 
    dark:from-black dark:via-gray-900 dark:to-black transition-colors duration-300">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-4xl font-bold text-center mb-12 text-black dark:text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Membership Tiers
        </motion.h2>

        {/* Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="flex flex-col h-full bg-gray-500/50 dark:bg-black/40 text-black dark:text-white transition-colors duration-300">
                <CardHeader>
                  <CardTitle>{tier.name}</CardTitle>
                  <CardDescription className="dark:text-gray-300">{tier.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-3xl font-bold mb-6">{tier.price}<span className="text-sm font-normal">/year</span></p>
                  <ul className="space-y-2">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full bg-black dark:bg-white text-white dark:text-black 
                               hover:bg-gray-800 dark:hover:bg-gray-200 
                               border border-transparent hover:border-white dark:hover:border-black 
                               transition-all duration-300 ease-in-out
                               font-semibold tracking-wide uppercase"
                  >
                    Choose {tier.name}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SubscriptionTiers;