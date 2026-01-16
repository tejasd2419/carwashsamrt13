"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"
import { Droplets, Loader2, Lock, Mail } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const result = await login(email, password)

    if (result.success) {
      router.push("/dashboard")
    } else {
      setError(result.error || "Login failed")
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4 bg-gradient-to-br from-secondary/20 to-background">
        <div className="w-full max-w-md">
          <Card className="shadow-xl border-border/50">
            <CardHeader className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80">
                  <Droplets className="h-8 w-8 text-primary-foreground" />
                </div>
              </div>
              <div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  Welcome Back
                </CardTitle>
                <CardDescription className="text-base mt-2">Sign in to your SparkleWash account</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="p-4 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-2">
                    <span className="text-lg">⚠️</span>
                    <span>{error}</span>
                  </div>
                )}

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10 h-11"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-10 h-11"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full h-11 font-medium" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-card text-muted-foreground">New to SparkleWash?</span>
                </div>
              </div>

              {/* Sign Up Link */}
              <p className="text-center text-sm">
                <Link href="/register" className="font-semibold text-primary hover:text-primary/80 transition-colors">
                  Create an account
                </Link>
              </p>

              {/* Demo Credentials */}
              <div className="mt-8 p-4 bg-muted rounded-xl border border-border/50">
                <p className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wide">Demo Credentials</p>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div>
                    <p className="font-medium text-foreground">Customer Account:</p>
                    <p>Email: rahul@example.com</p>
                    <p>Password: user123</p>
                  </div>
                  <div className="pt-2 border-t border-border">
                    <p className="font-medium text-foreground">Admin Account:</p>
                    <p>Email: admin@sparklewash.com</p>
                    <p>Password: admin123</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
