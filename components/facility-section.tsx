import { Zap, Droplets, Gauge } from "lucide-react"

export function FacilitySection() {
  const facilities = [
    {
      icon: Zap,
      title: "State-of-the-Art Equipment",
      description: "Latest technology for superior cleaning and detailing results",
    },
    {
      icon: Droplets,
      title: "Eco-Friendly Solutions",
      description: "Environment-conscious cleaning products that work effectively",
    },
    {
      icon: Gauge,
      title: "Quality Control",
      description: "Every vehicle undergoes rigorous inspection before departure",
    },
  ]

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative rounded-2xl overflow-hidden order-2 lg:order-1">
            <img
              src="/facility-modern-carwash.jpg"
              alt="Modern car wash facility"
              className="w-full h-auto rounded-2xl object-cover shadow-xl"
            />
            <div className="absolute inset-0 ring-1 ring-white/20 rounded-2xl" />
          </div>

          <div className="order-1 lg:order-2">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
              Premium Facilities & Equipment
            </h2>
            <p className="text-lg text-muted-foreground mb-8 text-pretty">
              Our state-of-the-art facility is equipped with the latest automotive care technology to ensure your
              vehicle receives the best treatment possible.
            </p>

            <div className="space-y-6">
              {facilities.map((facility, idx) => {
                const Icon = facility.icon
                return (
                  <div key={idx} className="flex gap-4 group">
                    <div className="h-12 w-12 rounded-lg bg-primary/20 group-hover:bg-primary/40 flex items-center justify-center flex-shrink-0 transition-colors">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                        {facility.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">{facility.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
