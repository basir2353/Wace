"use client";

import React, { ReactNode } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "@/theme/theme";
const Provider = ({ children }: { children: ReactNode }) => {
  return (
    <ChakraProvider theme={theme}>
        {children}
    </ChakraProvider>
  );
};

export default Provider;
