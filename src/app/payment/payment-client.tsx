// app/payment/PaymentClient.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
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
import {
  validateMembershipEligibility,
  updateUserTier,
  getMembershipPricing,
} from "./actions";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PaymentClientProps {
  initialSession: Session | null;
}

const MONTHS = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
];

const YEARS = Array.from({ length: 10 }, (_, i) =>
  (new Date().getFullYear() + i).toString()
);

const PaymentClient: React.FC<PaymentClientProps> = ({ initialSession }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  // Form state
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [membershipFeatures, setMembershipFeatures] = useState<string[]>([]);

  // Validation state
  const [errors, setErrors] = useState<{
    cardNumber?: string;
    expiryMonth?: string;
    expiryYear?: string;
    cvc?: string;
    agreement?: string;
  }>({});

  useEffect(() => {
    const tierParam = searchParams.get("tier");
    if (tierParam) {
      setTier(tierParam);
      // Set price and features based on tier
      getMembershipPricing().then((pricing) => {
        const tierInfo =
          pricing[tierParam.toLowerCase() as keyof typeof pricing];
        if (tierInfo) {
          setPrice(tierInfo.price.toString());
          setMembershipFeatures(tierInfo.features);
        }
      });
    }
    if (initialSession?.user) {
      setName(initialSession.user.name || "");
      setEmail(initialSession.user.email || "");
    }
  }, [searchParams, initialSession]);

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (paymentMethod === "credit") {
      if (!cardNumber || cardNumber.length < 16) {
        newErrors.cardNumber = "Please enter a valid card number";
      }
      if (!expiryMonth) {
        newErrors.expiryMonth = "Please select expiry month";
      }
      if (!expiryYear) {
        newErrors.expiryYear = "Please select expiry year";
      }
      if (!cvc || cvc.length < 3) {
        newErrors.cvc = "Please enter a valid CVC";
      }
    }

    if (!agreed) {
      newErrors.agreement = "Please agree to the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please check the form for errors",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const eligibilityResult = await validateMembershipEligibility(
        email,
        tier
      );
      if (!eligibilityResult.success) {
        toast({
          title: "Membership Upgrade Failed",
          description: eligibilityResult.message,
          variant: "destructive",
        });
        return;
      }

      const result = await updateUserTier({
        email,
        tier: tier.toLowerCase() as "free" | "silver" | "gold" | "platinum",
        paymentMethod: paymentMethod as "credit" | "debit",
        cardDetails: {
          cardNumber,
          expiryMonth,
          expiryYear,
          cvc,
        },
      });

      if (result.success) {
        toast({
          title: "Upgrade Successful",
          description: `Welcome to ${tier} membership!`,
          variant: "default",
        });
        router.push("/dashboard");
      } else {
        throw new Error(result.error || "Upgrade failed");
      }
    } catch (error) {
      console.error("Error during payment:", error);
      toast({
        title: "Payment Failed",
        description: "An error occurred during payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020817] backdrop-blur-md shadow-md p-4 transition-colors duration-300">
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-8">
        {/* Payment Form */}
        <Card className="flex-grow bg-white dark:bg-gray-800 text-black dark:text-white transition-colors duration-300">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-6">Checkout</h2>
            <div className="space-y-4">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Personal Information</h3>
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    disabled
                    className="border-gray-300 dark:border-gray-600"
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
                    disabled
                    className="border-gray-300 dark:border-gray-600"
                  />
                </div>
              </div>

              {/* Membership Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Membership Selection</h3>
                <div>
                  <Label htmlFor="membership">Membership Tier</Label>
                  <Select value={tier} onValueChange={setTier}>
                    <SelectTrigger
                      id="membership"
                      className="border-gray-300 dark:border-gray-600"
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
              </div>

              {/* Payment Method */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Payment Method</h3>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="credit" id="credit" />
                    <Label htmlFor="credit" className="flex items-center">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Credit/Debit Card
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Card Details */}
              {paymentMethod === "credit" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Card Details</h3>
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      value={cardNumber}
                      onChange={(e) =>
                        setCardNumber(e.target.value.replace(/\D/g, ""))
                      }
                      placeholder="1234 5678 9012 3456"
                      maxLength={16}
                      className={
                        errors.cardNumber
                          ? "border-red-500"
                          : "" + " border-gray-300 dark:border-gray-600"
                      }
                    />
                    {errors.cardNumber && (
                      <span className="text-sm text-red-500">
                        {errors.cardNumber}
                      </span>
                    )}
                  </div>

                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <div className="flex space-x-2">
                        <Select
                          value={expiryMonth}
                          onValueChange={setExpiryMonth}
                        >
                          <SelectTrigger
                            id="expiryMonth"
                            className="border-gray-300 dark:border-gray-600"
                          >
                            <SelectValue placeholder="MM" />
                          </SelectTrigger>
                          <SelectContent>
                            {MONTHS.map((month) => (
                              <SelectItem key={month} value={month}>
                                {month}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select
                          value={expiryYear}
                          onValueChange={setExpiryYear}
                        >
                          <SelectTrigger
                            id="expiryYear"
                            className="border-gray-300 dark:border-gray-600"
                          >
                            <SelectValue placeholder="YYYY" />
                          </SelectTrigger>
                          <SelectContent>
                            {YEARS.map((year) => (
                              <SelectItem key={year} value={year}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      {(errors.expiryMonth || errors.expiryYear) && (
                        <span className="text-sm text-red-500">
                          Please select expiry date
                        </span>
                      )}
                    </div>

                    <div className="w-1/3">
                      <Label htmlFor="cvc">CVC</Label>
                      <Input
                        id="cvc"
                        value={cvc}
                        onChange={(e) =>
                          setCvc(e.target.value.replace(/\D/g, ""))
                        }
                        placeholder="123"
                        maxLength={4}
                        className={errors.cvc ? "border-red-500" : "" + " border-gray-300 dark:border-gray-600"}
                      />
                      {errors.cvc && (
                        <span className="text-sm text-red-500">
                          {errors.cvc}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Terms and Conditions */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreed}
                  onCheckedChange={(checked) => setAgreed(checked as boolean)}
                />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the terms and conditions of the membership
                </Label>
              </div>
              {errors.agreement && (
                <span className="text-sm text-red-500">{errors.agreement}</span>
              )}
            </div>
          </CardContent>
          <CardFooter className="px-6 pb-6">
            <Button
              onClick={handlePayment}
              disabled={isProcessing || !agreed}
              className="w-full"
            >
              {isProcessing ? (
                <span className="flex items-center">
                  Processing...
                  <span className="ml-2 animate-spin">↻</span>
                </span>
              ) : (
                `Pay $${price}`
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* Order Summary */}
        <div className="w-full md:w-96 space-y-4">
          <Card className="bg-white dark:bg-gray-800 text-black dark:text-white transition-colors duration-300">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Membership Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Membership Type:</span>
                  <span className="font-semibold">{tier}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span className="font-semibold">1 Year</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>${price}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Membership Features */}
          <Card className="bg-white dark:bg-gray-800 text-black dark:text-white transition-colors duration-300">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Membership Features</h2>
              <ul className="space-y-2">
                {membershipFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Security Notice */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Your payment is secured with industry-standard encryption.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
};

export default PaymentClient;
