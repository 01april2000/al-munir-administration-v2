import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import type { Role, JenisSantri } from "@/lib/auth";

// Role-based route access configuration
const roleAccess: Record<string, string[]> = {
  ADMIN: [
    "/",
    "/dashboard",
    "/dashboard/admin",
    "/dashboard/bendahara/smk",
    "/dashboard/bendahara/smp",
    "/dashboard/bendahara/pondok",
  ],
  BENDAHARA_SMK: [
    "/",
    "/dashboard/bendahara/smk",
  ],
  BENDAHARA_SMP: [
    "/",
    "/dashboard/bendahara/smp",
  ],
  BENDAHARA_PONDOK: [
    "/",
    "/dashboard/bendahara/pondok",
  ],
  SANTRI: [
    "/",
    "/santri",
    "/santri/smk",
    "/santri/smp",
    "/santri/pondok",
  ],
};

// Get default redirect path based on role and jenisSantri
function getDefaultPath(role: Role, jenisSantri?: JenisSantri | null): string {
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
      // Redirect santri based on their jenisSantri
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

// Check if a path is allowed for a given role
function isPathAllowed(path: string, role: string, jenisSantri?: JenisSantri | null): boolean {
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
  // We need to create a Headers object from the request headers
  const headers = new Headers();
  request.headers.forEach((value, key) => {
    headers.set(key, value);
  });

  const session = await auth.api.getSession({
    headers,
  });

  console.log("Middleware session:", session?.user?.email, session?.user?.role);

  // If no session, redirect to auth page
  if (!session) {
    console.log("No session, redirecting to /auth");
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  // Get user role and jenisSantri from session
  const userRole = session.user?.role as Role;
  const jenisSantri = session.user?.jenisSantri as JenisSantri | null | undefined;

  console.log("User role:", userRole, "jenisSantri:", jenisSantri);

  // If user is on root path "/" or "/santri", redirect to their default page
  // For SANTRI role, /santri should redirect to specific jenisSantri page
  if (pathname === "/" || pathname === "/santri") {
    const defaultPath = getDefaultPath(userRole, jenisSantri);
    // Only redirect if not already at the target path
    if (pathname !== defaultPath) {
      console.log("Redirecting from", pathname, "to:", defaultPath);
      return NextResponse.redirect(new URL(defaultPath, request.url));
    }
  }

  // Check if user has access to the requested path
  if (!isPathAllowed(pathname, userRole, jenisSantri)) {
    // Redirect to their appropriate dashboard based on role
    const defaultPath = getDefaultPath(userRole, jenisSantri);
    return NextResponse.redirect(new URL(defaultPath, request.url));
  }

  return NextResponse.next();
}

export const config = {
  runtime: "nodejs", // Required for auth.api calls in middleware
  matcher: ["/", "/dashboard/:path*", "/santri/:path*"],
};