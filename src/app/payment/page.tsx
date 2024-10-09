// app/payment/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import PaymentClient from "./payment-client";

export default async function PaymentPage() {
  const session = await getServerSession(authOptions);

  return <PaymentClient initialSession={session} />;
}