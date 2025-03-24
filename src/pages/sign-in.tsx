import type { GetServerSidePropsContext } from "next";

import React from "react";
import GeneralLayout from "@/layouts/general-layout";
import Container from "@/components/ui/container";
import Text from "@/components/ui/text";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";

import { useSignIn } from "@/hooks/useSignIn";

import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema, SignInSchema } from "@/lib/schema/sign-in-schema";
import { getSession } from "@/lib/auth";

export default function SignIn() {
  const { signIn, isLoading } = useSignIn();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInSchema>({ resolver: zodResolver(signInSchema) });

  const onSubmit: SubmitHandler<SignInSchema> = async (data) => {
    signIn(data);
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

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context.req);
  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

SignIn.getLayout = function getLayout(page: React.ReactElement) {
  return <GeneralLayout>{page}</GeneralLayout>;
};
