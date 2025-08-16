'use client';
// Chakra imports
import { Flex, useColorModeValue } from '@chakra-ui/react';
import { HSeparator } from '@/components/chatbot/separator/Separator';
import Image from 'next/image';
import logo from "../../../../../public/wace.png";

export function SidebarBrand() {
  return (
    <Flex flexDirection="column">
      <div className="flex items-center gap-x-1 mb-2 justify-center">
        <div className='w-[80px]'>
          <Image className='site-logo object-contain' src={logo} alt='image' />

        </div>

        <span className='text-2xl font-bold'>Wace</span>
      </div>
      <HSeparator mb="20px" w="284px" />
    </Flex>
  );
}

export default SidebarBrand;
