import { z } from "zod";

// 1. Sign-In schema + inferred type
export const SignInSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
export type SignInValues = z.infer<typeof SignInSchema>;

// 2. Sign-Up schema + inferred type
export const SignUpSchema = SignInSchema.extend({
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords must match",
});
export type SignUpValues = z.infer<typeof SignUpSchema>;