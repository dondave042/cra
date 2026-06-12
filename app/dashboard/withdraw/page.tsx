"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Shield, ArrowLeft, Wallet, Building2, Bitcoin, 
  CreditCard, Clock, CheckCircle, XCircle, Loader2
} from "lucide-react"

type Withdrawal = {
  id: string
  amount: number
  method: string
  status: string
  wallet_address?: string
  bank_details?: any
  admin_note?: string
  created_at: string
  updated_at: string
}

type Case = {
  id: string
  case_id: string
  title: string
  amount_recovered: number
}

const withdrawalMethods = [
  { value: "bank_transfer", label: "Bank Transfer", icon: Building2 },
  { value: "crypto", label: "Cryptocurrency Wallet", icon: Bitcoin },
  { value: "bitso", label: "Bitso", icon: CreditCard },
]

const statusConfig: Record<string, { color: string; bg: string; icon: any }> = {
  pending: { color: "text-yellow-500", bg: "bg-yellow-500/20", icon: Clock },
  processing: { color: "text-blue-500", bg: "bg-blue-500/20", icon: Loader2 },
  successful: { color: "text-green-500", bg: "bg-green-500/20", icon: CheckCircle },
  failed: { color: "text-red-500", bg: "bg-red-500/20", icon: XCircle },
}

