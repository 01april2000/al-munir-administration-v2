"use client";

import { useState } from "react";
import { signIn, signUp } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import type { Role, JenisSantri } from "@/lib/auth-client";

// Get redirect path based on role and jenisSantri
function getRedirectPath(role: Role, jenisSantri?: JenisSantri | null): string {
  switch (role) {
    case "ADMIN":
      return "/dashboard/admin";
    case "BENDAHARA_SMK":
      return "/dashboard/bendahara/smk";
    case "BENDAHARA_SMP":
      return "/dashboard/bendahara/smp";
    case "BENDAHARA_PONDOK":
      return "/dashboard/bendahara/pondok";
    case "SANTRI":
      switch (jenisSantri) {
        case "SMK":
          return "/santri/smk";
        case "SMP":
          return "/santri/smp";
        case "PONDOK":
          return "/santri/pondok";
        default:
          return "/santri";
      }
    default:
      return "/dashboard";
  }
}

export function AuthCard() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let result;
      if (isLogin) {
        result = await signIn.email({
          email,
          password,
        });
      } else {
        result = await signUp.email({
          email,
          password,
          name,
        });
      }

      // Check for errors in the response
      if (result?.error) {
        setError(result.error.message || "Authentication failed");
        setLoading(false);
        return;
      }

      // The signIn/signUp result contains the session data
      // We need to extract user info from the result
      // The result structure from better-auth has user data
      const sessionData = result as {
        user?: {
          role?: Role;
          jenisSantri?: JenisSantri | null;
        };
      } | null;

      if (sessionData?.user) {
        const redirectPath = getRedirectPath(
          sessionData.user.role as Role,
          sessionData.user.jenisSantri
        );
        window.location.href = redirectPath;
      } else {
        // Fallback to home page which will handle redirect
        window.location.href = "/";
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{isLogin ? "Login" : "Create Account"}</CardTitle>
        <CardDescription>
          {isLogin
            ? "Enter your credentials to access your account"
            : "Fill in your details to create a new account"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Loading..." : isLogin ? "Sign In" : "Create Account"}
          </Button>
          <p className="text-sm text-muted-foreground">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              className="text-primary underline-offset-4 hover:underline"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
