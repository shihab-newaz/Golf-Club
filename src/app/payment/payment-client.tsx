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
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-r from-white/90 via-gray-200/90
     to-white/90 dark:from-black/90 dark:via-gray-800/90 dark:to-black/90 p-4 transition-colors duration-300"
    >
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
                />
              </div>
              <div>
                <Label htmlFor="membership">Membership</Label>
                <Select value={tier} onValueChange={setTier}>
                  <SelectTrigger id="membership">
                    <SelectValue placeholder="Select membership" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Silver">Silver</SelectItem>
                    <SelectItem value="Gold">Gold</SelectItem>
                    <SelectItem value="Platinum">Platinum</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Payment Method</Label>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="credit" id="credit" />
                    <Label htmlFor="credit">Credit Card</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <Label htmlFor="paypal">PayPal</Label>
                  </div>
                </RadioGroup>
              </div>
              {paymentMethod === "credit" && (
                <>
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="Enter card number"
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
                          <SelectTrigger id="expiryMonth">
                            <SelectValue placeholder="Month" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(
                              (month) => (
                                <SelectItem
                                  key={month}
                                  value={month.toString().padStart(2, "0")}
                                >
                                  {month.toString().padStart(2, "0")}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                        <Select
                          value={expiryYear}
                          onValueChange={setExpiryYear}
                        >
                          <SelectTrigger id="expiryYear">
                            <SelectValue placeholder="Year" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from(
                              { length: 10 },
                              (_, i) => new Date().getFullYear() + i
                            ).map((year) => (
                              <SelectItem key={year} value={year.toString()}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
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
                      />
                    </div>
                  </div>
                </>
              )}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreed}
                  onCheckedChange={(checked: boolean) => setAgreed(checked)}
                />
                <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-100">
                  I agree to the terms and conditions
                </label>
              </div>
              <Button
                onClick={handlePayment}
                className="w-full bg-black dark:bg-gray-200 text-white dark:text-black hover:bg-gray-800
                 dark:hover:bg-white transition-colors duration-300"
                disabled={!agreed}
              >
                Complete Membership
              </Button>
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
