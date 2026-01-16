"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { BookingStatusTimeline } from "@/components/booking-status-timeline"
import { Calendar, Car, Clock, Plus, User, Loader2, Eye, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import type { Booking, Vehicle } from "@/lib/types"

interface DashboardStats {
  totalBookings: number
  totalRevenue: number
}

interface BookingResponse {
  success: boolean
  data?: {
    bookings: any[]
  }
  error?: string
}

interface StatsResponse {
  success: boolean
  data?: {
    stats: DashboardStats
  }
  error?: string
}

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [stats, setStats] = useState<DashboardStats>({ totalBookings: 0, totalRevenue: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isTimelineModalOpen, setIsTimelineModalOpen] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/dashboard")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      const token = localStorage.getItem("auth_token") || ""
      fetchDashboardData(token)
    }
  }, [user])

  const fetchDashboardData = async (token: string) => {
    try {
      setIsLoading(true)
      setError(null)

      const [bookingsRes, vehiclesRes, statsRes] = await Promise.all([
        fetch("http://localhost:5000/api/bookings", {
          headers: { Authorization: `Bearer ${token}` },
        }).then((res) => res.json() as Promise<BookingResponse>),
        fetch("http://localhost:5000/api/vehicles", {
          headers: { Authorization: `Bearer ${token}` },
        }).then((res) => res.json()),
        fetch("http://localhost:5000/api/bookings/stats", {
          headers: { Authorization: `Bearer ${token}` },
        }).then((res) => res.json() as Promise<StatsResponse>),
      ])

      console.log("[v0] Dashboard API Responses:", {
        bookings: bookingsRes,
        vehicles: vehiclesRes,
        stats: statsRes,
      })

      if (bookingsRes.success && bookingsRes.data?.bookings) {
        const processedBookings = bookingsRes.data.bookings.map((booking: any) => ({
          ...booking,
          id: booking.id,
          status: booking.status?.toLowerCase() || "pending",
          serviceName: booking.serviceName || "Unknown Service",
          vehicleName: booking.vehicleName || "Unknown Vehicle",
          vehicleNumber: booking.vehicleNumber || "N/A",
          date: booking.date || new Date().toISOString().split("T")[0],
          time: booking.time || "N/A",
          price: booking.price || 0,
          total_price: booking.amount || booking.total_price || 0,
          amount: booking.amount || booking.total_price || 0,
        }))
        setBookings(processedBookings)
        console.log("[v0] Processed bookings:", processedBookings)
      } else {
        console.warn("[v0] No bookings data received")
        setBookings([])
      }

      if (vehiclesRes.success && vehiclesRes.data?.vehicles) {
        setVehicles(vehiclesRes.data.vehicles)
        console.log("[v0] Vehicles loaded:", vehiclesRes.data.vehicles)
      } else {
        setVehicles([])
      }

      if (statsRes.success && statsRes.data?.stats) {
        const statsData = statsRes.data.stats
        setStats({
          totalBookings: statsData.totalBookings || 0,
          totalRevenue: statsData.totalRevenue || 0,
        })
        console.log("[v0] Stats loaded:", statsData)
      } else {
        console.warn("[v0] No stats data received")
        setStats({ totalBookings: 0, totalRevenue: 0 })
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to load dashboard data"
      console.error("[v0] Dashboard error:", err)
      setError(errorMsg)
      setStats({ totalBookings: 0, totalRevenue: 0 })
    } finally {
      setIsLoading(false)
    }
  }

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading your dashboard...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!user) return null

  const upcomingBookings = bookings.filter(
    (b) => b.status === "pending" || b.status === "confirmed" || b.status === "in-progress",
  )
  const pastBookings = bookings.filter((b) => b.status === "completed" || b.status === "cancelled")

  const upcomingRevenue = upcomingBookings.reduce((sum, b) => sum + (b.amount || 0), 0)
  const pastRevenue = pastBookings.reduce((sum, b) => sum + (b.amount || 0), 0)

  const getStatusBadge = (status: string) => {
    const statusStyles: Record<string, { bg: string; text: string; label: string }> = {
      pending: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Pending" },
      confirmed: { bg: "bg-blue-100", text: "text-blue-800", label: "Confirmed" },
      "in-progress": { bg: "bg-purple-100", text: "text-purple-800", label: "In Progress" },
      completed: { bg: "bg-green-100", text: "text-green-800", label: "Completed" },
      cancelled: { bg: "bg-red-100", text: "text-red-800", label: "Cancelled" },
    }
    const style = statusStyles[status] || statusStyles.pending
    return <Badge className={`${style.bg} ${style.text} hover:${style.bg}`}>{style.label}</Badge>
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12 bg-gradient-to-b from-secondary/10 to-background">
        <div className="container mx-auto px-4">
          {/* Welcome Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
                Welcome back, <span className="text-primary">{user.name.split(" ")[0]}</span>!
              </h1>
              <p className="text-lg text-muted-foreground">Manage your bookings and vehicles all in one place</p>
            </div>
            <Link href="/booking">
              <Button size="lg" className="gap-2 h-12 px-8">
                <Plus className="h-5 w-5" />
                New Booking
              </Button>
            </Link>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-8 p-4 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
              {error}
            </div>
          )}

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1 font-medium">Total Bookings</p>
                    <p className="text-3xl font-bold text-foreground">{stats.totalBookings}</p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-accent/5 to-transparent border-accent/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1 font-medium">Registered Vehicles</p>
                    <p className="text-3xl font-bold text-foreground">{vehicles.length}</p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Car className="h-6 w-6 text-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500/5 to-transparent border-green-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1 font-medium">Total Spent</p>
                    <p className="text-3xl font-bold text-foreground">₹{stats.totalRevenue.toLocaleString()}</p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs Section */}
          <Tabs defaultValue="bookings" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 h-12">
              <TabsTrigger value="bookings">My Bookings</TabsTrigger>
              <TabsTrigger value="vehicles">My Vehicles</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>

            {/* Bookings Tab */}
            <TabsContent value="bookings" className="space-y-6">
              {/* Upcoming Bookings */}
              <Card>
                <CardHeader className="border-b border-border/50">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl">Upcoming Bookings</CardTitle>
                      <p className="text-sm text-muted-foreground mt-2">
                        Revenue: <span className="font-semibold text-primary">₹{upcomingRevenue.toLocaleString()}</span>
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-lg border border-primary/20">
                      <span className="text-2xl font-bold text-primary">{upcomingBookings.length}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {upcomingBookings.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingBookings.map((booking) => (
                        <div
                          key={booking.id}
                          className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-gradient-to-r from-primary/5 to-transparent rounded-xl border border-primary/20 gap-4 hover:border-primary/40 transition-colors"
                        >
                          <div className="flex items-start gap-4 flex-1">
                            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <Car className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-foreground text-lg">{booking.serviceName}</p>
                              <p className="text-sm text-muted-foreground mb-3 truncate">
                                {booking.vehicleName} • {booking.vehicleNumber}
                              </p>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-muted-foreground">{booking.date}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-muted-foreground">{booking.time}</span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">
                                    ₹{(booking.price || 0).toLocaleString()}
                                  </span>
                                </div>
                                <div>
                                  <span className="font-semibold text-foreground">
                                    ₹{(booking.amount || 0).toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-start md:items-end gap-3">
                            {getStatusBadge(booking.status)}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedBooking(booking)
                                setIsTimelineModalOpen(true)
                              }}
                              className="gap-2 w-full md:w-auto"
                            >
                              <Eye className="h-4 w-4" />
                              Status
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Calendar className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                      <p className="text-muted-foreground mb-6 text-lg">No upcoming bookings yet</p>
                      <Link href="/booking">
                        <Button>Book Your First Appointment</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Past Bookings */}
              <Card>
                <CardHeader className="border-b border-border/50">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl">Past Bookings</CardTitle>
                      <p className="text-sm text-muted-foreground mt-2">
                        Revenue: <span className="font-semibold">₹{pastRevenue.toLocaleString()}</span>
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-lg border border-border">
                      <span className="text-2xl font-bold text-muted-foreground">{pastBookings.length}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {pastBookings.length > 0 ? (
                    <div className="space-y-4">
                      {pastBookings.map((booking) => (
                        <div
                          key={booking.id}
                          className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-muted/50 rounded-xl border border-border gap-4 opacity-75 hover:opacity-100 transition-opacity"
                        >
                          <div className="flex items-start gap-4 flex-1">
                            <div className="h-12 w-12 rounded-lg bg-muted-foreground/10 flex items-center justify-center flex-shrink-0">
                              <Car className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-foreground text-lg">{booking.serviceName}</p>
                              <p className="text-sm text-muted-foreground mb-3 truncate">
                                {booking.vehicleName} • {booking.vehicleNumber}
                              </p>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-muted-foreground">{booking.date}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-muted-foreground">{booking.time}</span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">
                                    ₹{(booking.price || 0).toLocaleString()}
                                  </span>
                                </div>
                                <div>
                                  <span className="font-semibold">₹{(booking.amount || 0).toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-start md:items-end gap-3">
                            {getStatusBadge(booking.status)}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedBooking(booking)
                                setIsTimelineModalOpen(true)
                              }}
                              className="gap-2 w-full md:w-auto"
                            >
                              <Eye className="h-4 w-4" />
                              Status
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No past bookings</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Vehicles Tab */}
            <TabsContent value="vehicles">
              <Card>
                <CardHeader className="border-b border-border/50">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <CardTitle className="text-xl">My Vehicles</CardTitle>
                    <Link href="/booking">
                      <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                        <Plus className="h-4 w-4" />
                        Add Vehicle
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {vehicles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {vehicles.map((vehicle) => (
                        <div
                          key={vehicle.id}
                          className="flex items-center gap-4 p-4 bg-gradient-to-br from-primary/5 to-transparent rounded-xl border border-primary/20 hover:border-primary/40 transition-colors"
                        >
                          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Car className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-foreground">{vehicle.name}</p>
                            <p className="text-sm text-muted-foreground">{vehicle.number}</p>
                          </div>
                          <Badge className="capitalize bg-primary/10 text-primary hover:bg-primary/20">
                            {vehicle.type}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Car className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                      <p className="text-muted-foreground mb-6 text-lg">No vehicles registered yet</p>
                      <Link href="/booking">
                        <Button>Register Your First Vehicle</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <p className="text-sm text-muted-foreground font-medium mb-2">Full Name</p>
                      <p className="text-lg font-semibold text-foreground">{user.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-medium mb-2">Email Address</p>
                      <p className="text-lg font-semibold text-foreground">{user.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-medium mb-2">Account Type</p>
                      <p className="text-lg font-semibold text-foreground capitalize">{user.role || "Customer"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-medium mb-2">Member Since</p>
                      <p className="text-lg font-semibold text-foreground">
                        {new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long" })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Timeline Modal */}
      <Dialog open={isTimelineModalOpen} onOpenChange={setIsTimelineModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Booking Status</DialogTitle>
          </DialogHeader>
          {selectedBooking && <BookingStatusTimeline booking={selectedBooking} />}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  )
}
