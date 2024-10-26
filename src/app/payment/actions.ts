// app/payment/actions.ts
'use server'

import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import type { IUser } from "@/models/User";

// Types based on User model
interface PaymentDetails {
  email: string;
  tier: 'free' | 'silver' | 'gold' | 'platinum';
  paymentMethod: 'credit' | 'debit';
  cardDetails?: {
    cardNumber: string;
    expiryMonth: string;
    expiryYear: string;
    cvc: string;
  };
}

interface PaymentResponse {
  success: boolean;
  message: string;
  error?: string;
  user?: {
    name: string;
    email: string;
    membershipTier: string;
  };
}

// Type for lean user document
type LeanUser = Pick<IUser, 'name' | 'email' | 'membershipTier' | 'role'>;

// Get user's current membership details
export async function getCurrentMembershipDetails(email: string): Promise<{
  name: string;
  email: string;
  currentTier: string;
  role: 'member' | 'admin';
} | null> {
  try {
    await dbConnect();
    const user = await User.findOne({ email })
      .select('name email membershipTier role')
      .lean<LeanUser>();

    if (!user) {
      return null;
    }

    return {
      name: user.name,
      email: user.email,
      currentTier: user.membershipTier,
      role: user.role
    };
  } catch (error) {
    console.error('Error fetching membership details:', error);
    return null;
  }
}

// Verify the payment with payment processor (mock implementation)
async function verifyPayment(details: PaymentDetails): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return true;
}

// Update user membership tier
export async function updateUserTier(details: PaymentDetails): Promise<PaymentResponse> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return {
        success: false,
        message: "Authentication required",
        error: "User not authenticated"
      };
    }

    await dbConnect();

    const paymentVerified = await verifyPayment(details);
    if (!paymentVerified) {
      return {
        success: false,
        message: "Payment verification failed",
        error: "Could not verify payment"
      };
    }

    const updatedUser = await User.findOneAndUpdate(
      { email: details.email },
      { 
        $set: { 
          membershipTier: details.tier,
        }
      },
      { new: true }
    )
    .select('name email membershipTier')
    .lean<LeanUser>();

    if (!updatedUser) {
      return {
        success: false,
        message: "User not found",
        error: "Could not find user with provided email"
      };
    }

    revalidatePath('/dashboard');
    revalidatePath('/profile');

    return {
      success: true,
      message: `Successfully upgraded to ${details.tier} membership`,
      user: {
        name: updatedUser.name,
        email: updatedUser.email,
        membershipTier: updatedUser.membershipTier
      }
    };

  } catch (error) {
    console.error('Error in updateUserTier:', error);
    return {
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
}

// Get membership pricing and features
export async function getMembershipPricing() {
  return {
    silver: {
      price: 299,
      features: [
        "Priority Tee Time Booking (3 days advance)",
        "10% Pro Shop Discount",
        "Access to Member-Only Events",
        "Basic Golf Lessons (2/month)",
        "Weekday Golf Cart Usage"
      ]
    },
    gold: {
      price: 399,
      features: [
        "Priority Tee Time Booking (5 days advance)",
        "15% Pro Shop Discount",
        "Access to Member-Only Events",
        "Premium Golf Lessons (4/month)",
        "Unlimited Golf Cart Usage",
        "Access to Partner Golf Clubs",
        "Complimentary Range Balls"
      ]
    },
    platinum: {
      price: 499,
      features: [
        "Priority Tee Time Booking (7 days advance)",
        "20% Pro Shop Discount",
        "VIP Member-Only Events",
        "Unlimited Golf Lessons",
        "Unlimited Golf Cart Usage",
        "Global Golf Club Network Access",
        "Personal Locker",
        "Guest Privileges (4 passes/month)",
        "Priority Tournament Entry",
        "Exclusive Club House Access"
      ]
    }
  };
}

// Validate membership eligibility
export async function validateMembershipEligibility(email: string, targetTier: string): Promise<PaymentResponse> {
  try {
    await dbConnect();
    
    const user = await User.findOne({ email })
      .select('membershipTier role')
      .lean<Pick<IUser, 'membershipTier' | 'role'>>();
    
    if (!user) {
      return {
        success: false,
        message: "User not found",
        error: "Invalid user"
      };
    }

    const validTiers = ['free', 'silver', 'gold', 'platinum'];
    if (!validTiers.includes(targetTier.toLowerCase())) {
      return {
        success: false,
        message: "Invalid membership tier",
        error: "Invalid tier selection"
      };
    }

    const tierValues = { free: 0, silver: 1, gold: 2, platinum: 3 };
    const currentTierValue = tierValues[user.membershipTier as keyof typeof tierValues];
    const targetTierValue = tierValues[targetTier.toLowerCase() as keyof typeof tierValues];

    if (currentTierValue > targetTierValue) {
      return {
        success: false,
        message: "Please contact support for membership downgrades",
        error: "Downgrade not allowed"
      };
    }

    if (currentTierValue === targetTierValue) {
      return {
        success: false,
        message: "You are already a member of this tier",
        error: "Same tier selected"
      };
    }

    return {
      success: true,
      message: "User is eligible for membership upgrade"
    };
  } catch (error) {
    console.error('Error in validateMembershipEligibility:', error);
    return {
      success: false,
      message: "Could not validate eligibility",
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
}