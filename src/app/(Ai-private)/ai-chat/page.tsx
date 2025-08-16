import ChatComp from "@/components/aiChatbot/ChatComp";
import React from "react";
import Provider from "../proivder";

const AiChat = () => {
  return (
    <Provider>
      <div>
        <ChatComp />
      </div>
    </Provider>
  );
};

export default AiChat;
