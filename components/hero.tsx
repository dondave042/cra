"use client"

import { Shield, Lock, Users, CheckCircle } from "lucide-react"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-card" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-sm text-primary font-medium">Trusted by 2,800,000+ Consumers Nationwide</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
            Recover What&apos;s Rightfully Yours
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 text-pretty">
            Lost funds to fraud, scams, or unauthorized charges? Our expert team has helped consumers recover over $30 billion. Let us fight for your money.
          </p>
          
          <Link
            href="#contact"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary/90 transition-colors"
          >
            Start Your Free Case Review
          </Link>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-3xl mx-auto">
            <div className="flex items-center gap-2 justify-center">
              <Lock className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">Confidential & secure</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <Users className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">Experienced recovery specialists</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">Free case evaluation</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">No upfront fees</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
