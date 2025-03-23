import { NextApiResponse } from "next";
import { cookies } from "next/headers";

export default async function setSessionCookie(
  res: NextApiResponse,
  token: string,
  expiresAt: Date
): Promise<void> {
  res.setHeader(
    "Set-Cookie",
    `sessionId=${token}; HttpOnly; Path=/; Expires=${expiresAt.toUTCString()}; SameSite=Strict; ${
      process.env.NODE_ENV === "production" ? "Secure" : ""
    }`
  );
}
