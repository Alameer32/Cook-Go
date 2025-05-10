import { Suspense } from "react"
import LoginForm from "@/components/auth/login-form"

export default function LoginPage({ searchParams }: { searchParams: { callbackUrl?: string } }) {
  const callbackUrl = searchParams.callbackUrl || "/"

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Login to Cook&Go</h1>
      <Suspense fallback={<div className="text-center">Loading...</div>}>
        <LoginForm callbackUrl={callbackUrl} />
      </Suspense>
    </div>
  )
}
