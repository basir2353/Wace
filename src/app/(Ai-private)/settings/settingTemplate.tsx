"use client";
import { Edit2, Loader2, LoaderPinwheel, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useSupabaseUser } from "@/lib/providers/supabase-user-provider";
import { useSearchParams } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  actionRequestResetPassword,
  actionUpdateUserEmail,
  actionupdateUsername,
  actionUpdateUserPassword,
} from "@/lib/server-actions/auth-actions";
import Loader from "@/components/global/Loader";
import { useToast } from "@/components/ui/use-toast";
import GoBack from "@/components/global/goBackBtn";

const SettingsTemplate = () => {
  return (
    <div className="px-3 max-w-[700px] mx-auto">
      <div className="mb-6">
        <GoBack />
      </div>
      <h2 className="text-2xl mb-4">Settings</h2>
      <UsernameLabel />
      <EmailLabel />
      <PasswordLabel />
    </div>
  );
};

export default SettingsTemplate;

const UsernameLabel = () => {
  const { user, setUser } = useSupabaseUser();
  const [isInputDisabled, setInputDisable] = useState(true);
  const [showUpdateBtn, setUpdateBtn] = useState(false);
  const { toast } = useToast();

  const fullNameFromDatabase =
    user?.full_name ?? "user_" + user?.id?.slice(0, 8);

  const FormSchema = z.object({
    username: z.string().describe("Username").min(4, "Please write full name"),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    mode: "onChange",
    resolver: zodResolver(FormSchema),
    defaultValues: { username: fullNameFromDatabase },
  });

  useEffect(() => {
    if (isInputDisabled === false) {
      form.setFocus("username");
    }
  }, [isInputDisabled]);

  const isLoading = form.formState.isSubmitting;

  const submitHandler = async ({ username }: z.infer<typeof FormSchema>) => {
    if (user && user.id) {
      const { success, message } = await actionupdateUsername({
        username,
        userId: user.id,
      });

      if (success) {
        setInputDisable(true);
        setUpdateBtn(false);
        toast({
          variant: "success",
          description: message,
        });
        setUser({ ...user, full_name: username });
      } else {
        form.setError("username", { message });
      }
    }
  };

  return (
    <Form {...form}>
      <form
        className="space-y-8 mb-4"
        onSubmit={form.handleSubmit(submitHandler)}
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    disabled={isInputDisabled}
                    className="disabled:cursor-auto"
                    {...field}
                    onChange={(e) => {
                      if (
                        form.formState.errors.username?.message ===
                        "Problem in updating username"
                      ) {
                        form.clearErrors("username");
                      }

                      if (e.target.value !== fullNameFromDatabase) {
                        setUpdateBtn(true);
                      } else {
                        setUpdateBtn(false);
                      }

                      field.onChange(e);
                    }}
                  />
                  {isInputDisabled ? (
                    <button
                      onClick={() => {
                        setInputDisable(false);
                      }}
                      type="button"
                      className="absolute h-full aspect-square right-0 top-0 flex justify-center items-center border border-input/50 hover:bg-input/50 rounded-r-md"
                    >
                      <Edit2 size={16} />
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        form.clearErrors("username");
                        form.setValue("username", fullNameFromDatabase);
                        setUpdateBtn(false);
                        setInputDisable(true);
                      }}
                      type="button"
                      className="absolute h-full aspect-square right-0 top-0 flex justify-center items-center border border-input/50 hover:bg-input/50 rounded-r-md"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {showUpdateBtn && form.formState.isValid && (
          <Button
            size="sm"
            className="text-xs !mt-5 bg-slate-600 ml-auto !flex"
            type="submit"
            disabled={isLoading}
          >
            {!isLoading ? (
              "Confirm"
            ) : (
              <Loader2 className="animate-spin" size={16} />
            )}
          </Button>
        )}
      </form>
    </Form>
  );
};

