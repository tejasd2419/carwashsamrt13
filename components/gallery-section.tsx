import { ChevronRight } from "lucide-react"

export function GallerySection() {
  const galleryItems = [
    {
      title: "Before & After Transformation",
      description: "See the dramatic difference our premium detailing makes",
      image: "/gallery-before-after-1.jpg",
      featured: true,
    },
    {
      title: "Professional Results",
      description: "Every vehicle treated with expert precision",
      image: "/gallery-before-after-2.jpg",
      featured: true,
    },
    {
      title: "Exterior Washing",
      description: "Advanced foam wash technique for pristine finish",
      image: "/service-exterior-wash.jpg",
      featured: false,
    },
    {
      title: "Interior Detailing",
      description: "Complete interior cleaning and conditioning",
      image: "/service-interior-cleaning.jpg",
      featured: false,
    },
    {
      title: "Ceramic Coating",
      description: "Long-lasting protective coating application",
      image: "/service-ceramic-coating.jpg",
      featured: false,
    },
    {
      title: "Premium Polish",
      description: "Expert wax and polish for ultimate shine",
      image: "/service-wax-polish.jpg",
      featured: false,
    },
  ]

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            Our Work Speaks for Itself
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Browse our gallery of satisfied customers and premium transformations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {galleryItems.map((item, idx) => (
            <div
              key={idx}
              className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 ${
                item.featured ? "lg:col-span-1" : ""
              }`}
            >
              <div className="relative aspect-video bg-muted overflow-hidden">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <h3 className="text-xl font-bold mb-2 group-hover:translate-y-0 translate-y-2 transition-transform duration-300">
                  {item.title}
                </h3>
                <p className="text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:gap-3 transition-all hover:shadow-lg">
            View Full Gallery
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  )
}
