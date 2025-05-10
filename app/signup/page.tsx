import SignupForm from "@/components/auth/signup-form"

export default function SignupPage() {
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Create a Cook&Go Account</h1>
      <SignupForm />
    </div>
  )
}
