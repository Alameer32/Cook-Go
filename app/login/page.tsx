import LoginForm from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Login to Cook&Go</h1>
      <LoginForm />
    </div>
  )
}
