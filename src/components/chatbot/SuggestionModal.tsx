"use client";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Button,
  Input,
} from "@chakra-ui/react";
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

const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI("AIzaSyBMG05umJ7MH1GVutEM3tRxSeT41e-TJe8");

export function BasicUsage({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string, text: string) => void;
}) {
  const [skill, setSkill] = useState("");
  const [budget, setBudget] = useState("");
  const [result, setResult] = useState<SuggestionResponse | null>(null);

  const handleSubmit = async () => {
    const requestData: SuggestionRequest = { skill, budget };
    const response = await fetchSuggestion(requestData);
    setResult(response);

    if (response.description) {
      onSuccess(response.description, skill);
      console.log("Dataaa>>>", response.description);
    } else {
      try {
        const chatbotResponse = await fetchChatbotResponse(skill);
        console.log("Chatbot response:", chatbotResponse);
        if (chatbotResponse) {
          onSuccess(chatbotResponse, skill);
        }
      } catch (error) {
        console.error("Error fetching chatbot response:", error);
      }
    }
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
    <div className="h-screen flex justify-center items-center">
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent className="h-fit w-full md:ml-16 md:pt-10 mt-30">
          <ModalBody className="bg-[#000000] bg-opacity-90 w-[280px] md:w-full text-white border border-logo-color-1 rounded-lg shadow-md h-fit flex gap-2 flex-col py-2">
            <Label className="font-semibold text-lg ml-2">
              Skill:
              <Input
                className="text-white text-[13px] mt-4 border-white"
                placeholder="Enter skill here..."
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
              />
            </Label>
            <Label className="font-semibold text-lg ml-2 mt-2 flex flex-col">
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
            <div className="flex flex-row justify-between py-2 ">
              <button
                onClick={onClose}
                className="border-logo-color-2 border rounded-full px-3 py-1"
              >
                Close
              </button>
              <Button
                className="chat-send-buttons bg-transparent"
                onClick={() => {
                  handleSubmit();
                  onClose();
                }}
                isDisabled={isSubmitDisabled}
              >
                Submit
              </Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
