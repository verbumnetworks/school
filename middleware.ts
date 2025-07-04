import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { routeAccessMap } from "./lib/configurations";
import { NextRequest } from "next/server";

const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret });

  // No session found, allow public routes or redirect if needed
  if (!token) return NextResponse.next();

  const role = token.role;

  const currentPath = req.nextUrl.pathname;

  for (const route in routeAccessMap) {
    const matcher = new RegExp(`^${route}$`);
    if (matcher.test(currentPath)) {
      const allowedRoles = routeAccessMap[route];
      if (!allowedRoles.includes(role)) {
        const redirectUrl = new URL(`/${role}`, req.url);
        return NextResponse.redirect(redirectUrl);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
