import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

// Role-based route access configuration
const roleAccess: Record<string, string[]> = {
  ADMIN: [
    "/dashboard",
    "/dashboard/admin",
    "/dashboard/bendahara/smk",
    "/dashboard/bendahara/smp",
    "/dashboard/bendahara/pondok",
  ],
  BENDAHARA_SMK: [
    "/dashboard",
    "/dashboard/bendahara/smk",
  ],
  BENDAHARA_SMP: [
    "/dashboard",
    "/dashboard/bendahara/smp",
  ],
  BENDAHARA_PONDOK: [
    "/dashboard",
    "/dashboard/bendahara/pondok",
  ],
  SANTRI: [
    "/dashboard",
  ],
};

// Check if a path is allowed for a given role
function isPathAllowed(path: string, role: string): boolean {
  const allowedPaths = roleAccess[role] || [];
  
  // Check if the path starts with any of the allowed paths
  return allowedPaths.some((allowedPath) => {
    // Exact match or sub-path match
    if (path === allowedPath) return true;
    if (path.startsWith(allowedPath + "/")) return true;
    return false;
  });
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get session using better-auth
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // If no session, redirect to auth page
  if (!session) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  // Get user role from session
  const userRole = session.user?.role as string;

  // Check if user has access to the requested path
  if (!isPathAllowed(pathname, userRole)) {
    // Redirect to their appropriate dashboard based on role
    const defaultPath = roleAccess[userRole]?.[0] || "/dashboard";
    return NextResponse.redirect(new URL(defaultPath, request.url));
  }

  return NextResponse.next();
}

export const config = {
  runtime: "nodejs", // Required for auth.api calls in middleware
  matcher: ["/", "/dashboard/:path*"],
};