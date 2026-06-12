import { MessageSquare, Search, Scale, Banknote, Award, Lock, ShieldCheck, Trophy } from "lucide-react"

const steps = [
  {
    icon: MessageSquare,
    title: "Free Consultation",
    description: "Share your case details with our specialists. We'll evaluate your situation and determine the best recovery strategy.",
  },
  {
    icon: Search,
    title: "Case Investigation",
    description: "Our team conducts a thorough investigation, gathering evidence and identifying all responsible parties.",
  },
  {
    icon: Scale,
    title: "Recovery Action",
    description: "We pursue your claim through proper channels, negotiating with institutions and leveraging consumer protection laws.",
  },
  {
    icon: Banknote,
    title: "Fund Recovery",
    description: "Upon successful resolution, your recovered funds are returned to you directly. You only pay if we succeed.",
  },
]

const badges = [
  { icon: Award, title: "BBB Accredited", description: "A+ Rating with the Better Business Bureau" },
  { icon: Lock, title: "Secure & Confidential", description: "Bank-level encryption protects your data" },
  { icon: ShieldCheck, title: "Legal Compliance", description: "Fully compliant with all consumer protection laws" },
  { icon: Trophy, title: "Industry Recognized", description: "Award-winning recovery specialists" },
]

export function Process() {
  return (
    <section id="process" className="py-16 md:py-24 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Our streamlined process makes fund recovery straightforward and stress-free.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {steps.map((step, index) => (
            <div key={step.title} className="relative">
              <div className="bg-secondary/30 border border-border rounded-xl p-6 h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                    {index + 1}
                  </div>
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                  <div className="w-6 h-0.5 bg-border" />
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.title}
              className="bg-secondary/20 border border-border rounded-lg p-4 text-center"
            >
              <badge.icon className="h-8 w-8 text-primary mx-auto mb-2" />
              <h4 className="font-semibold text-foreground text-sm mb-1">{badge.title}</h4>
              <p className="text-muted-foreground text-xs">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
