"use client"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Clock, Check, Star, Sparkles } from "lucide-react"
import { useState } from "react"

interface ServiceCardProps {
  id: string
  name: string
  description: string
  price: number
  duration: number
  image: string
  features: string[]
}

export function ServiceCard({ id, name, description, price, duration, image, features }: ServiceCardProps) {
  const [imageError, setImageError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <Card
      className="overflow-hidden hover:shadow-2xl transition-all duration-500 h-full flex flex-col border border-border/50 hover:border-primary/50 hover:-translate-y-2 bg-card/80 backdrop-blur-sm"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full aspect-video bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 overflow-hidden flex-shrink-0 border-b border-border/30">
        {!imageError ? (
          <>
            {/* Background blur effect */}
            <div className="absolute inset-0 opacity-30">
              <Image
                src={image || "/placeholder.jpg"}
                alt={name}
                fill
                className="object-cover blur-xl scale-125"
                onError={handleImageError}
                priority={false}
              />
            </div>

            {/* Main image with smooth zoom */}
            <Image
              src={image || "/placeholder.jpg"}
              alt={name}
              fill
              className="object-cover transition-transform duration-500 ease-out relative z-10"
              style={{
                transform: isHovered ? "scale(1.08) rotate(1deg)" : "scale(1) rotate(0deg)",
                filter: isHovered ? "brightness(1.1)" : "brightness(0.95)",
              }}
              onError={handleImageError}
              priority={false}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/30 via-primary/10 to-primary/5 flex items-center justify-center">
            <div className="text-center">
              <Sparkles className="h-8 w-8 text-primary/60 mx-auto mb-2" />
              <span className="text-sm font-medium text-muted-foreground">{name}</span>
            </div>
          </div>
        )}

        {/* Premium gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

        {/* Premium badge with enhanced styling */}
        <div className="absolute top-4 right-4 bg-gradient-to-r from-primary to-accent/80 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg border border-primary/30 z-20">
          <Star className="h-3.5 w-3.5 text-primary-foreground fill-primary-foreground" />
          <span className="text-xs font-bold text-primary-foreground">Premium</span>
        </div>

        {/* Hover effect indicator */}
        {isHovered && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
              <span className="text-xs font-semibold text-white">Premium Experience</span>
            </div>
          </div>
        )}
      </div>

      <CardContent className="p-6 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent mb-2">
              {name}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
          </div>
        </div>

        {/* Price and Duration section */}
        <div className="flex flex-col gap-3 my-5 pb-5 border-b border-border/30">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-primary">₹{price}</span>
            <span className="text-xs text-muted-foreground font-medium">per service</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 px-3 py-2 rounded-lg w-fit border border-border/30">
            <Clock className="h-4 w-4 text-primary" />
            <span className="font-semibold">{duration} minutes</span>
          </div>
        </div>

        {/* Features list with icons */}
        <ul className="space-y-3 flex-1">
          {features.slice(0, 3).map((feature) => (
            <li key={feature} className="flex items-start gap-3 text-sm group/item">
              <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5 group-hover/item:scale-125 transition-transform" />
              <span className="text-muted-foreground group-hover/item:text-foreground transition-colors">
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="p-6 pt-0 mt-auto">
        <Link href={`/booking?service=${id}`} className="w-full group/btn">
          <Button className="w-full font-semibold h-12 text-base relative overflow-hidden group bg-gradient-to-r from-primary to-primary/80 hover:to-primary transition-all duration-300">
            <span className="relative z-10">Book Service</span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
