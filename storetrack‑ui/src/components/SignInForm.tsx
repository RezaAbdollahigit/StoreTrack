import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInSchema, type SignInValues } from "../utils/authSchema";
import { motion } from "framer-motion";
import { signIn } from "../api/auth";

export default function SignInForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({
    resolver: zodResolver(SignInSchema),
  });

  const onSubmit = async (data: SignInValues) => {
    try {
      await signIn(data.email, data.password);
      // TODO: handle token storage + redirect
    } catch (err) {
      console.error("Sign in failed", err);
      // TODO: show error feedback
    }
  };

  const inputClass =
    "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500";

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          {...register("email")}
          className={inputClass}
          placeholder="you@example.com"
        />
        {errors.email && (
          <p className="mt-1 text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          {...register("password")}
          className={inputClass}
        />
        {errors.password && (
          <p className="mt-1 text-red-500 text-sm">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2 font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-gray-400"
      >
        {isSubmitting ? "Signing In…" : "Sign In"}
      </button>
    </motion.form>
  );
}
