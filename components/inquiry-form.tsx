"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Phone, Send, CheckCircle, MessageCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function InquiryForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "general",
    message: "",
  })

  const whatsappNumber = "8766547911"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setIsSubmitted(true)
        setFormData({ name: "", email: "", phone: "", subject: "general", message: "" })
        setTimeout(() => setIsSubmitted(false), 5000)
      }
    } catch (error) {
      console.error("Inquiry submission error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleWhatsAppClick = () => {
    const message = `Hi, I have a question about your car wash services.`
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <section id="inquiry" className="py-20 bg-gradient-to-b from-background via-primary/5 to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/15 border-primary/20">
              Have Questions?
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
              Get in Touch with Our Team
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Have special requests or questions about our services? Send us an inquiry or message us on WhatsApp and
              our team will get back to you within 24 hours.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-card border border-border/50 rounded-2xl p-6 hover:border-primary/20 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">WhatsApp</h3>
                    <p className="text-sm text-muted-foreground">+91 {whatsappNumber}</p>
                    <p className="text-xs text-muted-foreground mt-2">Instant messaging available</p>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border/50 rounded-2xl p-6 hover:border-primary/20 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Phone</h3>
                    <p className="text-sm text-muted-foreground">+91 98765 43210</p>
                    <p className="text-xs text-muted-foreground mt-2">Available 9 AM - 6 PM</p>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border/50 rounded-2xl p-6 hover:border-primary/20 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Email</h3>
                    <p className="text-sm text-muted-foreground">info@sparklewash.com</p>
                    <p className="text-xs text-muted-foreground mt-2">We reply within 24 hours</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20 rounded-2xl p-6">
                <h3 className="font-semibold text-foreground mb-3">Why Choose Us?</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                    Premium quality guaranteed
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                    Expert technicians
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                    Fast turnaround time
                  </li>
                </ul>
              </div>

              <Button
                onClick={handleWhatsAppClick}
                className="w-full bg-green-600 hover:bg-green-700 text-white h-11 gap-2 font-semibold rounded-lg"
              >
                <MessageCircle className="h-4 w-4" />
                Message on WhatsApp
              </Button>
            </div>

            {/* Inquiry Form */}
            <div className="lg:col-span-2">
              <Card className="border-border/50 bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-2xl">Send us an Inquiry</CardTitle>
                </CardHeader>
                <CardContent>
                  {isSubmitted ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">Thank You!</h3>
                      <p className="text-muted-foreground mb-4">
                        Your inquiry has been received. We'll get back to you within 24 hours via WhatsApp at +91{" "}
                        {whatsappNumber}.
                      </p>
                      <Button
                        onClick={handleWhatsAppClick}
                        className="bg-green-600 hover:bg-green-700 text-white gap-2"
                      >
                        <MessageCircle className="h-4 w-4" />
                        Chat on WhatsApp
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                          <Input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your name"
                            required
                            className="bg-background/50 border-border/50 focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                          <Input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="your@email.com"
                            required
                            className="bg-background/50 border-border/50 focus:border-primary"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
                        <Input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+91 98765 43210"
                          className="bg-background/50 border-border/50 focus:border-primary"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Inquiry Type</label>
                        <Select
                          value={formData.subject}
                          onValueChange={(value) => setFormData({ ...formData, subject: value })}
                        >
                          <SelectTrigger className="bg-background/50 border-border/50 focus:border-primary">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General Inquiry</SelectItem>
                            <SelectItem value="pricing">Pricing Question</SelectItem>
                            <SelectItem value="special">Special Requests</SelectItem>
                            <SelectItem value="corporate">Corporate Services</SelectItem>
                            <SelectItem value="feedback">Feedback</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Message</label>
                        <Textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Tell us more about your inquiry..."
                          required
                          className="bg-background/50 border-border/50 focus:border-primary min-h-40 resize-none"
                        />
                      </div>

                      <div className="flex gap-3">
                        <Button type="submit" disabled={isSubmitting} className="flex-1 h-12 font-semibold gap-2">
                          <Send className="h-4 w-4" />
                          {isSubmitting ? "Sending..." : "Send Inquiry"}
                        </Button>
                        <Button
                          type="button"
                          onClick={handleWhatsAppClick}
                          className="flex-1 h-12 font-semibold gap-2 bg-green-600 hover:bg-green-700 text-white"
                        >
                          <MessageCircle className="h-4 w-4" />
                          Chat on WhatsApp
                        </Button>
                      </div>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
