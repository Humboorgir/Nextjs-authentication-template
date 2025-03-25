import GeneralLayout from "@/layouts/general-layout";
import Container from "@/components/ui/container";
import Text from "@/components/ui/text";
import Button from "@/components/ui/button";
import Skeleton from "@/components/ui/skeleton";

import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { LogOut as SignOutIcon } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const { signOut, isLoading: isSignOutPending } = useAuth();

  useEffect(() => {
    if (!user) router.push("/sign-in");
  }, [user]);

  if (!user) return <Container>Redirecting to sign in...</Container>;

  return (
    <Container className="flex flex-col items-center text-center">
      <Text variant="h2">
        {isLoading ? (
          <Skeleton className="w-[300px]" />
        ) : (
          <>Welcome back {user?.name}!</>
        )}
      </Text>
      <div className="w-fit">
        <Text className="mb-3 max-w-xs" variant="p">
          This page is client protected.
        </Text>
        <Button
          onClick={signOut}
          className="w-full"
          variant="default"
          isLoading={isSignOutPending}>
          <SignOutIcon className="mr-2 h-3.5 w-3.5" /> Sign out
        </Button>
      </div>
    </Container>
  );
}

Home.getLayout = function getLayout(page: React.ReactElement) {
  return <GeneralLayout>{page}</GeneralLayout>;
};
