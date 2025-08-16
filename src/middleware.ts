import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { any } from "zod";

import { updateSession } from '@/lib/supabase/middleware'




export async function middleware(request: NextRequest) {
  const { user, supabaseResponse } = await updateSession(request)

  const { pathname } = request.nextUrl;

  // Redirect logged-in users away from login and signup pages
  if (user && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/", request.url));  // Redirect to home or any other route
  }
  // Redirect if no token and trying to access protected routes
  // if (!token) {
  //     if (pathname === "/" || pathname === "/chatbot") {
  //         return NextResponse.redirect(new URL("/login", req.url));
  //     }
  // }

  // Redirect if token exists and trying to access auth pages
  //   if(token)
  //     {
  //   if ( pathname === "/login" ||  pathname ===  "/signup") {
  //       return NextResponse.redirect(new URL("/", req.url));
  //   }
  // }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'             // Match API routes
  ],
  // matcher: [
  //     "/((?!.+\\.[\\w]+$|_next).*)", // Match all paths except files and _next
  //     "/",                           // Match root path
  //     "/(api|trpc)(.*)"              // Match API routes
  // ],
};

