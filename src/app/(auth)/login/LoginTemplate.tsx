"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormSchema } from "@/lib/types";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../../../public/wace.png";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loader from "@/components/global/Loader";
// import { signIn } from "next-auth/react";
// import {toast} from "react-hot-toast"
import { actiongetUser, actionLoginUser } from "@/lib/server-actions/auth-actions";
import { useToast } from "@/components/ui/use-toast";
import GoBack from "@/components/global/goBackBtn";
import { useSupabaseUser } from "@/lib/providers/supabase-user-provider";
import { createBrowserBasedClient } from "@/lib/supabase/client";
import { DatabaseUser } from "@/types/types";

const LoginTemplate = () => {
  const router = useRouter();
  const [submitError, setSubmitError] = useState("");
  const { toast } = useToast();
  const { setUser } = useSupabaseUser();
  const supabase = createBrowserBasedClient();

  const form = useForm<z.infer<typeof FormSchema>>({
    mode: "onChange",
    resolver: zodResolver(FormSchema),
    defaultValues: { email: "", password: "" },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async ({ email, password }: z.infer<typeof FormSchema>) => {
    const { success, message } = await actionLoginUser({ email, password });

    if (success === false) {
      setSubmitError(message);
      toast({
        variant: "destructive",
        description: message,
      });
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {

      try {
        const userData: { data: DatabaseUser | null; message: string,success:boolean }   = await actiongetUser({userID:user.id})
        setUser(userData.data);
      } catch (error) {
      }

      
    }
    toast({
      variant: "success",
      description: message,
    });

    router.push("/");
  };

  return (
    <>
      <div
        className="
      h-screen
      p-6 flex flex-col
      items-center
      justify-center"
      >
        <Form {...form}>
          <form
            onChange={() => {
              if (submitError) setSubmitError("");
            }}
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full sm:justify-center sm:w-[400px] space-y-6 flex flex-col"
          >
            <div className="mb-4">
              <GoBack />
            </div>
            <Link
              href="/"
              className="
          w-full
          flex
          justify-left
          items-center"
            >
              <Image src={Logo} alt="cypress Logo" width={100} height={100} />
              <span
                className="font-semibold
          dark:text-white text-4xl first-letter:ml-2"
              >
                Wace
              </span>
            </Link>
            <FormDescription
              className="
        text-foreground/60"
            >
              World&apos;s First AI Business Model Finder
            </FormDescription>
            <FormField
              disabled={isLoading}
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="email" placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={isLoading}
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {submitError && <FormMessage>{submitError}</FormMessage>}
            <Button
              type="submit"
              className="w-full p-6 bg-gradient-to-r from-logo-color-1 to-logo-color-2"
              size="lg"
              disabled={isLoading}
            >
              {!isLoading ? "Login" : <Loader />}
            </Button>

            <span className="self-container">
              Dont have an account?{" "}
              <Link href="/signup" className="text-logo-color-1">
                Sign Up
              </Link>
            </span>
          </form>
        </Form>
      </div>
    </>
  );
};

export default LoginTemplate;
