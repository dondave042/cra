"use client"

import { Shield, User, LogIn } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setIsLoggedIn(!!user)
    }
    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session?.user)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <div className="flex flex-col">
              <span className="text-lg font-bold text-foreground leading-tight">Consumer Recovery</span>
              <span className="text-xs text-primary font-medium leading-tight">AGENCY</span>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
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
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors"
              >
                <User className="h-4 w-4" />
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="hidden sm:flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Link>
                <Link
                  href="/submit-case"
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors"
                >
                  Free Consultation
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
