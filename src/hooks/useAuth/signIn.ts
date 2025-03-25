import { type SignInSchema } from "@/lib/schema/sign-in-schema";
import { type SignInResponse } from "@/pages/api/auth/sign-in";
import { type Arguments } from "./";

import { toast } from "sonner";

export function signInWithToast(args: Arguments, data: SignInSchema) {
  const { setIsLoading, router, mutate } = args;

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
