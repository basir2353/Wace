"use client"
import { useState } from 'react';
import {
  Button,
  Flex,
  Icon,
  Img,
  Text,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { MdAutoAwesome, MdEdit, MdPerson } from 'react-icons/md';
import Bg from "../../../public/wace.png";
import MessageBoxChat from '@/components/chatbot/MessageBox';
import { BasicUsage } from "@/components/chatbot/SuggestionModal";

export default function Chat() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [inputCode, setInputCode] = useState<string>('');
  const [messages, setMessages] = useState<{ user: string; response: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const brandColor = useColorModeValue('brand.500', 'white');
  const gray = useColorModeValue('gray.500', 'white');
  const textColor = useColorModeValue('navy.700', 'white');

  const { GoogleGenerativeAI } = require("@google/generative-ai");
  const genAI = new GoogleGenerativeAI("AIzaSyBMG05umJ7MH1GVutEM3tRxSeT41e-TJe8");

  const handleTranslate = async () => {
    setLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(inputCode);
      const response = await result.response;

      let output = '';
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
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputCode(event.target.value);
  };

  const handleSuccess = (message: string, text: string) => {
    console.log('Message from modal:', message); // Debug statement
    setMessages([...messages, { user: text, response: message }]);
  };

  const handleQuestionClick = async (question: string) => {
    setInputCode(question);
  };

  const questions = [
    "What are you working on today?",
    // "Do you need help with anything?",
    // "Have any questions about your project?",
  ];

  return (
    <>
      <Flex
        pt={{ base: '20px', md: '0px' }}
        direction="column"
        position="relative"
        className='max-w-[2040px] mx-auto'
      >

        
        <div className="grid place-items-center w-full ">
          <Img
            src={Bg.src}
            className="w-full md:w-[460px] h-auto opacity-60"
            style={{ position: 'fixed', bottom: '20%' }}
          />
        </div>




        <Flex
          direction="column"
          mx="auto"
          w={{ base: '100%', md: '100%', xl: '100%' }}
          minH="75vh"
        >
          <Flex direction={'column'} w="100%" mb={messages.length ? '20px' : 'auto'}>
            <div className="flex justify-center text-white text-xs md:text-[13px] ">
              World&apos;s First AI Business Model Finder
            </div>
          </Flex>
          <Flex
            direction="column"
            w="100%"
            mx="auto"
            mb={'auto'}
          >
            {messages.map((msg, index) => (
              <Flex key={index} direction="column" mb="10px" >
                <Flex w="100%" align={'center'} mb="10px" >
                  <Flex
                    borderRadius="full"
                    justify="center"
                    align="center"
                    bg={'transparent'}
                    border="1px solid"
                    borderColor={borderColor}
                    me="20px"
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
                    zIndex={'0'}
                  >
                    <Text
                      color="white"
                      fontWeight="600"
                      cursor="pointer"
                      fontSize={{ base: 'sm', md: 'md' }}
                      lineHeight={{ base: '24px', md: '26px' }}
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
                <Flex w="100%">
                  <Flex
                    borderRadius="full"
                    justify="center"
                    align="center"
                    bg={'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)'}
                    me="20px"
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
          </Flex>
          <div className='flex flex-row justify-between gap-4 items-center pb-16'>
            
            {questions.map((question, index) => (
              <button
                className='bg-white bg-opacity-10  text-white py-2 px-2 text-xs md:text-[13px] border border-logo-color-1 rounded-lg shadow-md'
                key={index}
                onClick={() => handleQuestionClick(question)} // Handle click
              >
                {question}
              </button>
            ))}
            <button className='bg-white bg-opacity-10  text-white text-xs md:text-[13px] font-semibold py-2 px-2 md:px-3 hover:scale-105 transition delay-150 duration-300 ease-in-out border border-logo-color-1 rounded-lg shadow-lg'
              onClick={onOpen}>
              Suggestion Box
            </button>
          </div>
          <Flex
            position="fixed"
            bottom="0"
            className='flex justify-between items-center gap-x-5 bg-[#0e092d] w-full xl:w-[77%] max-w-[2040px]  left-0  xl:left-[23%] rounded-full mb-1 px-3'
          >
            <div className="form-control ">
              <input
                value={inputCode}
                className="input input-alt"
                placeholder="Type your message here..."
                required type="text"
                onChange={handleChange}
              />
              <span className="input-border input-border-alt"></span>
            </div>
            <Button
              className='chat-send-button'
              onClick={handleTranslate}
              isLoading={loading}
            >
              Submit
            </Button>
          </Flex>
        </Flex>



       {/* Skills Dialog Box */}
        {isOpen && <BasicUsage isOpen={isOpen} onClose={onClose} onSuccess={handleSuccess} />}


        
      </Flex>
    </>
  );
}
