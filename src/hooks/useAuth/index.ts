// Separated into multiple files cause it's a pretty large hook.

import { type ScopedMutator, useSWRConfig } from "swr";
import { type SignInSchema } from "@/lib/schema/sign-in-schema";
import { type UserSchema } from "@/lib/schema/user-schema";

import { type NextRouter, useRouter } from "next/router";
import React, { useState } from "react";

import { signInWithToast } from "./signIn";
import { type SignUpOptions, signUpWithToast } from "./signUp";
import { signOutWithToast } from "./signOut";

export type Arguments = {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  router: NextRouter;
  mutate: ScopedMutator;
};

export function useAuth() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { mutate } = useSWRConfig();

  const args = { setIsLoading, router, mutate };

  const signIn = (data: SignInSchema) => signInWithToast(args, data);
  const signUp = (data: UserSchema, options: SignUpOptions) => signUpWithToast(args, data, options);

  const signOut = () => signOutWithToast(args);

  return { signUp, signIn, signOut, isLoading };
}
