"use client";
import { Button, } from "@chakra-ui/react";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";
import { motion } from "framer-motion";

interface SuggestionRequest {
  skill: string;
  budget: string;
}

interface SuggestionResponse {
  error?: string;
  description?: string;
}

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button as ShadCNBTN } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI("AIzaSyBMG05umJ7MH1GVutEM3tRxSeT41e-TJe8");

export function BasicUsage({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: (state: boolean) => void;
  onSuccess: (message: string, text: string) => void;
}) {
  const [skill, setSkill] = useState("");
  const [budget, setBudget] = useState("");
  const [result, setResult] = useState<SuggestionResponse | null>(null);
  const {toast} = useToast()

  const handleSubmit = async () => {
    toast({
      variant: "destructive",
      title: "Ai Services is temporary Blocked",
      description: "Please set up Ai in ChatResponse.tsx file",
    })
    return;

    // const requestData: SuggestionRequest = { skill, budget };
    // const response = await fetchSuggestion(requestData);
    // setResult(response);

    // if (response.description) {
    //   onSuccess(response.description, skill);
    //   console.log("Dataaa>>>", response.description);
    // } else {
    //   try {
    //     const chatbotResponse = await fetchChatbotResponse(skill);
    //     console.log("Chatbot response:", chatbotResponse);
    //     if (chatbotResponse) {
    //       onSuccess(chatbotResponse, skill);
    //     }
    //   } catch (error) {
    //     console.error("Error fetching chatbot response:", error);
    //   }
    // }
  };

  async function fetchChatbotResponse(
    skill: string
  ): Promise<string | undefined> {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(skill);
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

      return output;
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function fetchSuggestion(
    data: SuggestionRequest
  ): Promise<SuggestionResponse> {
    try {
      const response = await fetch("/api/get-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Error fetching suggestion");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching suggestion:", error);
      return { error: "error.message" };
    }
  }

  const isSubmitDisabled = !skill || !budget;

  return (
    // <div className="h-screen flex justify-center items-center bg-red-200">
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* <DialogOverlay /> */}
      <DialogContent className="h-fit w-full  mt-30">
        <DialogDescription className="bg-[#000000] bg-opacity-90 w-[280px] md:w-full text-white rounded-lg shadow-md h-fit flex gap-2 flex-col py-2 space-y-5">
          <Label className="font-semibold text-lg">
            Skill:
            <Input
              className=" text-[13px] mt-4 "
              placeholder="Enter skill here..."
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
            />
          </Label>
          <Label className="font-semibold text-lg mt-2 flex flex-col">
            Budget:
            <div className="flex gap-1 md:gap-3 w-full mt-2">
              <motion.button
                whileTap={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
                className={`bg-white bg-opacity-10 font-normal text-[14px] text-white py-1 px-2 md:px-4 cursor-pointer border border-logo-color-1 shadow-md h-fit text-center rounded-3xl ${
                  budget === "low" ? "border-logo-color-2" : ""
                }`}
                onClick={() => setBudget("low")}
              >
                Low
              </motion.button>
              <motion.button
                whileTap={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
                className={`bg-white bg-opacity-10 font-normal text-[14px] text-white py-1 px-2 md:px-4 cursor-pointer border border-logo-color-1 shadow-md h-fit text-center rounded-3xl ${
                  budget === "medium" ? "border-logo-color-2" : ""
                }`}
                onClick={() => setBudget("medium")}
              >
                Medium
              </motion.button>
              <motion.button
                whileTap={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
                className={`bg-white bg-opacity-10 font-normal text-[14px] text-white py-1 px-2 md:px-4 cursor-pointer border border-logo-color-1 shadow-md h-fit text-center rounded-3xl ${
                  budget === "high" ? "border-logo-color-2" : ""
                }`}
                onClick={() => setBudget("high")}
              >
                High
              </motion.button>
            </div>
          </Label>
          <div className="flex flex-row justify-end mt-2 ">
           
            <DialogTrigger asChild>
              <ShadCNBTN
                className=""
                onClick={() => {
                  handleSubmit();
                  // onClose();
                }}
                disabled={isSubmitDisabled}
              >
                Submit
              </ShadCNBTN>
            </DialogTrigger>
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
    // </div>
  );
}
