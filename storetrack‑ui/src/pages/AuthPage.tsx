import { AuthTabs } from '../components/AuthTabs'

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6 bg-white rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-4">Welcome to StoreTrack</h1>
        <AuthTabs />
      </div>
    </div>
  )
}
