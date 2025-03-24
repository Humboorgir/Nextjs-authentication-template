import type { User } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

import { getSession } from "@/lib/auth";

export type UserResponse = {
  message?: String;
  user?: User;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UserResponse>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const session = await getSession(req);

  if (!session)
    return res.status(401).json({ message: "Invalid or expired session" });

  res.status(200).json({ user: session.user });
}
