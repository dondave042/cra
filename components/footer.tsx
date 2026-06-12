import { Shield, Lock } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-background border-t border-border py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Link href="/" className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-foreground leading-tight">Consumer Recovery</span>
                <span className="text-[10px] text-primary font-medium leading-tight">AGENCY</span>
              </div>
            </Link>
            
            <nav className="flex flex-wrap items-center justify-center gap-6">
              <Link href="#about" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                About
              </Link>
              <Link href="#services" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                Services
              </Link>
              <Link href="#process" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                Process
              </Link>
              <Link href="#faq" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                FAQ
              </Link>
              <Link href="#contact" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                Contact
              </Link>
            </nav>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-border">
            <p className="text-muted-foreground text-sm text-center md:text-left">
              © {new Date().getFullYear()} Consumer Recovery Agency. All rights reserved.
            </p>
            
            <Link 
              href="/auth/admin-login" 
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              <Lock className="h-4 w-4" />
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
