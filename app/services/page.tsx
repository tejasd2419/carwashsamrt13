import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ServiceCard } from "@/components/service-card"
import { services } from "@/lib/data"
import { Check } from "lucide-react"

export default function ServicesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-20 bg-background">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <div className="text-center mb-20">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 text-balance">Our Premium Services</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
              From quick express washes to complete detailing packages, we have the perfect solution for your vehicle's
              care needs.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {services.map((service) => (
              <ServiceCard key={service.id} {...service} />
            ))}
          </div>

          {/* Comparison Section */}
          <div className="mt-20 bg-gradient-to-br from-secondary to-background rounded-2xl p-8 md:p-12 border border-border/50">
            <h2 className="text-4xl font-bold text-foreground mb-4 text-center">Service Comparison</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Choose the perfect service tier for your vehicle
            </p>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left p-4 font-semibold text-foreground border-b border-border">Feature</th>
                    {services.map((service) => (
                      <th
                        key={service.id}
                        className="text-center p-4 font-semibold text-foreground border-b border-border"
                      >
                        <div className="font-bold text-lg">{service.name}</div>
                        <div className="text-sm text-primary font-semibold mt-1">₹{service.price}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="p-4 text-muted-foreground font-medium">Duration</td>
                    {services.map((service) => (
                      <td key={service.id} className="text-center p-4 text-foreground">
                        <span className="inline-block px-3 py-1 bg-muted rounded-full text-sm font-medium">
                          {service.duration} mins
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-4 text-muted-foreground font-medium">Exterior Wash</td>
                    {services.map((service) => (
                      <td key={service.id} className="text-center p-4">
                        <Check className="h-5 w-5 text-primary mx-auto" />
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-4 text-muted-foreground font-medium">Interior Clean</td>
                    {services.map((service) => (
                      <td key={service.id} className="text-center p-4">
                        {service.id === "1" || service.id === "4" ? (
                          <span className="text-muted-foreground font-medium">-</span>
                        ) : (
                          <Check className="h-5 w-5 text-primary mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-4 text-muted-foreground font-medium">Wax Coating</td>
                    {services.map((service) => (
                      <td key={service.id} className="text-center p-4">
                        {service.id === "3" ? (
                          <Check className="h-5 w-5 text-primary mx-auto" />
                        ) : (
                          <span className="text-muted-foreground font-medium">-</span>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-4 text-muted-foreground font-medium">Air Freshener</td>
                    {services.map((service) => (
                      <td key={service.id} className="text-center p-4">
                        {service.id !== "1" && service.id !== "4" ? (
                          <Check className="h-5 w-5 text-primary mx-auto" />
                        ) : (
                          <span className="text-muted-foreground font-medium">-</span>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 text-muted-foreground font-medium">Leather Conditioning</td>
                    {services.map((service) => (
                      <td key={service.id} className="text-center p-4">
                        {service.id === "3" ? (
                          <Check className="h-5 w-5 text-primary mx-auto" />
                        ) : (
                          <span className="text-muted-foreground font-medium">-</span>
                        )}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
