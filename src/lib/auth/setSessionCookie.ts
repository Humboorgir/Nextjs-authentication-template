import type { NextApiResponse } from "next";

import cookie from "cookie";

export default async function setSessionCookie(
  res: NextApiResponse,
  sessionId: string,
  expiresAt: Date
) {
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("sessionId", sessionId, {
      httpOnly: true,
      path: "/",
      expires: expiresAt,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    })
  );
}
