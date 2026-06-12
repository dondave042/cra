"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { 
  Shield, LogOut, FileText, DollarSign, Clock, 
  CheckCircle, AlertCircle, TrendingUp, Plus, 
  Wallet, MessageSquare, User
} from "lucide-react"

type Case = {
  id: string
  case_id: string
  title: string
  scam_type: string
  amount_lost: number
  amount_recovered: number
  status: string
  created_at: string
}

type Message = {
  id: string
  case_id: string
  sender_type: string
  message: string
  is_read: boolean
  created_at: string
}

type Profile = {
  id: string
  email: string
  first_name: string
  last_name: string
  daily_withdrawal_limit: number
}

const statusColors: Record<string, { bg: string; text: string; icon: any }> = {
  under_review: { bg: "bg-yellow-500/20", text: "text-yellow-500", icon: Clock },
  in_progress: { bg: "bg-blue-500/20", text: "text-blue-500", icon: TrendingUp },
  recovered: { bg: "bg-green-500/20", text: "text-green-500", icon: CheckCircle },
  closed: { bg: "bg-gray-500/20", text: "text-gray-500", icon: AlertCircle },
}

const statusLabels: Record<string, string> = {
  under_review: "Under Review",
  in_progress: "In Progress",
  recovered: "Recovered",
  closed: "Closed",
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [cases, setCases] = useState<Case[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"overview" | "cases" | "messages">("overview")
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push("/auth/login")
        return
      }
      
      setUser(user)

      // Fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()
      
      setProfile(profileData)

      // Fetch cases
      const { data: casesData } = await supabase
        .from("cases")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
      
      setCases(casesData || [])

      // Fetch messages
      const { data: messagesData } = await supabase
        .from("messages")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
      
      setMessages(messagesData || [])
      setLoading(false)
    }

    fetchData()
  }, [supabase, router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const totalLost = cases.reduce((sum, c) => sum + c.amount_lost, 0)
  const totalRecovered = cases.reduce((sum, c) => sum + c.amount_recovered, 0)
  const unreadMessages = messages.filter(m => !m.is_read && m.sender_type === "admin").length

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#d4a853]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a1628]">
      {/* Header */}
      <header className="bg-[#0f2140] border-b border-[#1e4976] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-[#d4a853]" />
            <span className="text-xl font-bold text-white">CRA</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <span className="text-[#94a3b8] text-sm hidden md:block">
              Welcome, {profile?.first_name || user?.email}
            </span>
            <Button
              onClick={handleSignOut}
              variant="ghost"
              className="text-[#94a3b8] hover:text-white hover:bg-[#1a3a5c]"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          <Button
            onClick={() => setActiveTab("overview")}
            variant={activeTab === "overview" ? "default" : "ghost"}
            className={activeTab === "overview" 
              ? "bg-[#d4a853] text-[#0a1628] hover:bg-[#c49843]" 
              : "text-[#94a3b8] hover:text-white hover:bg-[#1a3a5c]"
            }
          >
            <User className="w-4 h-4 mr-2" />
            Overview
          </Button>
          <Button
            onClick={() => setActiveTab("cases")}
            variant={activeTab === "cases" ? "default" : "ghost"}
            className={activeTab === "cases" 
              ? "bg-[#d4a853] text-[#0a1628] hover:bg-[#c49843]" 
              : "text-[#94a3b8] hover:text-white hover:bg-[#1a3a5c]"
            }
          >
            <FileText className="w-4 h-4 mr-2" />
            My Cases
          </Button>
          <Button
            onClick={() => setActiveTab("messages")}
            variant={activeTab === "messages" ? "default" : "ghost"}
            className={activeTab === "messages" 
              ? "bg-[#d4a853] text-[#0a1628] hover:bg-[#c49843]" 
              : "text-[#94a3b8] hover:text-white hover:bg-[#1a3a5c]"
            }
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Messages
            {unreadMessages > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {unreadMessages}
              </span>
            )}
          </Button>
          <Link href="/dashboard/withdraw">
            <Button variant="ghost" className="text-[#94a3b8] hover:text-white hover:bg-[#1a3a5c]">
              <Wallet className="w-4 h-4 mr-2" />
              Withdraw
            </Button>
          </Link>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-[#0f2140] border border-[#1e4976] rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-[#d4a853]/20 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-[#d4a853]" />
                  </div>
                  <span className="text-[#94a3b8]">Total Cases</span>
                </div>
                <p className="text-3xl font-bold text-white">{cases.length}</p>
              </div>

              <div className="bg-[#0f2140] border border-[#1e4976] rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-red-500" />
                  </div>
                  <span className="text-[#94a3b8]">Amount Lost</span>
                </div>
                <p className="text-3xl font-bold text-white">${totalLost.toLocaleString()}</p>
              </div>

              <div className="bg-[#0f2140] border border-[#1e4976] rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  </div>
                  <span className="text-[#94a3b8]">Amount Recovered</span>
                </div>
                <p className="text-3xl font-bold text-green-500">${totalRecovered.toLocaleString()}</p>
              </div>

              <div className="bg-[#0f2140] border border-[#1e4976] rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-blue-500" />
                  </div>
                  <span className="text-[#94a3b8]">Available to Withdraw</span>
                </div>
                <p className="text-3xl font-bold text-white">${totalRecovered.toLocaleString()}</p>
              </div>
            </div>

            {/* Recent Cases */}
            <div className="bg-[#0f2140] border border-[#1e4976] rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Recent Cases</h2>
                <Link href="/submit-case">
                  <Button className="bg-[#d4a853] hover:bg-[#c49843] text-[#0a1628]">
                    <Plus className="w-4 h-4 mr-2" />
                    New Case
                  </Button>
                </Link>
              </div>

              {cases.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-[#94a3b8] mx-auto mb-4" />
                  <p className="text-[#94a3b8] mb-4">No cases submitted yet</p>
                  <Link href="/submit-case">
                    <Button className="bg-[#d4a853] hover:bg-[#c49843] text-[#0a1628]">
                      Submit Your First Case
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {cases.slice(0, 5).map((caseItem) => {
                    const status = statusColors[caseItem.status] || statusColors.under_review
                    const StatusIcon = status.icon
                    return (
                      <div key={caseItem.id} className="bg-[#0a1628] border border-[#1e4976] rounded-lg p-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-mono text-[#d4a853]">{caseItem.case_id}</span>
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${status.bg} ${status.text}`}>
                                <StatusIcon className="w-3 h-3" />
                                {statusLabels[caseItem.status]}
                              </span>
                            </div>
                            <h3 className="text-white font-medium">{caseItem.title}</h3>
                            <p className="text-sm text-[#94a3b8]">
                              {new Date(caseItem.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="text-right">
                              <p className="text-xs text-[#94a3b8]">Amount Lost</p>
                              <p className="text-white font-semibold">${caseItem.amount_lost.toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-[#94a3b8]">Recovered</p>
                              <p className="text-green-500 font-semibold">${caseItem.amount_recovered.toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Cases Tab */}
        {activeTab === "cases" && (
          <div className="bg-[#0f2140] border border-[#1e4976] rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">All Cases</h2>
              <Link href="/submit-case">
                <Button className="bg-[#d4a853] hover:bg-[#c49843] text-[#0a1628]">
                  <Plus className="w-4 h-4 mr-2" />
                  New Case
                </Button>
              </Link>
            </div>

            {cases.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-[#94a3b8] mx-auto mb-4" />
                <p className="text-[#94a3b8] mb-4">No cases submitted yet</p>
                <Link href="/submit-case">
                  <Button className="bg-[#d4a853] hover:bg-[#c49843] text-[#0a1628]">
                    Submit Your First Case
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {cases.map((caseItem) => {
                  const status = statusColors[caseItem.status] || statusColors.under_review
                  const StatusIcon = status.icon
                  return (
                    <div key={caseItem.id} className="bg-[#0a1628] border border-[#1e4976] rounded-lg p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-mono text-[#d4a853]">{caseItem.case_id}</span>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${status.bg} ${status.text}`}>
                              <StatusIcon className="w-3 h-3" />
                              {statusLabels[caseItem.status]}
                            </span>
                          </div>
                          <h3 className="text-white font-medium">{caseItem.title}</h3>
                          <p className="text-sm text-[#94a3b8]">
                            {caseItem.scam_type.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())} - {new Date(caseItem.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="text-xs text-[#94a3b8]">Amount Lost</p>
                            <p className="text-white font-semibold">${caseItem.amount_lost.toLocaleString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-[#94a3b8]">Recovered</p>
                            <p className="text-green-500 font-semibold">${caseItem.amount_recovered.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === "messages" && (
          <div className="bg-[#0f2140] border border-[#1e4976] rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Messages from Support</h2>

            {messages.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="w-12 h-12 text-[#94a3b8] mx-auto mb-4" />
                <p className="text-[#94a3b8]">No messages yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`p-4 rounded-lg ${
                      msg.sender_type === "admin" 
                        ? "bg-[#1a3a5c] border-l-4 border-[#d4a853]" 
                        : "bg-[#0a1628] border border-[#1e4976]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm font-medium ${
                        msg.sender_type === "admin" ? "text-[#d4a853]" : "text-[#94a3b8]"
                      }`}>
                        {msg.sender_type === "admin" ? "Support Team" : "You"}
                      </span>
                      <span className="text-xs text-[#64748b]">
                        {new Date(msg.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-white">{msg.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
