import TitleSection from "@/components/landing-page/title-section";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
// import Banner from '../../../public/bannerUpdated2.png';
import Banner from "../../../public/bannerUpdate1.png";
import Cal from "../../../public/cal.png";
import Diamond from "../../../public/icons/diamond.svg";
import CheckIcon from "../../../public/icons/check.svg";
import { CLIENTS, PRICING_CARDS, PRICING_PLANS, USERS } from "@/lib/constants";
import { randomUUID } from "crypto";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";
import CustomCard from "@/components/landing-page/custom-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

const HomePage = async () => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <section
        className="
      px-4
      sm:px-6
      mt-10
      sm:flex
      sm:flex-col
      gap-4
      md:justify-center
      md:items-center"
      >
        <TitleSection
          pill="✨ Find, Learn and Build"
          title="World's First AI Business Model Finder"
        />

        <p className="sm:max-w-[700px] md:text-center mt-4 leading-relaxed text-foreground/75 text-sm md:text-base">
          Unlock success with the world&apos;s first AI-driven Business Model
          Finder—instantly discover the ideal business strategy tailored to your
          venture with just a few clicks.
        </p>

        <div
          className="
          p-[2px]
          mt-6
          rounded-xl
          bg-gradient-to-r
          from-logo-color-1
          to-logo-color-2
          sm:w-[300px]
        "
        >
          <Link href={user ? "/ai-chat" : "/login"}>
            <Button
              variant="btn-secondary"
              className=" w-full
            rounded-[10px]
            p-6
            text-2xl
            bg-background
            "
            >
              Get Started
            </Button>
          </Link>
        </div>
        {/* <div
          className="md:mt-[-90px]
          sm:w-full
          w-[750px]
          flex
          justify-center
          items-center
          mt-[-40px]
          relative
          sm:ml-0
          ml-[-50px]
        "
        ></div> */}
      </section>

      <section
        className="px-4
        sm:px-6
        flex
        justify-center
        items-center
        flex-col
        relative
        mt-12
      "
      >
        <div
          className="w-[30%]
          blur-[120px]
          rounded-full
          h-32
          absolute
          bg-logo-color-1/90
          -z-10
          top-22
          text-white
        "
        />
        <TitleSection
          title="AI-Powered Analysis"
          subheading="Our AI examines the data to identify the best business opportunities for you."
          pill="AI-Powered"
        />
        <div
          className="mt-10
          max-w-[450px]
          flex
          justify-center
          items-center
          relative
          sm:ml-0
          rounded-2xl
          border-8
          border-washed-purple-300 
          border-opacity-10
        "
        ></div>
      </section>

      <section className="relative">
        <div
          className="w-full
          blur-[120px]
          rounded-full
          h-32
          absolute
         
          -z-100
          top-56
        "
        />
        {/* bg-logo-color-1/90 */}
        <div
          className="mt-20
          px-4
          sm:px-6 
          flex
          flex-col
          overflow-x-hidden
          overflow-visible
        "
        >
          <TitleSection
            title="Receive Your Tailored Plan"
            subheading="Get a detailed report with recommended business models, market insights, and actionable steps."
            pill="Plans"
          />
        </div>
      </section>

      <section
        className="mt-20
        px-4
        sm:px-6
      "
      >
        <TitleSection
          title="Start Building Your Dream"
          subheading="Use our AI-generated plan to kickstart your entrepreneurial journey and bring your vision to life."
          pill="Dreams"
        />
        <div
          className="flex 
        flex-col-reverse
        sm:flex-row
        gap-4
        justify-center
        sm:items-stretch
        items-center
        mt-10
        "
        ></div>
      </section>
    </>
  );
};

export default HomePage;
