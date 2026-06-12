"use client"

import { useState } from "react"
import { Mail, Clock, MapPin, Shield, Send } from "lucide-react"
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
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"

const caseTypes = [
  "Fraud Recovery",
  "Unauthorized Charges",
  "Bank Disputes",
  "Investment Recovery",
  "Identity Theft",
  "Consumer Refunds",
  "Other",
]

export function Contact() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    caseType: "",
    estimatedLoss: "",
    description: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  return (
    <section id="contact" className="py-16 md:py-24 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Start Your Free Case Review
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Tell us about your situation. A recovery specialist will contact you within 24 hours.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-secondary/30 border border-border rounded-xl p-6 md:p-8">
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Request a Free Consultation
            </h3>
            <p className="text-muted-foreground text-sm mb-6">
              Fill out the form below and we&apos;ll get back to you promptly. All information is kept strictly confidential.
            </p>

            {isSubmitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-green-500" />
                </div>
                <h4 className="text-xl font-semibold text-foreground mb-2">
                  Thank You!
                </h4>
                <p className="text-muted-foreground">
                  Your case has been submitted. A recovery specialist will contact you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <FieldGroup>
                  <div className="grid grid-cols-2 gap-4">
                    <Field>
                      <FieldLabel htmlFor="firstName">First Name *</FieldLabel>
                      <Input
                        id="firstName"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="bg-input border-border text-foreground"
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="lastName">Last Name *</FieldLabel>
                      <Input
                        id="lastName"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="bg-input border-border text-foreground"
                      />
                    </Field>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Field>
                      <FieldLabel htmlFor="email">Email *</FieldLabel>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="bg-input border-border text-foreground"
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="phone">Phone *</FieldLabel>
                      <Input
                        id="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="bg-input border-border text-foreground"
                      />
                    </Field>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Field>
                      <FieldLabel>Type of Case *</FieldLabel>
                      <Select
                        value={formData.caseType}
                        onValueChange={(value) => setFormData({ ...formData, caseType: value })}
                        required
                      >
                        <SelectTrigger className="bg-input border-border text-foreground">
                          <SelectValue placeholder="Select case type" />
                        </SelectTrigger>
                        <SelectContent>
                          {caseTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="estimatedLoss">Estimated Loss Amount</FieldLabel>
                      <Input
                        id="estimatedLoss"
                        placeholder="$"
                        value={formData.estimatedLoss}
                        onChange={(e) => setFormData({ ...formData, estimatedLoss: e.target.value })}
                        className="bg-input border-border text-foreground"
                      />
                    </Field>
                  </div>

                  <Field>
                    <FieldLabel htmlFor="description">Describe Your Situation *</FieldLabel>
                    <Textarea
                      id="description"
                      required
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="bg-input border-border text-foreground resize-none"
                    />
                  </Field>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base font-semibold"
                  >
                    {isSubmitting ? (
                      "Submitting..."
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Submit for Free Review
                      </>
                    )}
                  </Button>
                </FieldGroup>

                <p className="text-muted-foreground text-xs text-center mt-4 flex items-center justify-center gap-1">
                  <Shield className="h-3 w-3" />
                  Your information is protected with bank-level encryption. We never share your data with third parties.
                </p>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Get in Touch
              </h3>
              <p className="text-muted-foreground mb-6">
                Prefer to speak with someone directly? Our team is available to answer your questions and provide immediate assistance with your case.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-secondary/30 rounded-lg border border-border">
                <Mail className="h-6 w-6 text-primary mt-0.5" />
                <div>
                  <h4 className="font-semibold text-foreground">Email</h4>
                  <a href="mailto:consumer.recovery@outlook.com" className="text-primary hover:underline">
                    consumer.recovery@outlook.com
                  </a>
                  <p className="text-muted-foreground text-sm mt-1">We respond within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-secondary/30 rounded-lg border border-border">
                <Clock className="h-6 w-6 text-primary mt-0.5" />
                <div>
                  <h4 className="font-semibold text-foreground">Hours</h4>
                  <p className="text-muted-foreground">Mon-Fri: 8AM-8PM EST</p>
                  <p className="text-muted-foreground text-sm">Sat: 9AM-5PM EST</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-secondary/30 rounded-lg border border-border">
                <MapPin className="h-6 w-6 text-primary mt-0.5" />
                <div>
                  <h4 className="font-semibold text-foreground">Service Area</h4>
                  <p className="text-primary">Nationwide Coverage</p>
                  <p className="text-muted-foreground text-sm">Serving all 50 states</p>
                </div>
              </div>
            </div>

            <div className="bg-primary/10 border border-primary/30 rounded-xl p-6">
              <h4 className="font-semibold text-foreground mb-2">Need Immediate Help?</h4>
              <p className="text-muted-foreground text-sm mb-4">
                Our specialists are standing by to assist you. Contact us now for a free, confidential consultation.
              </p>
              <a
                href="mailto:consumer.recovery@outlook.com"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                <Mail className="h-4 w-4" />
                Email Us Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
