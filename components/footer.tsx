import Link from "next/link"
import { Droplets, Phone, Mail, MapPin, Clock, Facebook, Twitter, Instagram, Send } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-foreground to-foreground/95 text-background mt-24">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                <Droplets className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xl font-bold">SparkleWash</span>
            </Link>
            <p className="text-sm text-background/70 leading-relaxed">
              Premium car washing and detailing services for the discerning car owner.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-base">Quick Links</h3>
            <ul className="space-y-3 text-sm text-background/70">
              <li>
                <Link href="/services" className="hover:text-background transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/booking" className="hover:text-background transition-colors">
                  Book Appointment
                </Link>
              </li>
              <li>
                <Link href="#inquiry" className="hover:text-background transition-colors">
                  Send Inquiry
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-background transition-colors">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="font-semibold mb-4 text-base">Contact</h3>
            <ul className="space-y-3 text-sm text-background/70">
              <li className="flex items-start gap-3">
                <Phone className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>info@sparklewash.com</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Pune, Maharashtra, India</span>
              </li>
            </ul>
          </div>

          {/* Hours Section */}
          <div>
            <h3 className="font-semibold mb-4 text-base">Hours</h3>
            <ul className="space-y-2 text-sm text-background/70">
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 flex-shrink-0" />
                <span>Mon - Sat: 9 AM - 6 PM</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 flex-shrink-0" />
                <span>Sunday: 10 AM - 4 PM</span>
              </li>
            </ul>
          </div>

          {/* Social Section */}
          <div>
            <h3 className="font-semibold mb-4 text-base">Follow Us</h3>
            <div className="flex gap-3 mb-4">
              <a
                href="#"
                className="h-10 w-10 rounded-lg bg-background/10 hover:bg-background/20 flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="h-10 w-10 rounded-lg bg-background/10 hover:bg-background/20 flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="h-10 w-10 rounded-lg bg-background/10 hover:bg-background/20 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
            <Link href="#inquiry">
              <Button size="sm" variant="secondary" className="w-full gap-2 bg-primary hover:bg-primary/90">
                <Send className="h-4 w-4" />
                <span className="text-xs">Send Inquiry</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-background/10 pt-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-background/70">
          <p>&copy; 2026 SparkleWash. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-background transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-background transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
