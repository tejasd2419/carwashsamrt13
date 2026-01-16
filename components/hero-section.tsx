import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, Shield, Zap, Calendar } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-[600px] md:min-h-[750px] flex items-center">
      <div className="absolute inset-0">
        <img src="/luxury-car-wash-premium-detailing-shiny-vehicle.jpg" alt="Premium car wash service" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background/40" />
      </div>

      <div className="relative container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-4xl">
          {/* Badge */}
          <div className="flex mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 backdrop-blur-md rounded-full border border-primary/40 hover:border-primary/60 transition-colors">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">✨ Premium Car Care Excellence</span>
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-foreground mb-6 leading-tight text-balance">
            Your Car Deserves <span className="text-primary">Premium Care</span>
          </h1>

          <p className="text-lg md:text-2xl text-foreground/80 mb-10 text-pretty max-w-2xl font-light">
            Professional detailing and washing with cutting-edge technology. Book instantly and enjoy pristine results.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <Link href="/booking" className="flex-1 sm:flex-none">
              <Button
                size="lg"
                className="w-full sm:w-auto h-13 px-8 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                <Calendar className="h-5 w-5 mr-2" />
                Book Appointment
              </Button>
            </Link>
            <Link href="#inquiry" className="flex-1 sm:flex-none">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto h-13 px-8 text-base font-semibold bg-background/30 backdrop-blur-md border-primary/40 hover:bg-background/50"
              >
                Send Inquiry
              </Button>
            </Link>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group relative bg-card/40 backdrop-blur-md hover:bg-card/60 transition-all duration-300 border border-primary/20 rounded-2xl p-6 hover:border-primary/50 hover:shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/40 transition-colors">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2 text-lg">Premium Quality</h3>
                <p className="text-sm text-foreground/70">Professional-grade products & latest technology</p>
              </div>
            </div>

            <div className="group relative bg-card/40 backdrop-blur-md hover:bg-card/60 transition-all duration-300 border border-primary/20 rounded-2xl p-6 hover:border-primary/50 hover:shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/40 transition-colors">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2 text-lg">Expert Technicians</h3>
                <p className="text-sm text-foreground/70">Trained professionals treating your car with care</p>
              </div>
            </div>

            <div className="group relative bg-card/40 backdrop-blur-md hover:bg-card/60 transition-all duration-300 border border-primary/20 rounded-2xl p-6 hover:border-primary/50 hover:shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/40 transition-colors">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2 text-lg">Lightning Fast</h3>
                <p className="text-sm text-foreground/70">Quick booking & efficient service</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
