import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/hero-section"
import { ServiceCard } from "@/components/service-card"
import { InquiryForm } from "@/components/inquiry-form"
import { GallerySection } from "@/components/gallery-section"
import { TeamSection } from "@/components/team-section"
import { FacilitySection } from "@/components/facility-section"
import { services } from "@/lib/data"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2, Users, Award, Star } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />

        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative overflow-hidden rounded-2xl aspect-video group">
                <img
                  src="/professional-car-wash-foam-cleaning-luxury-vehicle.jpg"
                  alt="Car wash service"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-bold mb-1">Expert Washing</h3>
                  <p className="text-sm opacity-90">Professional techniques for pristine results</p>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-2xl aspect-video group">
                <img
                  src="/car-detailing-ceramic-coating-shine-polish.jpg"
                  alt="Car detailing service"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-bold mb-1">Premium Detailing</h3>
                  <p className="text-sm opacity-90">Complete care for luxury vehicles</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 bg-gradient-to-b from-background to-primary/5">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">Our Premium Services</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
                Choose from our comprehensive range of professional car care solutions tailored to your vehicle's needs
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {services.map((service) => (
                <ServiceCard key={service.id} {...service} />
              ))}
            </div>

            <div className="text-center">
              <Link href="/services">
                <Button size="lg" variant="outline" className="bg-transparent">
                  View All Services <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <GallerySection />

        <TeamSection />

        <FacilitySection />

        {/* Trust Section */}
        <section className="py-20 bg-gradient-to-br from-primary/10 via-accent/5 to-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="group relative bg-card/50 backdrop-blur rounded-2xl p-8 hover:bg-card hover:shadow-xl transition-all border border-border/50 hover:border-primary/20">
                <div className="h-16 w-16 rounded-xl bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center mx-auto mb-6 transition-colors">
                  <CheckCircle2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2 text-center">100% Satisfaction</h3>
                <p className="text-muted-foreground text-center">We guarantee perfect results or your money back</p>
              </div>

              <div className="group relative bg-card/50 backdrop-blur rounded-2xl p-8 hover:bg-card hover:shadow-xl transition-all border border-border/50 hover:border-primary/20">
                <div className="h-16 w-16 rounded-xl bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center mx-auto mb-6 transition-colors">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2 text-center">Award Winning</h3>
                <p className="text-muted-foreground text-center">Recognized for excellence in automotive care</p>
              </div>

              <div className="group relative bg-card/50 backdrop-blur rounded-2xl p-8 hover:bg-card hover:shadow-xl transition-all border border-border/50 hover:border-primary/20">
                <div className="h-16 w-16 rounded-xl bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center mx-auto mb-6 transition-colors">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2 text-center">Expert Team</h3>
                <p className="text-muted-foreground text-center">Trained professionals with years of experience</p>
              </div>
            </div>

            {/* Rating Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-50/30 border border-yellow-200/50 rounded-2xl p-8">
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-lg font-semibold text-foreground mb-2">Amazing Quality & Service</p>
                <p className="text-muted-foreground">
                  "SparkleWash transformed my car! The attention to detail is incredible. Highly recommended!"
                </p>
                <p className="text-sm text-muted-foreground mt-4">- Rajesh M.</p>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-yellow-50/30 border border-yellow-200/50 rounded-2xl p-8">
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-lg font-semibold text-foreground mb-2">Best in the City</p>
                <p className="text-muted-foreground">
                  "Professional team, affordable prices, and they really care about your vehicle. Best experience!"
                </p>
                <p className="text-sm text-muted-foreground mt-4">- Priya Singh</p>
              </div>
            </div>
          </div>
        </section>

        <InquiryForm />

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary via-primary to-accent">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6 text-balance">
                Ready to Transform Your Vehicle?
              </h2>
              <p className="text-lg text-primary-foreground/90 mb-10 text-pretty">
                Book your premium car wash today and experience the SparkleWash difference
              </p>
              <Link href="/booking">
                <Button
                  size="lg"
                  variant="secondary"
                  className="font-medium h-12 px-10 text-base hover:shadow-lg transition-all"
                >
                  Book Your Appointment Now
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
