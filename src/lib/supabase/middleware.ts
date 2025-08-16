import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const { pathname } = request.nextUrl;

    const supabase = createServerClient(
        // "https://emsqnkazbvyyrfgnnjgu.supabase.co",
        // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtc3Fua2F6YnZ5eXJmZ25uamd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU2OTY0NjcsImV4cCI6MjA0MTI3MjQ2N30.PhRCVNjTwCeaqe6Ro8EZJiJJfw_FoPYGi6zUAUE02AE",
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    // Using the response object to set cookies properly
                    cookiesToSet.forEach(({ name, value, options }) => {
                        supabaseResponse.cookies.set(name, value, options);
                    });
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()



    return {supabaseResponse,user}
}