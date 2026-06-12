"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "How much does your service cost?",
    answer: "Our services operate on a contingency basis, meaning you don't pay anything upfront. We only collect a fee if we successfully recover your funds. The specific percentage depends on the complexity of your case and will be clearly explained during your free consultation.",
  },
  {
    question: "What types of cases do you handle?",
    answer: "We handle a wide range of financial recovery cases including online fraud, unauthorized credit card charges, bank disputes, wire transfer recovery, investment fraud, identity theft, and consumer refund claims. If you've lost money due to deception or unauthorized activity, we can likely help.",
  },
  {
    question: "How long does the recovery process take?",
    answer: "The timeline varies depending on the complexity of your case and the institutions involved. Simple cases may be resolved in a few weeks, while more complex matters involving multiple parties or international transactions can take several months. We'll provide a realistic timeline estimate during your consultation.",
  },
  {
    question: "What information do I need to provide?",
    answer: "To evaluate your case, we'll need details about the incident, any documentation you have (receipts, emails, bank statements, correspondence), and information about the parties involved. Don't worry if you don't have everything — our investigators can help gather additional evidence.",
  },
  {
    question: "Is my personal information secure?",
    answer: "Absolutely. We use bank-level encryption to protect all client data. Our systems are regularly audited for security compliance, and we never share your personal information with third parties. Confidentiality is fundamental to our service.",
  },
  {
    question: "Can you guarantee recovery of my funds?",
    answer: "While we cannot guarantee recovery in every case, our 99.8% success rate speaks to our expertise and determination. During your free consultation, we'll honestly assess your case's prospects and only take cases where we believe recovery is achievable.",
  },
]

export function FAQ() {
  return (
    <section id="faq" className="py-16 md:py-24 bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-lg">
            Find answers to common questions about our recovery services.
          </p>
        </div>
        
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-card border border-border rounded-xl px-6 data-[state=open]:border-primary/50"
            >
              <AccordionTrigger className="text-left text-foreground font-semibold hover:no-underline py-4">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
