"use client";

import { useSession, type Role, signOut } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";

interface UserInfoProps {
  showDetails?: boolean;
}

const roleLabels: Record<Role, string> = {
  ADMIN: "Administrator",
  BENDAHARA_SMK: "Bendahara SMK",
  BENDAHARA_SMP: "Bendahara SMP",
  BENDAHARA_PONDOK: "Bendahara Pondok",
  SANTRI: "Santri",
};

const roleColors: Record<Role, string> = {
  ADMIN: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  BENDAHARA_SMK: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  BENDAHARA_SMP: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  BENDAHARA_PONDOK: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  SANTRI: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
};

export function UserInfo({ showDetails = false }: UserInfoProps) {
  const { data: session, isPending } = useSession();

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/auth";
        },
      },
    });
  };

  if (isPending) {
    return (
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
        <div className="space-y-1">
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          <div className="h-3 w-32 animate-pulse rounded bg-muted" />
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const user = session.user;
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user.email.slice(0, 2).toUpperCase();

  // Get role from user object (extended via better-auth additionalFields)
  const role = (user as { role?: Role }).role ?? "SANTRI";
  const roleLabel = roleLabels[role];
  const roleColor = roleColors[role];
  const emailVerified = user.emailVerified;

  if (!showDetails) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-3 rounded-lg p-2 hover:bg-accent transition-colors cursor-pointer">
            <Avatar>
              <AvatarImage src={user.image ?? undefined} alt={user.name ?? user.email} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium">{user.name ?? "User"}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${roleColor}`}>
                {roleLabel}
              </span>
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name ?? "User"}</p>
                <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
              </div>
            </DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <div className="px-2 py-1.5">
            <span className={`text-xs px-2 py-0.5 rounded-full ${roleColor}`}>
              {roleLabel}
            </span>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem className="cursor-pointer" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="rounded-lg border p-4 space-y-4">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={user.image ?? undefined} alt={user.name ?? user.email} />
          <AvatarFallback className="text-lg">{initials}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-lg font-semibold">{user.name ?? "User"}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full w-fit ${roleColor}`}>
            {roleLabel}
          </span>
        </div>
      </div>
      
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Email</span>
          <span className="flex items-center gap-2">
            {user.email}
            {emailVerified && (
              <span className="text-xs text-green-600 dark:text-green-400">
                ✓ Verified
              </span>
            )}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">Role</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${roleColor}`}>
            {roleLabel}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">User ID</span>
          <span className="font-mono text-xs">{user.id}</span>
        </div>
      </div>
    </div>
  );
}