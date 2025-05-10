import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShieldAlert } from "lucide-react"

export default function AccessDeniedPage() {
  return (
    <div className="container py-12 flex flex-col items-center justify-center min-h-[70vh]">
      <ShieldAlert className="h-16 w-16 text-destructive mb-6" />
      <h1 className="text-4xl font-bold mb-4 text-center">Access Denied</h1>
      <p className="text-xl text-muted-foreground mb-8 text-center max-w-md">
        You don&apos;t have permission to access this page. Please contact the administrator if you believe this is an
        error.
      </p>
      <Button asChild size="lg">
        <Link href="/">Return to Home</Link>
      </Button>
    </div>
  )
}
