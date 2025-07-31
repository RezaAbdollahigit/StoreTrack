import { z } from 'zod'

export const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const SignUpSchema = SignInSchema.extend({
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: "Passwords must match",
})