export default function WithdrawPage() {
  const [user, setUser] = useState<any>(null)
  const [cases, setCases] = useState<Case[]>([])
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [dailyLimit, setDailyLimit] = useState(5000)
  const [availableBalance, setAvailableBalance] = useState(0)
  
  const [amount, setAmount] = useState("")
  const [method, setMethod] = useState("")
  const [selectedCase, setSelectedCase] = useState("")
  const [walletAddress, setWalletAddress] = useState("")
  const [bankName, setBankName] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [routingNumber, setRoutingNumber] = useState("")
  const [accountHolderName, setAccountHolderName] = useState("")
  const [bitsoEmail, setBitsoEmail] = useState("")
  
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

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

      // Fetch profile for daily limit
      const { data: profile } = await supabase
        .from("profiles")
        .select("daily_withdrawal_limit")
        .eq("id", user.id)
        .single()
      
      if (profile) {
        setDailyLimit(profile.daily_withdrawal_limit || 5000)
      }

      // Fetch cases with recovered amounts
      const { data: casesData } = await supabase
        .from("cases")
        .select("id, case_id, title, amount_recovered")
        .eq("user_id", user.id)
        .gt("amount_recovered", 0)
      
      setCases(casesData || [])
      
      const totalRecovered = (casesData || []).reduce((sum, c) => sum + c.amount_recovered, 0)
      
      // Get already withdrawn amounts
      const { data: withdrawnData } = await supabase
        .from("withdrawals")
        .select("amount, status")
        .eq("user_id", user.id)
        .in("status", ["pending", "processing", "successful"])
      
      const totalWithdrawn = (withdrawnData || []).reduce((sum, w) => sum + w.amount, 0)
      setAvailableBalance(totalRecovered - totalWithdrawn)

      // Fetch withdrawal history
      const { data: withdrawalsData } = await supabase
        .from("withdrawals")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
      
      setWithdrawals(withdrawalsData || [])
      setLoading(false)
    }

    fetchData()
  }, [supabase, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const withdrawAmount = parseFloat(amount)

    if (withdrawAmount > availableBalance) {
      setError("Withdrawal amount exceeds available balance")
      setSubmitting(false)
      return
    }

    if (withdrawAmount > dailyLimit) {
      setError(`Withdrawal amount exceeds daily limit of $${dailyLimit.toLocaleString()}`)
      setSubmitting(false)
      return
    }

    try {
      let bankDetails = null
      let walletAddr = null

      if (method === "bank_transfer") {
        bankDetails = {
          bank_name: bankName,
          account_number: accountNumber,
          routing_number: routingNumber,
          account_holder_name: accountHolderName,
        }
      } else if (method === "crypto") {
        walletAddr = walletAddress
      } else if (method === "bitso") {
        bankDetails = { bitso_email: bitsoEmail }
      }

      const { error: insertError } = await supabase.from("withdrawals").insert({
        user_id: user.id,
        case_id: selectedCase || null,
        amount: withdrawAmount,
        method,
        wallet_address: walletAddr,
        bank_details: bankDetails,
        status: "pending",
      })

      if (insertError) throw insertError

      setSuccess(true)
      
      // Refresh withdrawals
      const { data: withdrawalsData } = await supabase
        .from("withdrawals")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
      
      setWithdrawals(withdrawalsData || [])
      setAvailableBalance(prev => prev - withdrawAmount)
      
      // Reset form
      setAmount("")
      setMethod("")
      setSelectedCase("")
      setWalletAddress("")
      setBankName("")
      setAccountNumber("")
      setRoutingNumber("")
      setAccountHolderName("")
      setBitsoEmail("")
      
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.message || "Failed to submit withdrawal request")
    } finally {
      setSubmitting(false)
    }
  }

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
          <Link href="/dashboard" className="flex items-center gap-2 text-[#94a3b8] hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-[#d4a853]" />
            <span className="text-xl font-bold text-white">CRA</span>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-full bg-[#d4a853]/20 flex items-center justify-center">
            <Wallet className="w-6 h-6 text-[#d4a853]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Withdraw Funds</h1>
            <p className="text-[#94a3b8]">Request a withdrawal from your recovered funds</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Withdrawal Form */}
          <div className="bg-[#0f2140] border border-[#1e4976] rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-6">New Withdrawal Request</h2>

            {/* Balance Info */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-[#0a1628] rounded-lg p-4">
                <p className="text-xs text-[#94a3b8] mb-1">Available Balance</p>
                <p className="text-xl font-bold text-green-500">${availableBalance.toLocaleString()}</p>
              </div>
              <div className="bg-[#0a1628] rounded-lg p-4">
                <p className="text-xs text-[#94a3b8] mb-1">Daily Limit</p>
                <p className="text-xl font-bold text-white">${dailyLimit.toLocaleString()}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#94a3b8]">Amount ($)</label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="bg-[#0a1628] border-[#1e4976] text-white placeholder:text-[#64748b] h-12"
                  min="1"
                  max={Math.min(availableBalance, dailyLimit)}
                  step="0.01"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#94a3b8]">Withdrawal Method</label>
                <Select value={method} onValueChange={setMethod} required>
                  <SelectTrigger className="bg-[#0a1628] border-[#1e4976] text-white h-12">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0f2140] border-[#1e4976]">
                    {withdrawalMethods.map((m) => (
                      <SelectItem 
                        key={m.value} 
                        value={m.value}
                        className="text-white hover:bg-[#1a3a5c] focus:bg-[#1a3a5c]"
                      >
                        <div className="flex items-center gap-2">
                          <m.icon className="w-4 h-4" />
                          {m.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {cases.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#94a3b8]">From Case (Optional)</label>
                  <Select value={selectedCase} onValueChange={setSelectedCase}>
                    <SelectTrigger className="bg-[#0a1628] border-[#1e4976] text-white h-12">
                      <SelectValue placeholder="Select case" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0f2140] border-[#1e4976]">
                      {cases.map((c) => (
                        <SelectItem 
                          key={c.id} 
                          value={c.id}
                          className="text-white hover:bg-[#1a3a5c] focus:bg-[#1a3a5c]"
                        >
                          {c.case_id} - ${c.amount_recovered.toLocaleString()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Bank Transfer Fields */}
              {method === "bank_transfer" && (
                <div className="space-y-4 p-4 bg-[#0a1628] rounded-lg">
                  <Input
                    type="text"
                    value={accountHolderName}
                    onChange={(e) => setAccountHolderName(e.target.value)}
                    placeholder="Account Holder Name"
                    className="bg-[#0f2140] border-[#1e4976] text-white placeholder:text-[#64748b] h-12"
                    required
                  />
                  <Input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="Bank Name"
                    className="bg-[#0f2140] border-[#1e4976] text-white placeholder:text-[#64748b] h-12"
                    required
                  />
                  <Input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="Account Number"
                    className="bg-[#0f2140] border-[#1e4976] text-white placeholder:text-[#64748b] h-12"
                    required
                  />
                  <Input
                    type="text"
                    value={routingNumber}
                    onChange={(e) => setRoutingNumber(e.target.value)}
                    placeholder="Routing Number"
                    className="bg-[#0f2140] border-[#1e4976] text-white placeholder:text-[#64748b] h-12"
                    required
                  />
                </div>
              )}

              {/* Crypto Fields */}
              {method === "crypto" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#94a3b8]">Wallet Address</label>
                  <Input
                    type="text"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    placeholder="Enter your crypto wallet address"
                    className="bg-[#0a1628] border-[#1e4976] text-white placeholder:text-[#64748b] h-12 font-mono text-sm"
                    required
                  />
                </div>
              )}

              {/* Bitso Fields */}
              {method === "bitso" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#94a3b8]">Bitso Email</label>
                  <Input
                    type="email"
                    value={bitsoEmail}
                    onChange={(e) => setBitsoEmail(e.target.value)}
                    placeholder="Enter your Bitso account email"
                    className="bg-[#0a1628] border-[#1e4976] text-white placeholder:text-[#64748b] h-12"
                    required
                  />
                </div>
              )}

              {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-3 text-green-400 text-sm">
                  Withdrawal request submitted successfully!
                </div>
              )}

              <Button
                type="submit"
                disabled={submitting || !method || availableBalance <= 0}
                className="w-full bg-[#d4a853] hover:bg-[#c49843] text-[#0a1628] font-semibold h-12"
              >
                {submitting ? "Processing..." : "Submit Withdrawal Request"}
              </Button>
            </form>
          </div>

          {/* Withdrawal History */}
          <div className="bg-[#0f2140] border border-[#1e4976] rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-6">Withdrawal History</h2>

            {withdrawals.length === 0 ? (
              <div className="text-center py-12">
                <Wallet className="w-12 h-12 text-[#94a3b8] mx-auto mb-4" />
                <p className="text-[#94a3b8]">No withdrawal requests yet</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto">
                {withdrawals.map((withdrawal) => {
                  const status = statusConfig[withdrawal.status] || statusConfig.pending
                  const StatusIcon = status.icon
                  const methodInfo = withdrawalMethods.find(m => m.value === withdrawal.method)
                  const MethodIcon = methodInfo?.icon || CreditCard
                  
                  return (
                    <div key={withdrawal.id} className="bg-[#0a1628] border border-[#1e4976] rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <MethodIcon className="w-4 h-4 text-[#94a3b8]" />
                          <span className="text-sm text-[#94a3b8]">
                            {methodInfo?.label || withdrawal.method}
                          </span>
                        </div>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${status.bg} ${status.color}`}>
                          <StatusIcon className={`w-3 h-3 ${withdrawal.status === "processing" ? "animate-spin" : ""}`} />
                          {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-xl font-bold text-white mb-1">
                        ${withdrawal.amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-[#64748b]">
                        {new Date(withdrawal.created_at).toLocaleString()}
                      </p>
                      {withdrawal.admin_note && (
                        <p className="mt-2 text-sm text-[#94a3b8] bg-[#0f2140] p-2 rounded">
                          Note: {withdrawal.admin_note}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
