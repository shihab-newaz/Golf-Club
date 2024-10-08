"use client";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AuthFormProps {
  mode: "login" | "registration";
}

export default function AuthForm({ mode }: AuthFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (mode === "registration") {
      try {
        const res = await fetch("/api/auth/registration", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        if (res.ok) {
          router.push("/login");
        } else {
          const data = await res.json();
          setError(data.message || "Registration failed");
        }
      } catch (err) {
        console.error("Registration error:", err);
        setError("An error occurred during registration");
      }
    } else {
      try {
        const result = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });
        if (result?.error) {
          setError(result.error);
        } else {
          router.push("/home");
        }
      } catch (err) {
        console.error("Login error:", err);
        setError("An error occurred during login");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      {mode === "registration" && (
        <div>
          <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
            Name
          </Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
      )}
      <div>
        <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>
      <div>
        <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
          Password
        </Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <Button
        type="submit"
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white
        dark:bg-indigo-700 dark:hover:bg-indigo-600"
      >
        {mode === "login" ? "Log In" : "Register"}
      </Button>
    </form>
  );
}