"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import Logo from "../../../../public/wace.png";
import Loader from "@/components/global/Loader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MailCheck } from "lucide-react";
import { FormSchema } from "@/lib/types";
import { actionSignUpUser } from "@/lib/server-actions/auth-actions";
import { useToast } from "@/components/ui/use-toast";
import GoBack from "@/components/global/goBackBtn";

const SignUpFormSchema = z
  .object({
    email: z.string().describe("Email").email({ message: "Invalid Email" }),
    password: z
      .string()
      .describe("Password")
      .min(6, "Password must be minimum 6 characters"),
    confirmPassword: z
      .string()
      .describe("Confirm Password")
      .min(6, "Password must be minimum 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });

const Signup = () => {
  const router = useRouter();
  // const codeExchangeError = searchParams?.get("error_description");
  const [submitError, setSubmitError] = useState("");
  const [confirmation, setConfirmation] = useState(false);
  const [codeExchangeError, setCodeExchangeError] = useState("");
  const [confirmationAndErrorStyles, setConfirmationAndErrorStyles] =
    useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (codeExchangeError) {
      setConfirmationAndErrorStyles(
        clsx("bg-primary", {
          "bg-red-500/10": codeExchangeError,
          "border-red-500/50": codeExchangeError,
          "text-red-700": codeExchangeError,
        })
      );
    }
  }, [codeExchangeError]);

  // const codeExchangeError = useMemo(() => {
  //   if (!searchParams) return "";
  //   return searchParams.get("error_description");
  // }, [searchParams]);

  // const confirmationAndErrorStyles = useMemo(
  //   () =>
  //     clsx("bg-primary", {
  //       "bg-red-500/10": codeExchangeError ? codeExchangeError : "",
  //       "border-red-500/50": codeExchangeError ? codeExchangeError : "",
  //       "text-red-700": codeExchangeError ? codeExchangeError : "",
  //     }),
  //   [codeExchangeError]
  // );

  const form = useForm<z.infer<typeof SignUpFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async ({ email, password }: z.infer<typeof FormSchema>) => {
    const { success, message } = await actionSignUpUser({ email, password });
    if (success === false) {
      setSubmitError(message);
      toast({
        variant: "destructive",
        description: message,
      });
      return;
    }

    toast({
      variant: "success",
      description: message,
    });

    setConfirmation(true);
  };

  const updateCodeExchange = (state: string) => {
    setCodeExchangeError(state);
  };
  return (
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
          className="w-full sm:justify-center sm:w-[400px]
        space-y-6 flex
        flex-col
        "
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
          {!confirmation && !codeExchangeError && (
            <>
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
                      <Input
                        type="password"
                        placeholder="Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                disabled={isLoading}
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirm Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full p-6 bg-gradient-to-r from-logo-color-1 to-logo-color-2"
                disabled={isLoading}
              >
                {!isLoading ? "Create Account" : <Loader />}
              </Button>
            </>
          )}

          {submitError && <FormMessage>{submitError}</FormMessage>}
          <span className="self-container">
            Already have an account?{" "}
            <Link href="/login" className="text-logo-color-1">
              Login
            </Link>
          </span>
          <Suspense>
            <AlertDetailsComp
              confirmation={confirmation}
              confirmationAndErrorStyles={confirmationAndErrorStyles}
              updateCodeExChnage={updateCodeExchange}
            />
          </Suspense>
        </form>
      </Form>
    </div>
  );
};

const AlertDetailsComp = ({
  confirmation,
  confirmationAndErrorStyles,
  updateCodeExChnage,
}: {
  confirmation: boolean;
  confirmationAndErrorStyles: string;
  updateCodeExChnage: (state: string) => void;
}) => {
  const searchParams = useSearchParams();
  const codeExchangeError = searchParams?.get("error_description");

  useEffect(() => {
    if (codeExchangeError) {
      updateCodeExChnage(codeExchangeError);
    }
  }, [searchParams]);

  return (
    (confirmation || codeExchangeError) && (
      <>
        <Alert className={confirmationAndErrorStyles}>
          {!codeExchangeError && <MailCheck className="h-4 w-4" />}
          <AlertTitle>
            {codeExchangeError ? "Invalid Link" : "Check your email."}
          </AlertTitle>
          <AlertDescription>
            {codeExchangeError || "An email confirmation has been sent."}
          </AlertDescription>
        </Alert>
      </>
    )
  );
};

export default Signup;
