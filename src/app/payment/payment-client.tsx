// app/payment/PaymentClient.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Session } from "next-auth";

interface PaymentClientProps {
  initialSession: Session | null;
}

const PaymentClient: React.FC<PaymentClientProps> = ({ initialSession }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [tier, setTier] = useState("");
  const [price, setPrice] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [cvc, setCvc] = useState("");
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    const tierParam = searchParams.get("tier");
    if (tierParam) {
      setTier(tierParam);
      // Set price based on tier
      switch (tierParam) {
        case "Silver":
          setPrice("299");
          break;
        case "Gold":
          setPrice("399");
          break;
        case "Platinum":
          setPrice("499");
          break;
        default:
          setPrice("0");
      }
    }
    if (initialSession?.user) {
      setName(initialSession.user.name || "");
      setEmail(initialSession.user.email || "");
    }
  }, [searchParams, initialSession]);

  const handlePayment = async () => {
    try {
      // Call the update-user-tier API
      const response = await fetch("/api/update-user-tier", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, tier }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user tier");
      }

      toast({
        title: "Payment Successful",
        description: `You are now a ${tier} member!`,
        variant: "default",
      });
      router.push("/");
    } catch (error) {
      console.error("Error during payment:", error);
      toast({
        title: "Payment Failed",
        description: "An error occurred during payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-white/90 via-gray-200/90 to-white/90 dark:from-black/90 dark:via-gray-800/90 dark:to-black/90 p-4 transition-colors duration-300">
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-8">
        <Card className="flex-grow bg-white dark:bg-gray-800 text-black dark:text-white transition-colors duration-300">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-6">Checkout</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="border-gray-300 dark:border-gray-600 focus:border-black dark:focus:border-white"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="border-gray-300 dark:border-gray-600 focus:border-black dark:focus:border-white"
                />
              </div>
              <div>
                <Label htmlFor="membership">Membership</Label>
                <Select value={tier} onValueChange={setTier}>
                  <SelectTrigger
                    id="membership"
                    className="border-gray-300 dark:border-gray-600 focus:border-black dark:focus:border-white"
                  >
                    <SelectValue placeholder="Select membership" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Silver">Silver</SelectItem>
                    <SelectItem value="Gold">Gold</SelectItem>
                    <SelectItem value="Platinum">Platinum</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* ... (rest of the form fields) */}
              {paymentMethod === "credit" && (
                <>
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="Enter card number"
                      className="border-gray-300 dark:border-gray-600 focus:border-black dark:focus:border-white"
                    />
                  </div>
                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <Label htmlFor="expiry">Expiry</Label>
                      <div className="flex space-x-2">
                        <Select
                          value={expiryMonth}
                          onValueChange={setExpiryMonth}
                        >
                          <SelectTrigger
                            id="expiryMonth"
                            className="border-gray-300 dark:border-gray-600 focus:border-black dark:focus:border-white"
                          >
                            <SelectValue placeholder="Month" />
                          </SelectTrigger>
                          {/* ... (month options) */}
                        </Select>
                        <Select
                          value={expiryYear}
                          onValueChange={setExpiryYear}
                        >
                          <SelectTrigger
                            id="expiryYear"
                            className="border-gray-300 dark:border-gray-600 focus:border-black dark:focus:border-white"
                          >
                            <SelectValue placeholder="Year" />
                          </SelectTrigger>
                          {/* ... (year options) */}
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="cvc">CVC</Label>
                      <Input
                        id="cvc"
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value)}
                        placeholder="Enter CVC"
                        className="border-gray-300 dark:border-gray-600 focus:border-black dark:focus:border-white"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="w-full md:w-80 bg-white dark:bg-gray-800 text-black dark:text-white transition-colors duration-300">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">Membership Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Membership Type:</span>
                <span className="font-semibold">{tier}</span>
              </div>
              <div className="flex justify-between">
                <span>Membership Duration:</span>
                <span className="font-semibold">1 Year</span>
              </div>
              <div className="flex justify-between text-lg font-bold mt-4">
                <span>Total:</span>
                <span>${price}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentClient;
