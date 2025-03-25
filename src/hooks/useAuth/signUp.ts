import { type Arguments } from "./";
import { type UserSchema } from "@/lib/schema/user-schema";
import { type SignUpResponse } from "@/pages/api/auth/sign-up";

import { toast } from "sonner";

export type SignUpOptions = {
  onSuccess: VoidFunction;
};

export function signUpWithToast(args: Arguments, data: UserSchema, { onSuccess }: SignUpOptions) {
  const { setIsLoading, router } = args;

  toast.promise(signUp(), {
    loading: "Creating account...",
    success: (message) => {
      router.push("/sign-in");

      if (onSuccess) onSuccess();
      return message;
    },
    error: (err) => {
      return err.message;
    },
    finally: () => {
      setIsLoading(false);
    },
  });

  async function signUp() {
    const res = await fetch("/api/auth/sign-up", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data }),
    });

    const { message } = (await res.json()) as SignUpResponse;

    if (!res.ok) {
      throw new Error(message);
    }

    return message;
  }
}
