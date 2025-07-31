import { Tab } from '@shadcn/ui'
import { SignInForm } from './SignInForm'
import { SignUpForm } from './SignUpForm'

export function AuthTabs() {
  return (
    <Tab.Root defaultValue="signin">
      <Tab.List className="flex space-x-4 mb-6">
        <Tab.Trigger value="signin">Sign In</Tab.Trigger>
        <Tab.Trigger value="signup">Sign Up</Tab.Trigger>
      </Tab.List>
      <Tab.Content value="signin"><SignInForm /></Tab.Content>
      <Tab.Content value="signup"><SignUpForm /></Tab.Content>
    </Tab.Root>
  )
}
