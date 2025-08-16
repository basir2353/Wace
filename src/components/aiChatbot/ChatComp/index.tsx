import React from "react";
import SideBar from "../Sidebar";
import ChatResponse from "../ChatResponse";

const ChatComp = () => {
  return (
    <main className="h-dvh fixed top-0 left-0 w-full flex box-border m-0 p-0">
      <aside className=" bg-[#16132B] w-[350px] flex-shrink-0 hidden xl:block">
        <SideBar />
      </aside>
      <ChatResponse />
    </main>
  );
};

export default ChatComp;
