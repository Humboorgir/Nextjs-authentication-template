import { db } from "@/lib/db";
import cookie from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const cookies = cookie.parse(req.headers.cookie || "");
  const sessionId = cookies.sessionId;

  if (sessionId) {
    await db.session.deleteMany({
      where: { id: sessionId },
    });
  }

  // Remove the cookie by setting it to expire in the past
  res.setHeader(
    "Set-Cookie",
    "sessionId=; HttpOnly; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict"
  );

  res.status(200).json({ message: "Logged out successfully" });
}
