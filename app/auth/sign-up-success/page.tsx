import Link from "next/link"
import { Shield, Mail, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-8">
          <Shield className="h-8 w-8 text-primary" />
          <div className="flex flex-col text-left">
            <span className="text-lg font-bold text-foreground leading-tight">Consumer Recovery</span>
            <span className="text-xs text-primary font-medium leading-tight">AGENCY</span>
          </div>
        </Link>
        
        <div className="bg-card border border-border rounded-2xl p-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-primary" />
          </div>
          
          <h1 className="text-2xl font-bold text-foreground mb-2">Check Your Email</h1>
          <p className="text-muted-foreground mb-6">
            We&apos;ve sent you a confirmation link. Please check your email and click the link to verify your account.
          </p>
          
          <div className="bg-secondary/50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Mail className="h-5 w-5" />
              <span className="text-sm">Confirmation email sent</span>
            </div>
          </div>
          
          <div className="flex flex-col gap-3">
            <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/auth/login">Go to Login</Link>
            </Button>
            <Button asChild variant="outline" className="w-full border-border text-foreground hover:bg-secondary">
              <Link href="/">Go Home</Link>
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground mt-6">
            Didn&apos;t receive the email? Check your spam folder or try signing up again.
          </p>
        </div>
      </div>
    </div>
  )
}
