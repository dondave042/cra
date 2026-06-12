"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Shield, LogOut, Users, FileText, Wallet, 
  MessageSquare, DollarSign, TrendingUp, 
  Search, Edit2, Trash2, Send, X, Check
} from "lucide-react"

type User = {
  id: string
  email: string
  first_name: string
  last_name: string
  phone: string
  is_admin: boolean
  daily_withdrawal_limit: number
  created_at: string
}

type Case = {
  id: string
  user_id: string
  case_id: string
  title: string
  scam_type: string
  amount_lost: number
  amount_recovered: number
  status: string
  created_at: string
  profiles?: { email: string; first_name: string; last_name: string }
}

type Withdrawal = {
  id: string
  user_id: string
  amount: number
  method: string
  status: string
  wallet_address?: string
  bank_details?: any
  admin_note?: string
  created_at: string
  profiles?: { email: string; first_name: string; last_name: string }
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "cases" | "withdrawals" | "messages">("overview")
  const [users, setUsers] = useState<User[]>([])
  const [cases, setCases] = useState<Case[]>([])
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  
  // Modal states
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [editingCase, setEditingCase] = useState<Case | null>(null)
  const [editingWithdrawal, setEditingWithdrawal] = useState<Withdrawal | null>(null)
  const [messageModal, setMessageModal] = useState<{ userId: string; caseId?: string } | null>(null)
  const [messageText, setMessageText] = useState("")
  
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push("/auth/admin-login")
        return
      }

      // Check if admin
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single()
      
      if (!profile?.is_admin) {
        router.push("/dashboard")
        return
      }

      // Fetch all users
      const { data: usersData } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false })
      
      setUsers(usersData || [])

      // Fetch all cases with user info
      const { data: casesData } = await supabase
        .from("cases")
        .select("*, profiles(email, first_name, last_name)")
        .order("created_at", { ascending: false })
      
      setCases(casesData || [])

      // Fetch all withdrawals with user info
      const { data: withdrawalsData } = await supabase
        .from("withdrawals")
        .select("*, profiles(email, first_name, last_name)")
        .order("created_at", { ascending: false })
      
      setWithdrawals(withdrawalsData || [])
      setLoading(false)
    }

    fetchData()
  }, [supabase, router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const updateUser = async (userId: string, updates: Partial<User>) => {
    await supabase.from("profiles").update(updates).eq("id", userId)
    setUsers(users.map(u => u.id === userId ? { ...u, ...updates } : u))
    setEditingUser(null)
  }

  const deleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return
    
    await supabase.from("profiles").delete().eq("id", userId)
    setUsers(users.filter(u => u.id !== userId))
  }

  const updateCase = async (caseId: string, updates: Partial<Case>) => {
    await supabase.from("cases").update(updates).eq("id", caseId)
    setCases(cases.map(c => c.id === caseId ? { ...c, ...updates } : c))
    setEditingCase(null)
  }

  const updateWithdrawal = async (withdrawalId: string, updates: Partial<Withdrawal>) => {
    await supabase.from("withdrawals").update(updates).eq("id", withdrawalId)
    setWithdrawals(withdrawals.map(w => w.id === withdrawalId ? { ...w, ...updates } : w))
    setEditingWithdrawal(null)
  }

  const sendMessage = async () => {
    if (!messageModal || !messageText.trim()) return
    
    await supabase.from("messages").insert({
      user_id: messageModal.userId,
      case_id: messageModal.caseId || null,
      sender_type: "admin",
      message: messageText,
    })
    
    setMessageModal(null)
    setMessageText("")
    alert("Message sent successfully!")
  }

  // Stats
  const totalUsers = users.filter(u => !u.is_admin).length
  const totalCases = cases.length
  const totalLost = cases.reduce((sum, c) => sum + c.amount_lost, 0)
  const totalRecovered = cases.reduce((sum, c) => sum + c.amount_recovered, 0)
  const pendingWithdrawals = withdrawals.filter(w => w.status === "pending").length

  const filteredUsers = users.filter(u => 
    !u.is_admin && (
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  const filteredCases = cases.filter(c =>
    c.case_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredWithdrawals = withdrawals.filter(w =>
    w.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.status?.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-[#d4a853]" />
            <div>
              <span className="text-xl font-bold text-white">CRA Admin</span>
              <p className="text-xs text-[#94a3b8]">Management Dashboard</p>
            </div>
          </div>
          
          <Button
            onClick={handleSignOut}
            variant="ghost"
            className="text-[#94a3b8] hover:text-white hover:bg-[#1a3a5c]"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { id: "overview", label: "Overview", icon: TrendingUp },
            { id: "users", label: "Users", icon: Users },
            { id: "cases", label: "Cases", icon: FileText },
            { id: "withdrawals", label: "Withdrawals", icon: Wallet },
          ].map((tab) => (
            <Button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              variant={activeTab === tab.id ? "default" : "ghost"}
              className={activeTab === tab.id 
                ? "bg-[#d4a853] text-[#0a1628] hover:bg-[#c49843]" 
                : "text-[#94a3b8] hover:text-white hover:bg-[#1a3a5c]"
              }
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
              {tab.id === "withdrawals" && pendingWithdrawals > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {pendingWithdrawals}
                </span>
              )}
            </Button>
          ))}
        </div>

        {/* Search Bar */}
        {activeTab !== "overview" && (
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94a3b8]" />
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="pl-10 bg-[#0f2140] border-[#1e4976] text-white placeholder:text-[#64748b] h-12"
            />
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#0f2140] border border-[#1e4976] rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-500" />
                  </div>
                  <span className="text-[#94a3b8]">Total Users</span>
                </div>
                <p className="text-3xl font-bold text-white">{totalUsers}</p>
              </div>

              <div className="bg-[#0f2140] border border-[#1e4976] rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-[#d4a853]/20 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-[#d4a853]" />
                  </div>
                  <span className="text-[#94a3b8]">Total Cases</span>
                </div>
                <p className="text-3xl font-bold text-white">{totalCases}</p>
              </div>

              <div className="bg-[#0f2140] border border-[#1e4976] rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-red-500" />
                  </div>
                  <span className="text-[#94a3b8]">Total Lost</span>
                </div>
                <p className="text-3xl font-bold text-white">${totalLost.toLocaleString()}</p>
              </div>

              <div className="bg-[#0f2140] border border-[#1e4976] rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  </div>
                  <span className="text-[#94a3b8]">Total Recovered</span>
                </div>
                <p className="text-3xl font-bold text-green-500">${totalRecovered.toLocaleString()}</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-[#0f2140] border border-[#1e4976] rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Cases</h3>
                <div className="space-y-3">
                  {cases.slice(0, 5).map((c) => (
                    <div key={c.id} className="flex items-center justify-between p-3 bg-[#0a1628] rounded-lg">
                      <div>
                        <p className="text-white font-medium">{c.case_id}</p>
                        <p className="text-sm text-[#94a3b8]">{c.profiles?.email}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        c.status === "recovered" ? "bg-green-500/20 text-green-500" :
                        c.status === "in_progress" ? "bg-blue-500/20 text-blue-500" :
                        "bg-yellow-500/20 text-yellow-500"
                      }`}>
                        {c.status.replace("_", " ")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#0f2140] border border-[#1e4976] rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Pending Withdrawals</h3>
                <div className="space-y-3">
                  {withdrawals.filter(w => w.status === "pending").slice(0, 5).map((w) => (
                    <div key={w.id} className="flex items-center justify-between p-3 bg-[#0a1628] rounded-lg">
                      <div>
                        <p className="text-white font-medium">${w.amount.toLocaleString()}</p>
                        <p className="text-sm text-[#94a3b8]">{w.profiles?.email}</p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => setEditingWithdrawal(w)}
                        className="bg-[#d4a853] hover:bg-[#c49843] text-[#0a1628]"
                      >
                        Review
                      </Button>
                    </div>
                  ))}
                  {withdrawals.filter(w => w.status === "pending").length === 0 && (
                    <p className="text-[#94a3b8] text-center py-4">No pending withdrawals</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="bg-[#0f2140] border border-[#1e4976] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#0a1628]">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[#94a3b8]">User</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[#94a3b8]">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[#94a3b8]">Phone</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[#94a3b8]">Daily Limit</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[#94a3b8]">Joined</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-[#94a3b8]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e4976]">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-[#0a1628]/50">
                      <td className="px-4 py-3 text-white">
                        {user.first_name} {user.last_name}
                      </td>
                      <td className="px-4 py-3 text-[#94a3b8]">{user.email}</td>
                      <td className="px-4 py-3 text-[#94a3b8]">{user.phone || "-"}</td>
                      <td className="px-4 py-3 text-[#94a3b8]">${user.daily_withdrawal_limit?.toLocaleString() || "5,000"}</td>
                      <td className="px-4 py-3 text-[#94a3b8]">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setMessageModal({ userId: user.id })}
                            className="text-[#94a3b8] hover:text-white"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingUser(user)}
                            className="text-[#94a3b8] hover:text-white"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteUser(user.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Cases Tab */}
        {activeTab === "cases" && (
          <div className="bg-[#0f2140] border border-[#1e4976] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#0a1628]">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[#94a3b8]">Case ID</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[#94a3b8]">User</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[#94a3b8]">Type</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[#94a3b8]">Amount Lost</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[#94a3b8]">Recovered</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[#94a3b8]">Status</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-[#94a3b8]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e4976]">
                  {filteredCases.map((caseItem) => (
                    <tr key={caseItem.id} className="hover:bg-[#0a1628]/50">
                      <td className="px-4 py-3 text-[#d4a853] font-mono text-sm">{caseItem.case_id}</td>
                      <td className="px-4 py-3 text-white">{caseItem.profiles?.email}</td>
                      <td className="px-4 py-3 text-[#94a3b8] capitalize">{caseItem.scam_type.replace("_", " ")}</td>
                      <td className="px-4 py-3 text-white">${caseItem.amount_lost.toLocaleString()}</td>
                      <td className="px-4 py-3 text-green-500">${caseItem.amount_recovered.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs ${
                          caseItem.status === "recovered" ? "bg-green-500/20 text-green-500" :
                          caseItem.status === "in_progress" ? "bg-blue-500/20 text-blue-500" :
                          caseItem.status === "closed" ? "bg-gray-500/20 text-gray-500" :
                          "bg-yellow-500/20 text-yellow-500"
                        }`}>
                          {caseItem.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setMessageModal({ userId: caseItem.user_id, caseId: caseItem.id })}
                            className="text-[#94a3b8] hover:text-white"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingCase(caseItem)}
                            className="text-[#94a3b8] hover:text-white"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Withdrawals Tab */}
        {activeTab === "withdrawals" && (
          <div className="bg-[#0f2140] border border-[#1e4976] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#0a1628]">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[#94a3b8]">User</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[#94a3b8]">Amount</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[#94a3b8]">Method</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[#94a3b8]">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[#94a3b8]">Date</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-[#94a3b8]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e4976]">
                  {filteredWithdrawals.map((withdrawal) => (
                    <tr key={withdrawal.id} className="hover:bg-[#0a1628]/50">
                      <td className="px-4 py-3 text-white">{withdrawal.profiles?.email}</td>
                      <td className="px-4 py-3 text-white font-semibold">${withdrawal.amount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-[#94a3b8] capitalize">{withdrawal.method.replace("_", " ")}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs ${
                          withdrawal.status === "successful" ? "bg-green-500/20 text-green-500" :
                          withdrawal.status === "processing" ? "bg-blue-500/20 text-blue-500" :
                          withdrawal.status === "failed" ? "bg-red-500/20 text-red-500" :
                          "bg-yellow-500/20 text-yellow-500"
                        }`}>
                          {withdrawal.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#94a3b8]">
                        {new Date(withdrawal.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingWithdrawal(withdrawal)}
                          className="text-[#94a3b8] hover:text-white"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f2140] border border-[#1e4976] rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Edit User</h3>
              <button onClick={() => setEditingUser(null)} className="text-[#94a3b8] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-[#94a3b8] mb-1 block">First Name</label>
                <Input
                  value={editingUser.first_name || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, first_name: e.target.value })}
                  className="bg-[#0a1628] border-[#1e4976] text-white"
                />
              </div>
              <div>
                <label className="text-sm text-[#94a3b8] mb-1 block">Last Name</label>
                <Input
                  value={editingUser.last_name || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, last_name: e.target.value })}
                  className="bg-[#0a1628] border-[#1e4976] text-white"
                />
              </div>
              <div>
                <label className="text-sm text-[#94a3b8] mb-1 block">Daily Withdrawal Limit ($)</label>
                <Input
                  type="number"
                  value={editingUser.daily_withdrawal_limit || 5000}
                  onChange={(e) => setEditingUser({ ...editingUser, daily_withdrawal_limit: parseFloat(e.target.value) })}
                  className="bg-[#0a1628] border-[#1e4976] text-white"
                />
              </div>
              <Button
                onClick={() => updateUser(editingUser.id, {
                  first_name: editingUser.first_name,
                  last_name: editingUser.last_name,
                  daily_withdrawal_limit: editingUser.daily_withdrawal_limit,
                })}
                className="w-full bg-[#d4a853] hover:bg-[#c49843] text-[#0a1628]"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Case Modal */}
      {editingCase && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f2140] border border-[#1e4976] rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Edit Case</h3>
              <button onClick={() => setEditingCase(null)} className="text-[#94a3b8] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-[#94a3b8] mb-1 block">Status</label>
                <Select
                  value={editingCase.status}
                  onValueChange={(value) => setEditingCase({ ...editingCase, status: value })}
                >
                  <SelectTrigger className="bg-[#0a1628] border-[#1e4976] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0f2140] border-[#1e4976]">
                    <SelectItem value="under_review" className="text-white hover:bg-[#1a3a5c]">Under Review</SelectItem>
                    <SelectItem value="in_progress" className="text-white hover:bg-[#1a3a5c]">In Progress</SelectItem>
                    <SelectItem value="recovered" className="text-white hover:bg-[#1a3a5c]">Recovered</SelectItem>
                    <SelectItem value="closed" className="text-white hover:bg-[#1a3a5c]">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-[#94a3b8] mb-1 block">Amount Recovered ($)</label>
                <Input
                  type="number"
                  value={editingCase.amount_recovered}
                  onChange={(e) => setEditingCase({ ...editingCase, amount_recovered: parseFloat(e.target.value) || 0 })}
                  className="bg-[#0a1628] border-[#1e4976] text-white"
                  max={editingCase.amount_lost}
                />
              </div>
              <Button
                onClick={() => updateCase(editingCase.id, {
                  status: editingCase.status,
                  amount_recovered: editingCase.amount_recovered,
                })}
                className="w-full bg-[#d4a853] hover:bg-[#c49843] text-[#0a1628]"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Withdrawal Modal */}
      {editingWithdrawal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f2140] border border-[#1e4976] rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Manage Withdrawal</h3>
              <button onClick={() => setEditingWithdrawal(null)} className="text-[#94a3b8] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="bg-[#0a1628] rounded-lg p-4">
                <p className="text-sm text-[#94a3b8]">Amount</p>
                <p className="text-xl font-bold text-white">${editingWithdrawal.amount.toLocaleString()}</p>
                <p className="text-sm text-[#94a3b8] mt-2">Method: {editingWithdrawal.method.replace("_", " ")}</p>
                {editingWithdrawal.wallet_address && (
                  <p className="text-xs text-[#64748b] mt-1 font-mono break-all">Wallet: {editingWithdrawal.wallet_address}</p>
                )}
                {editingWithdrawal.bank_details && (
                  <p className="text-xs text-[#64748b] mt-1">Bank: {JSON.stringify(editingWithdrawal.bank_details)}</p>
                )}
              </div>
              <div>
                <label className="text-sm text-[#94a3b8] mb-1 block">Status</label>
                <Select
                  value={editingWithdrawal.status}
                  onValueChange={(value) => setEditingWithdrawal({ ...editingWithdrawal, status: value })}
                >
                  <SelectTrigger className="bg-[#0a1628] border-[#1e4976] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0f2140] border-[#1e4976]">
                    <SelectItem value="pending" className="text-white hover:bg-[#1a3a5c]">Pending</SelectItem>
                    <SelectItem value="processing" className="text-white hover:bg-[#1a3a5c]">Processing</SelectItem>
                    <SelectItem value="successful" className="text-white hover:bg-[#1a3a5c]">Successful</SelectItem>
                    <SelectItem value="failed" className="text-white hover:bg-[#1a3a5c]">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-[#94a3b8] mb-1 block">Admin Note (Optional)</label>
                <Textarea
                  value={editingWithdrawal.admin_note || ""}
                  onChange={(e) => setEditingWithdrawal({ ...editingWithdrawal, admin_note: e.target.value })}
                  placeholder="Add a note for the user..."
                  className="bg-[#0a1628] border-[#1e4976] text-white placeholder:text-[#64748b]"
                />
              </div>
              <Button
                onClick={() => updateWithdrawal(editingWithdrawal.id, {
                  status: editingWithdrawal.status,
                  admin_note: editingWithdrawal.admin_note,
                })}
                className="w-full bg-[#d4a853] hover:bg-[#c49843] text-[#0a1628]"
              >
                Update Withdrawal
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Message Modal */}
      {messageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f2140] border border-[#1e4976] rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Send Message to User</h3>
              <button onClick={() => setMessageModal(null)} className="text-[#94a3b8] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <Textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type your message..."
                className="bg-[#0a1628] border-[#1e4976] text-white placeholder:text-[#64748b] min-h-[120px]"
              />
              <Button
                onClick={sendMessage}
                disabled={!messageText.trim()}
                className="w-full bg-[#d4a853] hover:bg-[#c49843] text-[#0a1628]"
              >
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
