"use client";
import React from "react";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const GoBack = () => {
  const router = useRouter();
  return (
    <Button
      type="button"
      onClick={() => router.back()}
      variant={"outline"}
      className="px-3 py-1 group hover:bg-primary"
    >
      <ArrowLeft size={"16"} className="group-hover:text-white mr-2" />
      Back
    </Button>
  );
};

export default GoBack;
