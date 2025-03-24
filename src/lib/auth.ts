import { db } from "@/lib/db";
import cookie from "cookie";
import { GetServerSidePropsContext } from "next";

export async function getSession(req: GetServerSidePropsContext["req"]) {
  const { sessionId } = cookie.parse(req.headers.cookie || "");

  if (!sessionId) {
    return null;
  }

  const session = await db.session.findUnique({
    where: { id: sessionId },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date()) {
    return null; // session is invalid or expired
  }

  return session;
}
