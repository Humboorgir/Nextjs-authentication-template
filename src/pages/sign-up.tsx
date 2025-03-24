import type { SignUpResponse } from "./api/auth/sign-up";

import React, { ReactElement } from "react";
import Container from "@/components/ui/container";
import Text from "@/components/ui/text";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";

import { toast } from "sonner";
import { useRouter } from "next/router";
import { useState } from "react";

import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema, UserSchema } from "@/lib/schema/user-schema";
import GeneralLayout from "@/layouts/general-layout";

export default function SignUp() {
  // TODO: implement a hook for signUp
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserSchema>({ resolver: zodResolver(userSchema) });

  const onSubmit: SubmitHandler<UserSchema> = async (data) => {
    setIsLoading(true);

    const signUp = async () => {
      const res = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data }),
      });

      if (res.ok) {
        router.push("/sign-in");
      } else {
        const { message } = (await res.json()) as SignUpResponse;
        throw new Error(message);
      }
    };

    toast.promise(signUp(), {
      loading: "Authorizing...",
      success: () => {
        router.push("/");
        return `Welcome back!`;
      },
      error: (err) => {
        return String(err);
      },
      finally: () => {
        setIsLoading(false);
      },
    });
  };

  return (
    <Container className="flex flex-col items-center justify-center">
      <Text className="mb-8" variant="h1">
        Join us!
      </Text>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-[min(90vw,400px)] flex-col items-center space-y-2 rounded-md border border-ring p-4">
        <Text className="mb-5 mt-0" variant="h3">
          Sign up
        </Text>
        {/* Form fields  */}
        {["Name", "Email", "Password"].map((item, i) => {
          const itemLabel = item;
          const itemName = item.toLowerCase() as keyof UserSchema;
          return (
            <React.Fragment key={i}>
              <Input
                className="w-full"
                placeholder={itemLabel}
                type={itemName == "password" ? "password" : "text"}
                {...register(itemName)}
              />
              {errors[itemName] && (
                <span className="ml-2 self-start text-xs text-red-600">
                  {errors[itemName]?.message}
                </span>
              )}
            </React.Fragment>
          );
        })}
        <Text className="ml-2 mb-2 self-start text-sm" variant="lead">
          Already have an account?{" "}
          <Button className="!p-1" size="sm" variant="ghost" href="/sign-in">
            Sign in
          </Button>
        </Text>

        <Button className="w-full" type="submit" isLoading={isLoading}>
          Sign up
        </Button>
      </form>
    </Container>
  );
}

SignUp.getLayout = function getLayout(page: ReactElement) {
  return <GeneralLayout>{page}</GeneralLayout>;
};
