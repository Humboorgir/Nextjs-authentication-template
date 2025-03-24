import type { NextApiRequest, NextApiResponse } from "next";

import bcrypt from "bcryptjs";
import setSessionCookie from "@/lib/auth/setSessionCookie";
import { signInSchema } from "@/lib/schema/sign-in-schema";
import { db } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export type SignInResponse = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SignInResponse>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { error, data } = signInSchema.safeParse(req.body);
  if (error) return res.status(400).json({ message: error.issues[0].message });

  const { email, password } = data;

  const user = await db.user.findUnique({
    where: { email },
  });

  const invalidCredentialsMessage = "Invalid email or password";
  if (!user) {
    return res.status(401).json({ message: invalidCredentialsMessage });
  }

  const doPasswordsMatch = await bcrypt.compare(password, user.password);
  if (!doPasswordsMatch) {
    return res.status(401).json({ message: invalidCredentialsMessage });
  }

  const sessionId = uuidv4();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

  await db.session.create({
    data: {
      id: sessionId,
      userId: user.id,
      expiresAt,
    },
  });

  setSessionCookie(res, sessionId, expiresAt);

  return res.status(200).json({ message: "Signed in successfully" });
}
