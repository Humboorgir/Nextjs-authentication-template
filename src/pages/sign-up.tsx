import React, { type ReactElement } from "react";
import GeneralLayout from "@/layouts/general-layout";
import Container from "@/components/ui/container";
import Text from "@/components/ui/text";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";

import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema, UserSchema } from "@/lib/schema/user-schema";
import { useAuth } from "@/hooks/useAuth";

export default function SignUp() {
  const { signUp, signIn, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserSchema>({ resolver: zodResolver(userSchema) });

  const onSubmit: SubmitHandler<UserSchema> = async (data) => {
    signUp(data, {
      onSuccess: () => signIn({ email: data.email, password: data.password }),
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
