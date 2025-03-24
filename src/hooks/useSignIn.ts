import type { SignInSchema } from "@/lib/schema/sign-in-schema";
import type { SignInResponse } from "@/pages/api/auth/sign-in";

import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "sonner";
import { useSWRConfig } from "swr";

export function useSignIn() {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const [isLoading, setIsLoading] = useState(false);

  // Note: If you don't want the toast, remove the next 15 lines of code
  // and return the "signIn" function instead of signInWithToast
  function signInWithToast(data: SignInSchema) {
    setIsLoading(true);
    toast.promise(signIn(data), {
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

    async function signIn(data: SignInSchema) {
      const res = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data }),
      });

      const fetchedData: SignInResponse = await res.json();
      if (!res.ok) throw new Error(fetchedData.message);

      // Refetch data cached from this url (trigger revalidation)
      mutate(`/api/auth/user`, null);

      router.push("/");
    }
  }
  return { signIn: signInWithToast, isLoading };
}
