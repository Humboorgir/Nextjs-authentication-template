import { type SignOutResponse } from "@/pages/api/auth/sign-out";
import { type Arguments } from "./";

import { toast } from "sonner";

export function signOutWithToast(args: Arguments) {
  const { setIsLoading, router, mutate } = args;

  toast.promise(signOut(), {
    loading: "Signing out...",
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
