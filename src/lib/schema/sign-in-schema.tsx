import { userSchema } from "./user-schema";
import z from "zod";

export const signInSchema = userSchema.pick({ email: true, password: true });
export type SignInSchema = z.infer<typeof signInSchema>;
