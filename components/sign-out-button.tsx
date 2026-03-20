"use client";

import { signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface SignOutButtonProps {
  variant?: "default" | "outline" | "secondary" | "ghost" | "destructive" | "link";
  size?: "default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg";
  className?: string;
  showIcon?: boolean;
  children?: React.ReactNode;
}

export function SignOutButton({
  variant = "ghost",
  size = "default",
  className,
  showIcon = true,
  children,
}: SignOutButtonProps) {
  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/auth";
        },
      },
    });
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleSignOut}
    >
      {showIcon && <LogOut className="mr-2 h-4 w-4" />}
      {children ?? "Sign Out"}
    </Button>
  );
}