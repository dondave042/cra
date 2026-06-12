"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Shield, User, Lock, ArrowLeft } from "lucide-react"

export default function AdminLoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Check hardcoded admin credentials
    if (username !== "Admin" || password !== "Admin12345") {
      setError("Invalid admin credentials")
      setLoading(false)
      return
    }

    // Sign in with admin email
    const adminEmail = "admin@consumerrecovery.com"
    const adminPassword = "Admin12345"

    // First try to sign in
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword,
    })

    if (signInError) {
      // If admin doesn't exist, create the admin account
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: adminEmail,
        password: adminPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/admin`,
          data: {
            first_name: "Admin",
            last_name: "User",
          },
        },
      })

      if (signUpError) {
        setError("Failed to create admin account: " + signUpError.message)
        setLoading(false)
        return
      }

      if (signUpData.user) {
        // Create admin profile
        await supabase.from("profiles").upsert({
          id: signUpData.user.id,
          email: adminEmail,
          first_name: "Admin",
          last_name: "User",
          is_admin: true,
        })

        router.push("/admin")
      }
    } else if (data.user) {
      // Ensure admin flag is set
      await supabase.from("profiles").upsert({
        id: data.user.id,
        email: adminEmail,
        first_name: "Admin",
        last_name: "User",
        is_admin: true,
      })

      router.push("/admin")
    }
  }

  return (
    <div className="min-h-screen bg-[#0a1628] flex flex-col">
      <div className="p-4">
        <Link href="/" className="inline-flex items-center gap-2 text-[#94a3b8] hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
      
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <Shield className="w-10 h-10 text-[#d4a853]" />
              <span className="text-2xl font-bold text-white">CRA</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Admin Login</h1>
            <p className="text-[#94a3b8]">Access the administrative dashboard</p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#94a3b8]">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94a3b8]" />
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter admin username"
                  className="pl-10 bg-[#0f2140] border-[#1e4976] text-white placeholder:text-[#64748b] h-12"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#94a3b8]">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94a3b8]" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="pl-10 bg-[#0f2140] border-[#1e4976] text-white placeholder:text-[#64748b] h-12"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#d4a853] hover:bg-[#c49843] text-[#0a1628] font-semibold h-12"
            >
              {loading ? "Signing in..." : "Admin Sign In"}
            </Button>
          </form>

          <p className="text-center mt-6 text-[#94a3b8]">
            Not an admin?{" "}
            <Link href="/auth/login" className="text-[#d4a853] hover:underline">
              User login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