const EmailLabel = () => {
  const { user, setUser } = useSupabaseUser();
  const [isInputDisabled, setInputDisable] = useState(true);
  const emailFromDatabase = user?.email ?? " ";
  const [showUpdateBtn, setUpdateBtn] = useState(false);
  const { toast } = useToast();

  const FormSchema = z.object({
    email: z.string().describe("Email").email({ message: "Invalid Email" }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    mode: "onChange",
    resolver: zodResolver(FormSchema),
    defaultValues: { email: emailFromDatabase },
  });

  useEffect(() => {
    if (isInputDisabled === false) {
      form.setFocus("email");
    }
  }, [isInputDisabled]);

  const isLoading = form.formState.isSubmitting;

  const submitHandler = async ({ email }: z.infer<typeof FormSchema>) => {
    if (user && user.id) {
      const { success, message } = await actionUpdateUserEmail({
        email,
        userId: user.id,
      });

      if (success) {
        setInputDisable(true);
        setUpdateBtn(false);
        toast({
          variant: "success",
          description: message,
        });

        setUser({ ...user, email });
      } else {
        form.setError("email", { message });
      }
    }
  };

  return (
    <Form {...form}>
      <form
        className="space-y-8 mb-4"
        onSubmit={form.handleSubmit(submitHandler)}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    disabled={isInputDisabled}
                    className="disabled:cursor-auto"
                    {...field}
                    onChange={(e) => {
                      if (
                        form.formState.errors.email?.message ===
                        "Problem in updating Email"
                      ) {
                        form.clearErrors("email");
                      }

                      if (e.target.value !== emailFromDatabase) {
                        setUpdateBtn(true);
                      } else {
                        setUpdateBtn(false);
                      }

                      field.onChange(e);
                    }}
                  />
                  {isInputDisabled ? (
                    <button
                      onClick={() => {
                        setInputDisable(false);
                      }}
                      type="button"
                      className="absolute h-full aspect-square right-0 top-0 flex justify-center items-center border border-input/50 hover:bg-input/50 rounded-r-md"
                    >
                      <Edit2 size={16} />
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        form.clearErrors("email");
                        form.setValue("email", emailFromDatabase);
                        setUpdateBtn(false);
                        setInputDisable(true);
                      }}
                      type="button"
                      className="absolute h-full aspect-square right-0 top-0 flex justify-center items-center border border-input/50 hover:bg-input/50 rounded-r-md"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {showUpdateBtn && form.formState.isValid && (
          <Button
            size="sm"
            className="text-xs !mt-5 bg-slate-600 ml-auto !flex"
            type="submit"
          >
            {!isLoading ? (
              "Confirm"
            ) : (
              <Loader2 className="animate-spin" size={16} />
            )}
          </Button>
        )}
        {/* <Button type="submit">Submit</Button> */}
      </form>
    </Form>
  );
};

const PasswordLabel = () => {
  const { user, setUser } = useSupabaseUser();

  const { toast } = useToast();

  const [isInputDisabled, setInputDisable] = useState(false);
  const [showUpdateBtn, setUpdateBtn] = useState(false);
  const [disbalePasswordBtn, setPasswordBtnVisiblity] = useState(
    "Click to Reset Password"
  );
  const searchParams = useSearchParams();
  const type = searchParams?.get("type");

  const FormSchema = z.object({
    password: z.string().describe("Password").min(6, "Weak Password"),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    mode: "onChange",
    resolver: zodResolver(FormSchema),
  });

  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    if (isInputDisabled === false) {
      form.setFocus("password");
    }
  }, [isInputDisabled]);

  const handleResetPasswordReq = async () => {
    setPasswordBtnVisiblity(() => "loading");
    if (user && user.id) {
      const { success, message } = await actionRequestResetPassword({
        email: user.email,
        userId: user.id,
      });

      if (success) {
        setPasswordBtnVisiblity(() => "Password Reset Link Sent");
        toast({
          variant: "success",
          description: message,
        });
      } else {
        toast({
          variant: "destructive",
          description: message,
        });

        // form.setError("email", { message });
      }
    }
  };

  const submitHandler = async ({ password }: z.infer<typeof FormSchema>) => {
    if (user && user.id) {
      const { success, message } = await actionUpdateUserPassword({
        password,
      });

      if (success) {
        setInputDisable(true);
        setUpdateBtn(false);
        toast({
          variant: "success",
          description: message,
        });

        // setUser({ ...user, email });
      } else {
        form.setError("password", { message });
      }
    }
  };

  return type && type === "updatePassword" ? (
    <Form {...form}>
      <form className="space-y-8" onSubmit={form.handleSubmit(submitHandler)}>
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    disabled={isInputDisabled}
                    placeholder="Enter your New Password"
                    className="disabled:cursor-auto"
                    {...field}
                    onChange={(e) => {
                      // if (e.target.value !== emailFromDatabase) {
                      //   setUpdateBtn(true);
                      // } else {
                      //   setUpdateBtn(false);
                      // }

                      // Call React Hook Form's onChange to update the form state
                      field.onChange(e);
                    }}
                  />
                  {isInputDisabled ? (
                    <button
                      onClick={() => {
                        setInputDisable(false);
                      }}
                      type="button"
                      className="absolute h-full aspect-square right-0 top-0 flex justify-center items-center border border-input/50 hover:bg-input/50 rounded-r-md"
                    >
                      <Edit2 size={16} />
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        form.clearErrors("password");
                        form.setValue("password", "");
                        // setUpdateBtn(false);
                        setInputDisable(true);
                      }}
                      type="button"
                      className="absolute h-full aspect-square right-0 top-0 flex justify-center items-center border border-input/50 hover:bg-input/50 rounded-r-md"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.formState.isValid && showUpdateBtn && (
          <Button
            size="sm"
            className="text-xs !mt-5 bg-slate-600 ml-auto !flex"
            type="submit"
          >
            {!isLoading ? (
              "Update"
            ) : (
              <Loader2 className="animate-spin" size={16} />
            )}
          </Button>
        )}
      </form>
    </Form>
  ) : (
    <Button
      size="sm"
      className="text-xs !mt-5 "
      type="button"
      onClick={handleResetPasswordReq}
      disabled={disbalePasswordBtn === "Click to Reset Password" ? false : true}
    >
      {disbalePasswordBtn !== "loading" ? (
        disbalePasswordBtn
      ) : (
        <Loader2 className="animate-spin" size={16} />
      )}
    </Button>
  );
};
