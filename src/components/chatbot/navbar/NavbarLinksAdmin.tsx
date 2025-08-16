'use client';
// Chakra Imports
import {
  Flex,
} from '@chakra-ui/react';
import { SidebarResponsive } from '@/components/chatbot/sidebar/Sidebar';
import routes from '@/routes';

export default function HeaderLinks(props: {
  secondary: boolean;
  setApiKey: any;
}) {
  const { secondary, setApiKey } = props;
  return (
    <Flex
      zIndex="100"
      border="1px solid red" 
      w={{ sm: '100%', md: 'auto' }}
      alignItems="center"
      flexDirection="row"
      flexWrap={secondary ? { base: 'wrap', md: 'nowrap' } : 'unset'}
      p="10px"
    >
      
      <SidebarResponsive routes={routes} />
      {/* <APIModal setApiKey={setApiKey} /> */}
    </Flex>
  );
}
