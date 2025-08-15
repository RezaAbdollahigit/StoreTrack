import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInSchema, type SignInValues } from "../utils/authSchema";
import { motion } from "framer-motion";
import { signIn } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { useState } from 'react';
import { AxiosError } from "axios";

export default function SignInForm() {
  const { login } = useAuth();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({
    resolver: zodResolver(SignInSchema),
  });

  const onSubmit = async (data: SignInValues) => {
    setApiError(null); // Reset previous errors
    try {
      const response = await signIn(data.email, data.password);
      // Assuming the API returns a token like: { "token": "..." }
      if (response.data && response.data.token) {
        login(response.data.token);
        // The router in App.tsx will now handle the redirect automatically
      } else {
         // Handle cases where the token is missing in the response
        setApiError("Login successful, but no token was received.");
      }
    } catch (err) {
      if (err instanceof AxiosError && err.response) {
        // Use a specific error message from the API if available
        setApiError(err.response.data.message || "Invalid email or password.");
      } else {
        // Generic fallback error message
        setApiError("An unexpected error occurred. Please try again.");
      }
      console.error("Sign in failed", err);
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
        <label htmlFor="email-signin" className="block text-sm font-medium mb-1">Email</label>
        <input
          id="email-signin"
          type="email"
          {...register("email")}
          className={inputClass}
          placeholder="you@example.com"
          autoComplete="email"
        />
        {errors.email && (
          <p className="mt-1 text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password-signin" className="block text-sm font-medium mb-1">Password</label>
        <input
          id="password-signin"
          type="password"
          {...register("password")}
          className={inputClass}
          autoComplete="current-password"
        />
        {errors.password && (
          <p className="mt-1 text-red-500 text-sm">{errors.password.message}</p>
        )}
      </div>

      {apiError && (
         <p className="text-red-500 text-sm text-center">{apiError}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2 font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-gray-400 transition-colors"
      >
        {isSubmitting ? "Signing In…" : "Sign In"}
      </button>
    </motion.form>
  );
}