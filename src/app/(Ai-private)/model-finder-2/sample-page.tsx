import Image from "next/image";
import BusinessPlanner from "./BusinessPlanner";
import SideBar from "@/components/aiChatbot/Sidebar";

export default function ModelFinder() {
  return (
    <main className="h-dvh fixed top-0 left-0 w-full flex box-border m-0 p-0">
      <aside className=" bg-[#16132B] w-[350px] flex-shrink-0 hidden xl:block">
        <SideBar />
      </aside>
      <div className="container mx-auto px-4 py-8 overflow-y-auto">
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
        <BusinessPlanner />
      </div>{" "}
    </main>
  );
}
