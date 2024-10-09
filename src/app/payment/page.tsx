import { getServerSession } from "next-auth/next"; // Correct import for server-side session handling
import { authOptions } from "@/utils/authOptions"; // Import your authOptions
import PaymentClient from "./payment-client"; // Import your PaymentClient component

export default async function PaymentPage() {
  // Use getServerSession with the authOptions
  const session = await getServerSession(authOptions);

  // Pass the session to your client component
  return <PaymentClient initialSession={session} />;
}
