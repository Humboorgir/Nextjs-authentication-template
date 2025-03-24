import type { GetServerSidePropsContext } from "next";
import type { User } from "@prisma/client";

import GeneralLayout from "@/layouts/general-layout";
import Container from "@/components/ui/container";
import Text from "@/components/ui/text";
import Button from "@/components/ui/button";

import { useSignOut } from "@/hooks/useSignOut";
import { getSession } from "@/lib/auth";

import { LogOut as SignOutIcon } from "lucide-react";

type HomeProps = {
  user: User;
};

export default function Home({ user }: HomeProps) {
  const { signOut, isLoading } = useSignOut();

  return (
    <Container className="flex flex-col items-center text-center">
      <Text variant="h2">Welcome back {user.name}!</Text>
      <div className="w-fit">
        <Text className="mb-3" variant="p">
          This is a protected page.
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
