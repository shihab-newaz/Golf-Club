import { getServerSession } from "next-auth/next"; // Correct import for server-side session handling
import { authOptions } from "@/utils/authOptions"; // Import your authOptions
import PaymentClient from "./payment-client"; // Import your PaymentClient component

export default async function PaymentPage() {
  const session = await getServerSession(authOptions);
  return <PaymentClient initialSession={session} />;
}
