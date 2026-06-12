import { ShieldAlert, CreditCard, Building2, TrendingUp, UserX, RefreshCw } from "lucide-react"

const services = [
  {
    icon: ShieldAlert,
    title: "Fraud Recovery",
    description: "Comprehensive assistance in recovering funds lost to online scams, phishing attacks, and fraudulent schemes.",
  },
  {
    icon: CreditCard,
    title: "Unauthorized Charges",
    description: "Dispute resolution for unauthorized credit card charges, hidden fees, and billing errors.",
  },
  {
    icon: Building2,
    title: "Bank Disputes",
    description: "Expert navigation of bank disputes, wire transfer recovery, and financial institution claims.",
  },
  {
    icon: TrendingUp,
    title: "Investment Recovery",
    description: "Recovery assistance for victims of investment fraud, Ponzi schemes, and securities violations.",
  },
  {
    icon: UserX,
    title: "Identity Theft Recovery",
    description: "Complete support for identity theft victims, including credit restoration and fraud cleanup.",
  },
  {
    icon: RefreshCw,
    title: "Consumer Refunds",
    description: "Assistance with merchant disputes, failed deliveries, and consumer protection claims.",
  },
]

export function Services() {
  return (
    <section id="services" className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Our Recovery Services
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We specialize in a wide range of fund recovery services, tailored to meet your specific situation and needs.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.title}
              className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors group"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <service.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">{service.title}</h3>
              <p className="text-muted-foreground">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
