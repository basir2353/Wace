'use client';
/* eslint-disable */
// Chakra Imports
import {
  Box,
  Flex,
  useColorModeValue,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import AdminNavbarLinks from './NavbarLinksAdmin';
import { isWindowAvailable } from '@/utils/navigation';

export default function AdminNavbar(props: {
  secondary: boolean;
  brandText: string;
  logoText: string;
  onOpen: (...args: any[]) => any;
  setApiKey: any;
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    isWindowAvailable() && window.addEventListener('scroll', changeNavbar);

    return () => {
      isWindowAvailable() && window.removeEventListener('scroll', changeNavbar);
    };
  });

  const { secondary, brandText, setApiKey } = props;

  // Here are all the props that may change depending on navbar's type or state.(secondary, variant, scrolled)
  let navbarPosition = 'fixed' as const;
  let gap = '0px';
  const changeNavbar = () => {
    if (isWindowAvailable() && window.scrollY > 1) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  return (
    <Box
      zIndex="100"
      position={navbarPosition}
      transitionDelay="0s, 0s, 0s, 0s"
      transitionDuration=" 0.25s, 0.25s, 0.25s, 0s"
      alignItems={{ xl: 'center' }}
      display={secondary ? 'block' : 'flex'}
      minH="75px"
      justifyContent={{ xl: 'center' }}
      mx="auto"
      right={{ base: '12px', md: '30px', lg: '30px', xl: '30px' }}
      px={{
        base: '8px',
        md: '10px',
      }}
      ps={{
        base: '8px',
        md: '12px',
      }}
      pt="8px"
      top={{ base: '12px', md: '16px', xl: '18px' }}
      w={{
        base: 'calc(100vw - 8%)',
        md: 'calc(100vw - 8%)',
        lg: 'calc(100vw - 6%)',
        xl: 'calc(100vw - 350px)',
        '2xl': 'calc(100vw - 365px)',
      }}
      border="1px solid red"
    >
      <Flex
        w="100%"
        flexDirection={{
          base: 'column',
          md: 'row',
        }}
        alignItems={{ xl: 'center' }}
        mb={gap}
        border="1px solid red"
      >

        <Box ms="auto" w={{ sm: '100%', md: 'unset' }}  border="1px solid red" >
          <AdminNavbarLinks setApiKey={setApiKey} secondary={props.secondary} />
        </Box>
      </Flex>
    </Box>
  );
}
