"use client";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface AuthFormProps {
  mode: "login" | "registration";
}

export default function AuthForm({ mode }: AuthFormProps) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "registration") {
      try {
        const res = await fetch("/api/auth/registration", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, username, email, password, phoneNumber }),
        });
        if (res.ok) {
          toast({
            title: "Registration Successful",
            description: "Please log in with your new account",
            variant: "default",
          });
          router.push("/login");
        } else {
          const data = await res.json();
          toast({
            title: "Registration Failed",
            description: data.message || "An error occurred during registration",
            variant: "destructive",
          });
        }
      } catch (err) {
        console.error("Registration error:", err);
        toast({
          title: "Registration Error",
          description: "An unexpected error occurred during registration",
          variant: "destructive",
        });
      }
    } else {
      try {
        const result = await signIn("credentials", {
          redirect: false,
          username,
          password,
        });
        if (result?.error) {
          toast({
            title: "Login Failed",
            description: result.error === "CredentialsSignin" ? "Invalid username or password" : "An error occurred during login",
            variant: "destructive",
          });
        } else {
          router.push("/home");
        }
      } catch (err) {
        console.error("Login error:", err);
        toast({
          title: "Login Error",
          description: "An unexpected error occurred during login",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      {mode === "registration" && (
        <div>
          <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
            Full Name
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
        <Label htmlFor="username" className="text-gray-700 dark:text-gray-300">
          Username
        </Label>
        <Input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="mt-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>
      {mode === "registration" && (
        <>
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
            <Label
              htmlFor="phoneNumber"
              className="text-gray-700 dark:text-gray-300"
            >
              Phone Number
            </Label>
            <Input
              id="phoneNumber"
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              className="mt-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
        </>
      )}
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