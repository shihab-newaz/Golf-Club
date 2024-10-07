// src/app/page.tsx
import { Button } from "@/components/ui/button";
import HomePage from './home/page';
export default function Home() {
  return (
    <main className="flex min-h-screen  flex-col items-center justify-center ">
      <HomePage />
    </main>
  );
}
