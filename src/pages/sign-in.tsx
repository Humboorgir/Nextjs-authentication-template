import React from "react";
import GeneralLayout from "@/layouts/general-layout";
import Container from "@/components/ui/container";
import Text from "@/components/ui/text";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";

import { toast } from "sonner";
import { useRouter } from "next/router";
import { useState } from "react";

import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema, SignInSchema } from "@/lib/schema/sign-in-schema";
import { SignInResponse } from "./api/auth/sign-in";

export default function SignIn() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInSchema>({ resolver: zodResolver(signInSchema) });

  const onSubmit: SubmitHandler<SignInSchema> = async (data) => {
    setIsLoading(true);

    const signUserIn = async () => {
      const res = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data }),
      });

      if (res.ok) {
        router.push("/");
      } else {
        const { message } = (await res.json()) as SignInResponse;
        throw new Error(message);
      }
    };

    toast.promise(signUserIn(), {
      loading: "Authorizing...",
      success: () => {
        router.push("/");
        return `Welcome back!`;
      },
      error: (err) => {
        return err.message;
      },
      finally: () => {
        setIsLoading(false);
      },
    });
  };

  return (
    <Container className="flex flex-col items-center justify-center">
      <Text className="mb-8" variant="h1">
        Welcome back!
      </Text>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-[min(90vw,400px)] flex-col items-center space-y-2 rounded-md border border-ring p-4">
        <Text className="mb-5 mt-0" variant="h3">
          Sign in
        </Text>
        {/* Form fields  */}
        {["Email", "Password"].map((item, i) => {
          const itemLabel = item;
          const itemName = item.toLowerCase() as keyof SignInSchema;
          return (
            <React.Fragment key={i}>
              <Input
                className="w-full"
                placeholder={itemLabel}
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
          Don't have an account?{" "}
          <Button className="!p-1" size="sm" variant="ghost" href="/sign-up">
            Sign up
          </Button>
        </Text>

        <Button className="w-full" type="submit" isLoading={isLoading}>
          Sign in
        </Button>
      </form>
    </Container>
  );
}

SignIn.getLayout = function getLayout(page: React.ReactElement) {
  return <GeneralLayout>{page}</GeneralLayout>;
};
