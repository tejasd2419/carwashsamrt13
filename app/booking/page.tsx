import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BookingForm } from "@/components/booking-form"
import { Suspense } from "react"
import { Calendar, Clock, Award } from "lucide-react"

export default function BookingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-20 bg-gradient-to-b from-secondary/20 to-background">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 text-balance">Book Your Appointment</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Select your service, choose a convenient time slot, and we'll prepare your car for a premium wash
              experience.
            </p>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="flex items-start gap-4 p-6 bg-card rounded-xl border border-border/50 hover:border-primary/20 transition-colors">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Easy Scheduling</h3>
                <p className="text-sm text-muted-foreground">
                  Pick your preferred date and time slot with real-time availability
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-card rounded-xl border border-border/50 hover:border-primary/20 transition-colors">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Quick Process</h3>
                <p className="text-sm text-muted-foreground">Complete your booking in just 4 simple steps</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-card rounded-xl border border-border/50 hover:border-primary/20 transition-colors">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Premium Results</h3>
                <p className="text-sm text-muted-foreground">Guaranteed satisfaction with our expert technicians</p>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <Suspense
            fallback={
              <div className="text-center py-16">
                <div className="inline-flex items-center gap-2 text-muted-foreground">
                  <div className="h-2 w-2 bg-primary rounded-full animate-bounce" />
                  <span>Loading booking form...</span>
                </div>
              </div>
            }
          >
            <BookingForm />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  )
}
