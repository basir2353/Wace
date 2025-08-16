"use client";
import { Logo } from "@/components/chatbot/icons/Icons";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useSupabaseUser } from "@/lib/providers/supabase-user-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

const SideBar = () => {
  const { user } = useSupabaseUser();

  return (
    <div className="h-full relative flex flex-col">
      <div className="border-b-2 border-slate-500 pt-4 mb-2">
        <div
          className="flex gap-1
        justify-left items-center w-fit mx-auto pr-4"
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
        </div>
      </div>

      <div className="p-3 flex-1 flex flex-col overflow-y-auto min-h-[20px] space-y-2">
        {/* <Button className="w-full mb-5">New Chat</Button> */}

        <Link href={"/ai-chat"} className=" rounded-md px-3 py-2">
          <Button className="w-full !text-left bg-purple-600 hover:bg-purple-700">Chatbot</Button>
        </Link>
        <Link
          href={"/model-finder"}
          className="rounded-md px-3 py-2"
        >
          <Button className="w-full !text-left bg-purple-600 hover:bg-purple-700">Model Finder</Button>
        </Link>
        {/* <h3 className="text-xl mb-3 ">History</h3>
        <div className="space-y-2  flex-1  overflow-y-auto -mr-2 -ml-1 pr-2">
          <p className="bg-background/50 rounded-md px-3 py-2">My Chat</p>
          <p className="bg-background/50 rounded-md px-3 py-2">My Chat</p>
        </div> */}
      </div>

      <div className="p-3 shrink-0">
        <div className="">
          {/* <Button size={"lg"} className="w-full mb-4">
            Model Finder
          </Button> */}

          <div className="bg-[#2E2951] rounded-lg px-2 py-3 flex gap-2 items-center ">
            <Avatar>
              {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
              <AvatarFallback className="bg-[#1C1932] text-purple-100">
                {user?.full_name?.split(" ")[0][0]}
                {user?.full_name?.split(" ")[0][1]}
              </AvatarFallback>
            </Avatar>
            <p className="flex-1 relative truncate pr-1 text-purple-100">
              {/* {user?.full_name?.length === 14
                ? user?.full_name
                : user?.full_name?.slice(0, 14) + "..."} */}
              {user?.full_name ? user?.full_name : ""}
              <span className="absolute w-px right-0 top-1/2 -translate-y-1/2 bg-slate-300 h-[180%] " />
            </p>
            <div className="ml-auto flex-shrink-0">
              <Link href={"/settings"}>
                <Button className="rounded-full p-2 bg-background/20">
                  <Settings className="text-foreground" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
