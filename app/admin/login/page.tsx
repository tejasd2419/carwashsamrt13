"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"
import { Droplets, Loader2, Shield } from "lucide-react"

export default function AdminLoginPage() {
  const router = useRouter()
  const { adminLogin } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const result = await adminLogin(email, password)

    if (result.success) {
      router.push("/admin")
    } else {
      setError(result.error || "Login failed")
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 to-background">
      {/* Header */}
      <header className="bg-foreground/5 border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
              <Droplets className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">SparkleWash</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md border-2 border-primary/20">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 border-2 border-primary/30">
                <Shield className="h-8 w-8 text-primary" />
              </div>
            </div>
            <div>
              <CardTitle className="text-2xl flex items-center justify-center gap-2">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">ADMIN</span>
              </CardTitle>
              <CardDescription className="text-base mt-2">Administrator Portal</CardDescription>
              <p className="text-xs text-muted-foreground mt-2">Access restricted to authorized administrators only</p>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg border border-destructive/20">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@sparklewash.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-primary/20 focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-primary/20 focus:border-primary"
                />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Admin Sign In
                  </>
                )}
              </Button>
            </form>

            {/* Demo Info */}
            <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg space-y-2">
              <p className="text-xs font-bold text-amber-700">Demo Admin Credentials:</p>
              <p className="text-xs text-amber-700">Email: admin@sparklewash.com</p>
              <p className="text-xs text-amber-700">Password: admin123</p>
            </div>

            {/* Back Link */}
            <div className="mt-4 text-center text-sm">
              <span className="text-muted-foreground">Not an admin? </span>
              <Link href="/login" className="text-primary hover:underline font-medium">
                Customer login
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
