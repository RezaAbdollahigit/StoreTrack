import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@shadcn/ui";
import { Button } from "@shadcn/ui";
import { motion } from "framer-motion";
import { signUp } from "../api/auth"; 

const SignUpSchema = z
  .object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords must match",
  });

type SignUpValues = z.infer<typeof SignUpSchema>;

export function SignUpForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpValues>({
    resolver: zodResolver(SignUpSchema),
  });

  const onSubmit = async (data: SignUpValues) => {
    try {
      await signUp(data.email, data.password);
      // TODO: Handle success (e.g. show toast, redirect)
    } catch (err) {
      // TODO: Handle server error (show error message)
      console.error("Sign up failed", err);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <Input {...register("email")} placeholder="your@email.com" />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <Input type="password" {...register("password")} />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Confirm Password</label>
        <Input type="password" {...register("confirmPassword")} />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Signing Up…" : "Sign Up"}
      </Button>
    </motion.form>
  );
}
