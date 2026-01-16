import { Award, Shield, Sparkles } from "lucide-react"

export function TeamSection() {
  const teamHighlights = [
    {
      icon: Award,
      title: "Certified Professionals",
      description: "All team members hold industry certifications",
    },
    {
      icon: Shield,
      title: "10+ Years Experience",
      description: "Decades of combined automotive care expertise",
    },
    {
      icon: Sparkles,
      title: "Passion for Details",
      description: "We take pride in every service we deliver",
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 via-accent/5 to-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">Meet Our Expert Team</h2>
            <p className="text-lg text-muted-foreground mb-8 text-pretty">
              Our dedicated team of automotive care specialists brings years of experience and passion to every vehicle
              we service. We're committed to delivering excellence.
            </p>

            <div className="space-y-6">
              {teamHighlights.map((highlight, idx) => {
                const Icon = highlight.icon
                return (
                  <div key={idx} className="flex gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{highlight.title}</h3>
                      <p className="text-muted-foreground text-sm">{highlight.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden">
            <img
              src="/team-professional-washers.jpg"
              alt="Professional car wash team"
              className="w-full h-auto rounded-2xl object-cover shadow-xl"
            />
            <div className="absolute inset-0 ring-1 ring-white/20 rounded-2xl" />
          </div>
        </div>
      </div>
    </section>
  )
}
