"use client";
import React from "react";
import { Button } from "../ui/button";
import { actionLogoutUser } from "@/lib/server-actions/auth-actions";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";

const LogoutBtn = () => {
  const { toast } = useToast();
  const router = useRouter();

  const handleLogout = async () => {
    const { success, message } = await actionLogoutUser();

    if (success == false) {
      toast({
        variant: "destructive",
        description: message,
      });
      return;
    }

    router.refresh();
    // permanentRedirect("/")
  };

  return (
    <Button
      variant="btn-secondary"
      className="p-1"
      onClick={handleLogout}
    >
      Logout
    </Button>
  );
};

export default LogoutBtn;
