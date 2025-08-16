"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Icon,
  Img,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import Navbar from "../ChatComp/Navbar";
import { useToast } from "@/components/ui/use-toast";
import { MdPerson, MdEdit, MdAutoAwesome } from "react-icons/md";
import MessageBoxChat from "../ChatComp/MessageBox";
import { BasicUsage } from "../ChatComp/SuggestionModal";
import { Loader2 } from "lucide-react";

const ChatResponse = () => {
  //   const { isOpen, onOpen, onClose } = useDisclosure();
  const [inputCode, setInputCode] = useState<string>("");
  const [messages, setMessages] = useState<
    { user: string; response: string }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const chatRef = useRef<HTMLDivElement>(null);

  // Automatically scroll to the bottom when new messages are added
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const [isOpen, setDialogDisplay] = useState(false);

  const borderColor = useColorModeValue("gray.200", "whiteAlpha.200");
  const brandColor = useColorModeValue("brand.500", "white");
  const gray = useColorModeValue("gray.500", "white");

  const { toast } = useToast();

  const { GoogleGenerativeAI } = require("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(
    "AIzaSyBMG05umJ7MH1GVutEM3tRxSeT41e-TJe8"
  );

  const handleTranslate = async () => {
    setLoading((state) => true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(inputCode);
      const response = await result.response;

      let output = "";
      if (response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let done = false;
        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          output += decoder.decode(value, { stream: !done });
        }
      } else {
        output = await response.text();
      }

      setMessages([...messages, { user: inputCode, response: output }]);
      setInputCode(""); // Clear input field
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading((state) => false);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputCode(event.target.value);
  };

  const handleSuccess = (message: string, text: string) => {
    console.log("Message from modal:", message); // Debug statement
    setMessages([...messages, { user: text, response: message }]);
  };

  const handleQuestionClick = async (question: string) => {
    setInputCode(question);
  };

  const onClose = (state: boolean) => {
    setDialogDisplay(state);
  };

  const questions = [
    "What are you working on today?",
    // "Do you need help with anything?",
    // "Have any questions about your project?",
  ];
  return (
    <div className="w-full relative h-full ">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2  select-none opacity-30">
        <p className="text-center mb-3">
          World&apos;s First AI Business Model Finder
        </p>
        <Image
          alt="Logo"
          className="object-cover"
          width={450}
          height={450}
          src="/wace.png"
        />
      </div>

      <div className=" overflow-y-auto h-full relative z-10 px-4" ref={chatRef}>
        <Navbar />
        <div className="max-w-[850px] mx-auto relative sm:p-4 h-full flex flex-col ">
          {/* Response */}
          <div className="pb-10  mt-auto space-y-20">
            {messages.map((msg, index) => (
              <Flex key={index} direction="column" mb="10px">
                <Flex
                  w="100%"
                  mb="30px"
                  gap="20px"
                  align={{ base: "start", md: "center" }}
                  direction={{ base: "column", md: "row" }}
                >
                  <Flex
                    borderRadius="full"
                    justify="center"
                    align="center"
                    bg={"transparent"}
                    border="1px solid"
                    borderColor={borderColor}
                    h="40px"
                    minH="40px"
                    minW="40px"
                  >
                    <Icon
                      as={MdPerson}
                      width="20px"
                      height="20px"
                      color={brandColor}
                    />
                  </Flex>

                  <Flex
                    p="22px"
                    border="1px solid"
                    borderColor={borderColor}
                    borderRadius="14px"
                    w="100%"
                    zIndex={"0"}
                  >
                    <Text
                      color="white"
                      fontWeight="600"
                      cursor="pointer"
                      fontSize={{ base: "sm", md: "md" }}
                      lineHeight={{ base: "24px", md: "26px" }}
                    >
                      {msg.user}
                    </Text>
                    <Icon
                      cursor="pointer"
                      as={MdEdit}
                      ms="auto"
                      width="20px"
                      height="20px"
                      color={gray}
                    />
                  </Flex>
                </Flex>
                <Flex
                  w="100%"
                  gap="20px"
                  align={"start"}
                  direction={{ base: "column", md: "row" }}
                >
                  <Flex
                    borderRadius="full"
                    justify="center"
                    align="center"
                    bg={
                      "linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)"
                    }
                    h="40px"
                    minH="40px"
                    minW="40px"
                  >
                    <Icon
                      as={MdAutoAwesome}
                      width="20px"
                      height="20px"
                      color="white"
                    />
                  </Flex>
                  <MessageBoxChat output={msg.response} />
                </Flex>
              </Flex>
            ))}
          </div>

          <div className="sticky bottom-0 pb-4 bg-background shrink-0  ">
            <div className="flex flex-row justify-between gap-4 items-center py-8">
              {questions.map((question, index) => (
                <button
                  className="bg-white bg-opacity-10  text-white py-2 px-2 text-xs md:text-[13px] border border-logo-color-1 rounded-lg shadow-md"
                  key={index}
                  onClick={() => handleQuestionClick(question)} // Handle click
                >
                  {question}
                </button>
              ))}
              {/* <button
                className="bg-white bg-opacity-10  text-white text-xs md:text-[13px] font-semibold py-2 px-2 md:px-3 hover:scale-105 transition delay-150 duration-300 ease-in-out border border-logo-color-1 rounded-lg shadow-lg"
                onClick={() => {
                  onClose(true);
                }}
              >
                Suggestion Box
              </button> */}
            </div>
            <Flex
              // position="fixed"
              // bottom="0"
              className="flex justify-between items-center gap-x-5 bg-[#0e092d] w-full  rounded-full mb-1"
            >
              <div className="form-control ">
                <input
                  value={inputCode}
                  onChange={handleChange}
                  className="input input-alt"
                  placeholder="Type your message here..."
                  required
                  type="text"
                />
                <span className="input-border input-border-alt !left-4"></span>
              </div>
              <Box
                as="button"
                disabled={loading ? true : inputCode.length > 2 ? false : true }
                className="chat-send-button mr-2 disabled:opacity-40 disabled:cursor-auto disabled:before:!bg-gradient-to-l disabled:before:!from-transparent disabled:before:!to-transparent"
                onClick={() => {
                  handleTranslate();
                  // toast({
                  //   variant: "destructive",
                  //   title: "Ai Services is temporary Blocked",
                  //   description: "Please set up Ai in ChatResponse.tsx file",
                  // });
                }}
                // load={loading}
              >
                {loading ? (
                  <Loader2 className="animate-spin w-fit mx-auto" size={26} />
                ) : (
                  "Submit"
                )}
                {/* Submit */}
              </Box>
            </Flex>

            {/* Skills Dialog Box */}
          </div>

          {/* {isOpen && ( */}
          {/* <BasicUsage
            isOpen={isOpen}
            onClose={onClose}
            onSuccess={handleSuccess}
          /> */}
          {/* )} */}
        </div>
      </div>
    </div>
  );
};

export default ChatResponse;
