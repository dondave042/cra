import Link from "next/link"
import { Shield, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AuthErrorPage() {
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
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          
          <h1 className="text-2xl font-bold text-foreground mb-2">Authentication Error</h1>
          <p className="text-muted-foreground mb-6">
            Something went wrong during authentication. Please try again or contact support if the problem persists.
          </p>
          
          <div className="flex flex-col gap-3">
            <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/auth/login">Try Again</Link>
            </Button>
            <Button asChild variant="outline" className="w-full border-border text-foreground hover:bg-secondary">
              <Link href="/">Go Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
