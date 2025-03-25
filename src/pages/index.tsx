import type { GetServerSidePropsContext } from "next";
import type { User } from "@prisma/client";

import GeneralLayout from "@/layouts/general-layout";
import Container from "@/components/ui/container";
import Text from "@/components/ui/text";
import Button from "@/components/ui/button";

import { useAuth } from "@/hooks/useAuth";
import { getSession } from "@/lib/auth";

import { LogOut as SignOutIcon } from "lucide-react";

type HomeProps = {
  user: User;
};

export default function Home({ user }: HomeProps) {
  const { signOut, isLoading } = useAuth();

  return (
    <>
      <Container className="flex flex-col items-center text-center">
        <Text variant="h2">Welcome back {user.name}!</Text>
        <div className="w-fit">
          <Text className="mb-3 max-w-xs" variant="p">
            This page is server protected.
          </Text>
          <Button
            onClick={signOut}
            className="w-full"
            variant="default"
            isLoading={isLoading}>
            <SignOutIcon className="mr-2 h-3.5 w-3.5" /> Sign out
          </Button>
        </div>
      </Container>

      <Container className="mt-12 text-center">
        <span className="text-foreground-light">
          For a client-protected example, visit
          <Button
            className="ml-1.5 p-0"
            variant="link"
            href="/client-protected">
            http://localhost:3000/client-protected
          </Button>
        </span>
      </Container>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context.req);
  if (!session) {
    return {
      redirect: {
        destination: "/sign-in",
        permanent: false,
      },
    };
  }

  return {
    props: { user: session.user },
  };
}

Home.getLayout = function getLayout(page: React.ReactElement) {
  return <GeneralLayout>{page}</GeneralLayout>;
};
