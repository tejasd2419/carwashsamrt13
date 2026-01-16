"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, Droplets, User, LogOut, Settings, ChevronDown } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80">
              <Droplets className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                SparkleWash
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <Link
              href="/services"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Services
            </Link>
            <Link
              href="/booking"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Book Now
            </Link>
            {user && (
              <Link
                href="/dashboard"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
            )}
            {user?.role === "admin" && (
              <Link
                href="/admin"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Admin
              </Link>
            )}
          </nav>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-3">
            {isLoading ? (
              <div className="h-9 w-20 bg-muted animate-pulse rounded-lg" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium hidden sm:inline">{user.name.split(" ")[0]}</span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2.5 text-sm">
                    <p className="font-semibold text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                      <Settings className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  {user.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="cursor-pointer">
                        <Settings className="h-4 w-4 mr-2" />
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/booking">
                  <Button size="sm" className="font-medium">
                    Book Now
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border/50 bg-card/50">
            <div className="flex flex-col gap-2">
              <Link
                href="/"
                className="px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors font-medium text-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/services"
                className="px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors font-medium text-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                href="/booking"
                className="px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors font-medium text-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                Book Now
              </Link>
              {user && (
                <Link
                  href="/dashboard"
                  className="px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors font-medium text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              {user?.role === "admin" && (
                <Link
                  href="/admin"
                  className="px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors font-medium text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin Panel
                </Link>
              )}
              <div className="px-4 pt-3 flex flex-col gap-2 border-t border-border/50">
                {user ? (
                  <Button variant="outline" onClick={handleLogout} className="w-full justify-start bg-transparent">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                ) : (
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <User className="h-4 w-4 mr-2" />
                      Login
                    </Button>
                  </Link>
                )}
                <Link href="/booking" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full">Book Appointment</Button>
                </Link>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
