import { GetServerSidePropsContext } from "next";
import { getSession } from "../lib/auth";

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

export default function Dashboard({ user }: { user: any }) {
  return <h1>Welcome, {user.name}</h1>;
}
