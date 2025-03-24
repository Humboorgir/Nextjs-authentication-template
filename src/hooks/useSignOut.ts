import type { SignOutResponse } from "@/pages/api/auth/sign-out";

import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "sonner";
import { useSWRConfig } from "swr";

export function useSignOut() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { mutate } = useSWRConfig();

  // Note: If you don't want the toast, remove the next 15 lines of code
  // and return the "signOut" function instead of signOutWithToast
  function signOutWithToast() {
    toast.promise(signOut(), {
      loading: "Authorizing...",
      success: () => {
        router.push("/");
        return `Signed out successfully!`;
      },
      error: (err) => {
        return err.message;
      },
      finally: () => {
        setIsLoading(false);
      },
    });

    async function signOut() {
      const res = await fetch("/api/auth/sign-out", {
        method: "DELETE",
      });

      const data: SignOutResponse = await res.json();
      if (!res.ok) throw new Error(data.message);

      // Refetch data cached from this url (trigger revalidation)
      mutate(`/api/auth/user`, null);

      router.push("/sign-in");
    }
  }

  return { signOut: signOutWithToast, isLoading };
}
