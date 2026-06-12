"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  Shield, 
  ArrowLeft, 
  MessageSquare, 
  Send,
  User,
  Clock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface Message {
  id: string
  case_id: string
  sender_type: "user" | "admin"
  message: string
  is_read: boolean
  created_at: string
  cases?: {
    case_id: string
    title: string
  }
}

interface Case {
  id: string
  case_id: string
  title: string
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [cases, setCases] = useState<Case[]>([])
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
        return
      }

      // Fetch user's cases
      const { data: casesData } = await supabase
        .from("cases")
        .select("id, case_id, title")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (casesData) {
        setCases(casesData)
        if (casesData.length > 0 && !selectedCaseId) {
          setSelectedCaseId(casesData[0].id)
        }
      }

      setLoading(false)
    }

    fetchData()
  }, [supabase, router, selectedCaseId])

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedCaseId) return

      const { data: messagesData } = await supabase
        .from("messages")
        .select("*")
        .eq("case_id", selectedCaseId)
        .order("created_at", { ascending: true })

      if (messagesData) {
        setMessages(messagesData)
        
        // Mark unread admin messages as read
        const unreadIds = messagesData
          .filter(m => m.sender_type === "admin" && !m.is_read)
          .map(m => m.id)
        
        if (unreadIds.length > 0) {
          await supabase
            .from("messages")
            .update({ is_read: true })
            .in("id", unreadIds)
        }
      }
    }

    fetchMessages()
  }, [selectedCaseId, supabase])

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedCaseId) return

    setSending(true)
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      const { error } = await supabase.from("messages").insert({
        user_id: user.id,
        case_id: selectedCaseId,
        sender_type: "user",
        message: newMessage.trim()
      })

      if (!error) {
        setNewMessage("")
        // Refresh messages
        const { data: messagesData } = await supabase
          .from("messages")
          .select("*")
          .eq("case_id", selectedCaseId)
          .order("created_at", { ascending: true })

        if (messagesData) {
          setMessages(messagesData)
        }
      }
    }
    setSending(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              <div className="flex flex-col">
                <span className="text-lg font-bold text-foreground leading-tight">Consumer Recovery</span>
                <span className="text-xs text-primary font-medium leading-tight">AGENCY</span>
              </div>
            </Link>
            <Button asChild variant="outline" size="sm" className="border-border">
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-foreground mb-6">Messages</h1>

        {cases.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-12 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">No Cases Yet</h2>
            <p className="text-muted-foreground mb-6">Submit a case to start messaging with our team.</p>
            <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/submit-case">Submit a Case</Link>
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Case List */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-xl p-4">
                <h2 className="text-sm font-semibold text-muted-foreground mb-3">Your Cases</h2>
                <div className="space-y-2">
                  {cases.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCaseId(c.id)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedCaseId === c.id
                          ? "bg-primary/10 border border-primary"
                          : "bg-secondary/50 hover:bg-secondary border border-transparent"
                      }`}
                    >
                      <p className="text-xs text-primary font-mono">{c.case_id}</p>
                      <p className="text-sm text-foreground truncate">{c.title}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="lg:col-span-3">
              <div className="bg-card border border-border rounded-xl flex flex-col h-[600px]">
                {/* Messages List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-muted-foreground">
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender_type === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl p-4 ${
                            msg.sender_type === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-foreground"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <User className="h-3 w-3" />
                            <span className="text-xs font-medium">
                              {msg.sender_type === "user" ? "You" : "Support Team"}
                            </span>
                          </div>
                          <p className="text-sm">{msg.message}</p>
                          <div className="flex items-center gap-1 mt-2 opacity-70">
                            <Clock className="h-3 w-3" />
                            <span className="text-xs">
                              {new Date(msg.created_at).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Message Input */}
                <div className="border-t border-border p-4">
                  <div className="flex gap-3">
                    <Textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 bg-secondary border-border resize-none"
                      rows={2}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || sending}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 self-end"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
