// import Header from '@/components/landing-page/header';
import Header from '@/components/header';
import React from 'react';
import { Toaster } from "@/components/ui/toaster"

const HomePageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className='max-w-[2040px] mx-auto'>
      <Header />
      {children}
      <Toaster />
    </main>
  );
};

export default HomePageLayout;
