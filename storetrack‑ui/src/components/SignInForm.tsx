import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SignInSchema, type SignInSchema as SignInValues } from '@/utils/authSchema'
import { Input } from '@shadcn/ui'
import { Button } from '@shadcn/ui'
import { motion } from 'framer-motion'
import { signIn } from '../api/auth'

export function SignInForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<SignInValues>({ resolver: zodResolver(SignInSchema) })

  const onSubmit = async (data: SignInValues) => {
    await signIn(data.email, data.password)
    // handle token + redirect…
  }

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div>
        <label>Email</label>
        <Input {...register('email')} placeholder="you@company.com" />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      </div>
      <div>
        <label>Password</label>
        <Input type="password" {...register('password')} />
        {errors.password && <p className="text-red-500">{errors.password.message}</p>}
      </div>
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Signing In…' : 'Sign In'}
      </Button>
    </motion.form>
  )
}
