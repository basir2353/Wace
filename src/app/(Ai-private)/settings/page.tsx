import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import SettingsTemplate from "./settingTemplate";

const page = () => {
  return (
    <>
      <header
        className="p-4
    flex
    justify-center
    items-center"
      >
        <Link
          href={"/"}
          className="flex gap-2
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
      </header>
      <main className="">
        <SettingsTemplate />
      </main>
    </>
  );
};

export default page;
