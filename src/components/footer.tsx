"use client";
import React from "react";
import { Facebook, Instagram, Twitter, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer: React.FC = () => {

  return (
    <footer className="bg-white dark:bg-black text-black dark:text-white py-12 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Company Info */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-full border-2 border-black dark:border-white flex items-center justify-center">
                <span className="text-black dark:text-white font-bold">GC</span>
              </div>
              <span className="text-black dark:text-white font-semibold">
                GOLF CLUB
              </span>
            </div>
            <p className="text-sm">Luxury without limits</p>
          </div>

          {/* Links Column 1 */}
          <div className="col-span-1">
            <h3 className="font-bold mb-4">Explore</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="hover:text-gray-600 dark:hover:text-gray-300"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-gray-600 dark:hover:text-gray-300"
                >
                  Membership
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-gray-600 dark:hover:text-gray-300"
                >
                  Facilities
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-gray-600 dark:hover:text-gray-300"
                >
                  Events
                </a>
              </li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div className="col-span-1">
            <h3 className="font-bold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="hover:text-gray-600 dark:hover:text-gray-300"
                >
                  Golf Lessons
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-gray-600 dark:hover:text-gray-300"
                >
                  Pro Shop
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-gray-600 dark:hover:text-gray-300"
                >
                  Dining
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-gray-600 dark:hover:text-gray-300"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div className="col-span-1">
            <h3 className="font-bold mb-4">Stay Connected</h3>
            <p className="mb-4">
              Subscribe to our newsletter for exclusive offers and updates.
            </p>
            <div className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-gray-100 dark:bg-gray-800 text-black dark:text-white px-4 py-2 rounded-md w-full"
              />
              <Button className="bg-black dark:bg-white text-white dark:text-black rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 w-3/4 transition-colors duration-300">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Social Media and Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-300 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-4 mb-4 md:mb-0">
            <a
              href="#"
              className="text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-300"
            >
              <Facebook size={20} />
            </a>
            <a
              href="#"
              className="text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-300"
            >
              <Instagram size={20} />
            </a>
            <a
              href="#"
              className="text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-300"
            >
              <Twitter size={20} />
            </a>
            <a
              href="#"
              className="text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-300"
            >
              <Mail size={20} />
            </a>
          </div>
          <p className="text-sm">&copy; 2024 Golf Club. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
