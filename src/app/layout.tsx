// export const dynamic = "force-dynamic";

import type { Metadata } from "next";

import "./globals.css";
import { ThemeProvider } from "@/lib/providers/next-theme-provider";
import { DM_Sans } from "next/font/google";
import { twMerge } from "tailwind-merge";
import AppStateProvider from "@/lib/providers/state-provider";
// import { Toaster } from '@/components/ui/toaster';
import { Toaster } from "@/components/ui/toaster";
// import { SocketProvider } from "@/lib/providers/socket-provider";
import { SupabaseUserProvider } from "@/lib/providers/supabase-user-provider";
// import db from "@/lib/supabase/db"
const inter = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wace",
  description: "World's first AI business model finder",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // console.log(db)
  return (
    <html lang="en">
      <body className={twMerge("bg-background", inter.className)}>
        <SupabaseUserProvider>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
              <AppStateProvider>
                {/* <SocketProvider> */}
                  {children}
                  <Toaster />
                {/* </SocketProvider> */}
              </AppStateProvider>
            </ThemeProvider>
        </SupabaseUserProvider>
      </body>
    </html>
  );
}
