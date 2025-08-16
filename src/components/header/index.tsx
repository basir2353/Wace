import Image from "next/image";
import Link from "next/link";
import React from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "../ui/button";

import { createClient } from "@/lib/supabase/server";
import LogoutBtn from "./LogoutBtn";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetOverlay,
} from "@/components/ui/sheet";
import { Separator } from "../ui/separator";
import { Menu } from "lucide-react";

const Header = async () => {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  return (
    <header
      className="p-4
      flex
      justify-between
      items-center"
    >
      <Link
        href={"/"}
        className="flex gap-1
        justify-left items-center"
      >
        <Image
          src="/wace.png"
          alt="Logo"
          width={80}
          height={100}
          className="object-contain"
        />
        <span
          className="font-semibold
          dark:text-white text-3xl"
        >
          Wace
        </span>
      </Link>

      <Sheet>
        <SheetTrigger asChild className="sm:hidden">
          <Button variant="outline" className="px-2.5">
            <Menu size={20} />
          </Button>
        </SheetTrigger>
        <SheetContent side={"left"}>
          <SheetOverlay asChild />

          <SheetHeader>
            <SheetTitle>
              <Link
                href={"/"}
                className="flex gap-1
        justify-left items-center"
              >
                <Image
                  src="/wace.png"
                  alt="Logo"
                  width={80}
                  height={100}
                  className="object-contain"
                />
                <span
                  className="font-semibold
          dark:text-white text-3xl"
                >
                  Wace
                </span>
              </Link>
            </SheetTitle>
            <SheetDescription>
              <Separator />
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            {data?.user ? (
              <div className="flex-col items-start gap-x-4 flex">
                <Link href={"/ai-chat"}>
                  <Button variant="btn-secondary" className=" p-1">
                    Chat
                  </Button>
                </Link>
                <Link href={"/courses"}>
                  <Button variant="btn-secondary" className=" p-1">
                    Courses
                  </Button>
                </Link>
                <div className="flex-col items-start gap-x-4 flex">
                  <LogoutBtn />
                </div>
              </div>
            ) : (
              <div className="flex-col items-start gap-x-4 flex">
                <Link href={"/signup"}>
                  <Button variant="btn-secondary" className=" p-1">
                    Signup
                  </Button>
                </Link>
                <Link href={"/login"}>
                  <Button variant="btn-secondary" className=" p-1">
                    Login
                  </Button>
                </Link>
              </div>
            )}
          </div>
          <SheetFooter>
            <SheetClose asChild>
              {/* <Button type="submit">Save changes</Button> */}
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* <NavigationMenu className="hidden md:block">
        <NavigationMenuList className="gap-6">
          <NavigationMenuItem>
            <NavigationMenuTrigger
              //   onClick={() => setPath("/working-process")}
              className={cn({
                "dark:text-white/40": true,
                "font-normal": true,
                "text-lg": true,
              })}
            >
              How It Works
            </NavigationMenuTrigger>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger
              //   onClick={() => setPath("/")}
              className={cn({
                "dark:text-white/40": true,
                "font-normal": true,
                "text-lg": true,
              })}
            >
              Share Your Skills
            </NavigationMenuTrigger>
          </NavigationMenuItem>
          <NavigationMenuItem></NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              className={cn(navigationMenuTriggerStyle(), {
                "dark:text-white/40": true,
                "font-normal": true,
                "text-lg": true,
              })}
            >
              Budget Interest
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink
              className={cn(navigationMenuTriggerStyle(), {
                "dark:text-white/40": true,
                "font-normal": true,
                "text-lg": true,
              })}
            >
              Target Demographics
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu> */}

      {data?.user ? (
        <div className="hidden sm:flex  items-center gap-x-3">
          <Link href={"/ai-chat"}>
            <Button variant="btn-secondary" className=" p-1">
              Chat
            </Button>
          </Link>
          <Link href={"/courses"}>
            <Button variant="btn-secondary" className=" p-1">
              Courses
            </Button>
          </Link>
          <LogoutBtn />
        </div>
      ) : (
        <div className=" items-center gap-x-4 hidden sm:flex">
          <Link href={"/signup"}>
            <Button variant="btn-secondary" className=" p-1">
              Signup
            </Button>
          </Link>
          <Link href={"/login"}>
            <Button variant="btn-secondary" className=" p-1">
              Login
            </Button>
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
