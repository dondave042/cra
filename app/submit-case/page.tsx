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
import { Shield, ArrowLeft, Upload, FileText, X, CheckCircle } from "lucide-react"

const scamTypes = [
  { value: "phishing", label: "Phishing Scam" },
  { value: "investment_fraud", label: "Investment Fraud" },
  { value: "romance_scam", label: "Romance Scam" },
  { value: "crypto_scam", label: "Cryptocurrency Scam" },
  { value: "tech_support", label: "Tech Support Scam" },
  { value: "identity_theft", label: "Identity Theft" },
  { value: "wire_fraud", label: "Wire Fraud" },
  { value: "credit_card", label: "Credit Card Fraud" },
  { value: "other", label: "Other" },
]

function generateCaseId() {
  const prefix = "CRA"
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}-${timestamp}-${random}`
}

export default function SubmitCasePage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const [caseId, setCaseId] = useState("")
  const [error, setError] = useState<string | null>(null)
  
  const [title, setTitle] = useState("")
  const [amountLost, setAmountLost] = useState("")
  const [scamType, setScamType] = useState("")
  const [description, setDescription] = useState("")
  const [files, setFiles] = useState<File[]>([])
  
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setCheckingAuth(false)
      
      if (!user) {
        // Redirect to sign up with return URL
        router.push("/auth/sign-up?redirect=/submit-case")
      }
    }
    checkUser()
  }, [supabase, router])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setFiles(prev => [...prev, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!user) {
      router.push("/auth/sign-up?redirect=/submit-case")
      return
    }

    try {
      const newCaseId = generateCaseId()
      
      // Upload files if any
      const evidenceUrls: string[] = []
      for (const file of files) {
        const fileExt = file.name.split(".").pop()
        const fileName = `${user.id}/${newCaseId}/${Date.now()}.${fileExt}`
        
        const { error: uploadError } = await supabase.storage
          .from("evidence")
          .upload(fileName, file)
        
        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from("evidence")
            .getPublicUrl(fileName)
          evidenceUrls.push(urlData.publicUrl)
        }
      }

      // Create case
      const { error: insertError } = await supabase.from("cases").insert({
        user_id: user.id,
        case_id: newCaseId,
        title,
        scam_type: scamType,
        amount_lost: parseFloat(amountLost),
        description,
        evidence_urls: evidenceUrls,
        status: "under_review",
      })

      if (insertError) {
        throw insertError
      }

      setCaseId(newCaseId)
      setSubmitted(true)
    } catch (err: any) {
      setError(err.message || "Failed to submit case")
    } finally {
      setLoading(false)
    }
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#d4a853]"></div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0a1628] flex flex-col">
        <div className="p-4">
          <Link href="/" className="inline-flex items-center gap-2 text-[#94a3b8] hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md text-center">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Case Submitted Successfully!</h1>
            <p className="text-[#94a3b8] mb-4">Your case has been received and is under review.</p>
            
            <div className="bg-[#0f2140] border border-[#1e4976] rounded-lg p-4 mb-6">
              <p className="text-sm text-[#94a3b8] mb-1">Your Case ID</p>
              <p className="text-xl font-mono font-bold text-[#d4a853]">{caseId}</p>
            </div>
            
            <Button
              onClick={() => router.push("/dashboard")}
              className="w-full bg-[#d4a853] hover:bg-[#c49843] text-[#0a1628] font-semibold h-12"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a1628] flex flex-col">
      <div className="p-4">
        <Link href="/" className="inline-flex items-center gap-2 text-[#94a3b8] hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
      
      <div className="flex-1 flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <Shield className="w-10 h-10 text-[#d4a853]" />
              <span className="text-2xl font-bold text-white">CRA</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Submit Your Case</h1>
            <p className="text-[#94a3b8]">Fill out the form below to begin your fund recovery process</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 bg-[#0f2140] border border-[#1e4976] rounded-xl p-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#94a3b8]">Case Title</label>
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Brief title describing your case"
                className="bg-[#0a1628] border-[#1e4976] text-white placeholder:text-[#64748b] h-12"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#94a3b8]">Amount Lost ($)</label>
                <Input
                  type="number"
                  value={amountLost}
                  onChange={(e) => setAmountLost(e.target.value)}
                  placeholder="Enter amount"
                  className="bg-[#0a1628] border-[#1e4976] text-white placeholder:text-[#64748b] h-12"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#94a3b8]">Scam Type</label>
                <Select value={scamType} onValueChange={setScamType} required>
                  <SelectTrigger className="bg-[#0a1628] border-[#1e4976] text-white h-12">
                    <SelectValue placeholder="Select scam type" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0f2140] border-[#1e4976]">
                    {scamTypes.map((type) => (
                      <SelectItem 
                        key={type.value} 
                        value={type.value}
                        className="text-white hover:bg-[#1a3a5c] focus:bg-[#1a3a5c]"
                      >
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#94a3b8]">Description of Incident</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please provide detailed information about the incident, including dates, communications, and any relevant details..."
                className="bg-[#0a1628] border-[#1e4976] text-white placeholder:text-[#64748b] min-h-[150px]"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#94a3b8]">Upload Evidence (Optional)</label>
              <p className="text-xs text-[#64748b] mb-2">Documents, screenshots, emails, or any supporting evidence</p>
              
              <div className="border-2 border-dashed border-[#1e4976] rounded-lg p-6 text-center hover:border-[#d4a853] transition-colors">
                <input
                  type="file"
                  id="evidence"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                />
                <label htmlFor="evidence" className="cursor-pointer">
                  <Upload className="w-8 h-8 text-[#94a3b8] mx-auto mb-2" />
                  <p className="text-[#94a3b8]">Click to upload files</p>
                  <p className="text-xs text-[#64748b]">PDF, DOC, JPG, PNG (max 10MB each)</p>
                </label>
              </div>

              {files.length > 0 && (
                <div className="space-y-2 mt-4">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 bg-[#0a1628] p-2 rounded-lg">
                      <FileText className="w-4 h-4 text-[#d4a853]" />
                      <span className="text-sm text-white flex-1 truncate">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-[#94a3b8] hover:text-red-400"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading || !scamType}
              className="w-full bg-[#d4a853] hover:bg-[#c49843] text-[#0a1628] font-semibold h-12"
            >
              {loading ? "Submitting Case..." : "Submit Case"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
