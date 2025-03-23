import { db } from "@/lib/db";
import { userSchema } from "@/lib/schema/user-schema";
import bcrypt from "bcryptjs";
import { NextApiRequest, NextApiResponse } from "next";

export type SignUpResponse = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SignUpResponse>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { error, data } = userSchema.safeParse(req.body);

  if (error) return res.status(400).json({ message: error.issues[0].message });

  const { email, name, password } = data;

  const existingUser = await db.user.findUnique({ where: { email } });
  if (existingUser) {
    return res
      .status(409)
      .json({ message: "A user with that email already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
  } catch (e) {
    return res.status(500).json({ message: "Failed to save user account" });
  }

  res.status(201).json({ message: "Account created successfully" });
}
