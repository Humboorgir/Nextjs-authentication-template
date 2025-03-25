import { db } from "@/lib/db";
import cookie from "cookie";
import { GetServerSidePropsContext } from "next";

export async function getSession(req: GetServerSidePropsContext["req"]) {
  const cookies = cookie.parse(req.headers.cookie || "");
  const sessionId = cookies.sessionId;

  if (!sessionId) {
    return null;
  }

  const session = await db.session.findUnique({
    where: { id: sessionId },
    include: { user: true }, // Include user data
  });

  if (!session || session.expiresAt < new Date()) {
    return null;
  }

  return session;
}
