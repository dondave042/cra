import { Quote } from "lucide-react"

const stats = [
  { value: "15+", label: "Years of Experience" },
  { value: "350,000+", label: "Cases Handled" },
  { value: "99.8%", label: "Recovery Rate" },
  { value: "100+", label: "Licensed Professionals" },
]

export function About() {
  return (
    <section id="about" className="py-16 md:py-24 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            About Consumer Recovery Agency
          </h2>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <p className="text-muted-foreground text-lg mb-6 text-center">
            Consumer Recovery Agency is a leading financial recovery firm dedicated to helping individuals and families reclaim funds lost to fraud, scams, unauthorized charges, and financial disputes.
          </p>
          
          <p className="text-muted-foreground text-lg mb-6 text-center">
            Founded by financial industry veterans and consumer protection advocates, our mission is simple: to recover what&apos;s rightfully yours. We understand the emotional and financial toll that losing money can take, which is why we approach every case with empathy, expertise, and determination.
          </p>
          
          <p className="text-muted-foreground text-lg mb-10 text-center">
            Our team of licensed professionals includes former banking executives, fraud investigators, and legal experts who know how to navigate complex financial systems and fight for our clients&apos; rights.
          </p>
          
          <div className="bg-secondary/50 border border-border rounded-xl p-8 mb-12">
            <Quote className="h-8 w-8 text-primary mb-4 mx-auto" />
            <blockquote className="text-foreground text-lg italic text-center mb-4">
              &quot;We believe every consumer deserves a fair chance at recovering their hard-earned money. Our success is measured not just in dollars recovered, but in the peace of mind we restore.&quot;
            </blockquote>
            <cite className="text-primary text-sm block text-center not-italic">
              — Consumer Recovery Agency Leadership Team
            </cite>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center p-6 bg-secondary/30 rounded-xl border border-border">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-muted-foreground text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
