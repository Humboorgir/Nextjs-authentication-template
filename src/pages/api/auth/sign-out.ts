import type { NextApiRequest, NextApiResponse } from "next";

import cookie from "cookie";
import { db } from "@/lib/db";

export type SignOutResponse = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SignOutResponse>
) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const cookies = cookie.parse(req.headers.cookie || "");
  const sessionId = cookies.sessionId;

  if (!sessionId)
    return res.status(400).json({ message: "User is not logged in" });

  if (sessionId) {
    await db.session.delete({
      where: { id: sessionId },
    });
  }

  // Remove the cookie by setting it to expire in the past
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("sessionId", sessionId, {
      httpOnly: true,
      path: "/",
      expires: new Date(0),
      sameSite: "strict",
    })
  );

  res.status(200).json({ message: "Logged out successfully" });
}
