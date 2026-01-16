"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/lib/auth-context"
import { BookingsTable } from "@/components/admin/bookings-table"
import {
  Calendar,
  Car,
  Users,
  IndianRupee,
  Droplets,
  Settings,
  LogOut,
  Check,
  AlertCircle,
  Loader2,
  Plus,
  Edit2,
  Trash2,
  Filter,
} from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { Booking, Staff } from "@/lib/types"

interface User {
  id: number
  name: string
  email: string
  phone: string
  role: string
  created_at: string
}

interface Service {
  id: number
  name: string
  description: string
  price: number
  duration: number
}

export default function AdminDashboard() {
  const { user, isLoading: authLoading, logout } = useAuth()
  const router = useRouter()

  const [bookings, setBookings] = useState<Booking[]>([])
  const [staff, setStaff] = useState<Staff[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [services, setServices] = useState<Service[]>([])

  const [stats, setStats] = useState({
    todayBookings: 0,
    todayRevenue: 0,
    totalCustomers: 0,
    activeStaff: 0,
    totalBookings: 0,
    totalRevenue: 0,
  })

  const [weeklyRevenue, setWeeklyRevenue] = useState<{ day: string; revenue: number }[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  // Dialog states
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null)
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false)
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false)
  const [isStaffDialogOpen, setIsStaffDialogOpen] = useState(false)

  // Form states
  const [userForm, setUserForm] = useState({ name: "", email: "", phone: "", role: "customer", password: "" })
  const [serviceForm, setServiceForm] = useState({ name: "", description: "", price: 0, duration: 30 })
  const [staffForm, setStaffForm] = useState({
    name: "",
    email: "",
    phone: "",
    position: "Technician",
    status: "Active",
  })

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      router.push("/admin/login")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user?.role === "admin") {
      const token = localStorage.getItem("admin_token") || localStorage.getItem("auth_token") || ""
      fetchAllData(token)
    }
  }, [user])

  const fetchAllData = async (token: string) => {
    try {
      const [bookingsData, staffData, statsData, usersData, servicesData] = await Promise.all([
        fetch("http://localhost:5000/api/admin/bookings", {
          headers: { Authorization: `Bearer ${token}` },
        }).then((res) => res.json()),
        fetch("http://localhost:5000/api/admin/staff", {
          headers: { Authorization: `Bearer ${token}` },
        }).then((res) => res.json()),
        fetch("http://localhost:5000/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        }).then((res) => res.json()),
        fetch("http://localhost:5000/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        }).then((res) => res.json()),
        fetch("http://localhost:5000/api/admin/services", {
          headers: { Authorization: `Bearer ${token}` },
        }).then((res) => res.json()),
      ])

      if (bookingsData.success) setBookings(bookingsData.data.bookings)
      if (staffData.success) setStaff(staffData.data.staff)
      if (statsData.success) {
        setStats(statsData.data.stats)
        setWeeklyRevenue(statsData.data.weeklyRevenue)
      }
      if (usersData.success) setUsers(usersData.data.users)
      if (servicesData.success) setServices(servicesData.data.services)
      setIsLoading(false)
    } catch (error) {
      console.error("[v0] Error fetching admin data:", error)
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  const handleCreateUser = async () => {
    const token = localStorage.getItem("admin_token") || localStorage.getItem("auth_token") || ""
    try {
      const res = await fetch("http://localhost:5000/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userForm),
      })
      const data = await res.json()
      if (data.success) {
        setUsers([...users, data.data.user])
        setUserForm({ name: "", email: "", phone: "", role: "customer", password: "" })
        setIsUserDialogOpen(false)
      }
    } catch (error) {
      console.error("Error creating user:", error)
    }
  }

  const handleUpdateUser = async () => {
    if (!editingUser) return
    const token = localStorage.getItem("admin_token") || localStorage.getItem("auth_token") || ""
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${editingUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userForm),
      })
      const data = await res.json()
      if (data.success) {
        setUsers(users.map((u) => (u.id === editingUser.id ? { ...editingUser, ...userForm } : u)))
        setEditingUser(null)
        setUserForm({ name: "", email: "", phone: "", role: "customer", password: "" })
        setIsUserDialogOpen(false)
      }
    } catch (error) {
      console.error("Error updating user:", error)
    }
  }

  const handleDeleteUser = async (id: number) => {
    const token = localStorage.getItem("admin_token") || localStorage.getItem("auth_token") || ""
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (data.success) {
        setUsers(users.filter((u) => u.id !== id))
      }
    } catch (error) {
      console.error("Error deleting user:", error)
    }
  }

  const handleCreateService = async () => {
    const token = localStorage.getItem("admin_token") || localStorage.getItem("auth_token") || ""
    try {
      const res = await fetch("http://localhost:5000/api/admin/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(serviceForm),
      })
      const data = await res.json()
      if (data.success) {
        setServices([...services, data.data.service])
        setServiceForm({ name: "", description: "", price: 0, duration: 30 })
        setIsServiceDialogOpen(false)
      }
    } catch (error) {
      console.error("Error creating service:", error)
    }
  }

  const handleUpdateService = async () => {
    if (!editingService) return
    const token = localStorage.getItem("admin_token") || localStorage.getItem("auth_token") || ""
    try {
      const res = await fetch(`http://localhost:5000/api/admin/services/${editingService.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(serviceForm),
      })
      const data = await res.json()
      if (data.success) {
        setServices(services.map((s) => (s.id === editingService.id ? { ...editingService, ...serviceForm } : s)))
        setEditingService(null)
        setServiceForm({ name: "", description: "", price: 0, duration: 30 })
        setIsServiceDialogOpen(false)
      }
    } catch (error) {
      console.error("Error updating service:", error)
    }
  }

  const handleDeleteService = async (id: number) => {
    const token = localStorage.getItem("admin_token") || localStorage.getItem("auth_token") || ""
    try {
      const res = await fetch(`http://localhost:5000/api/admin/services/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (data.success) {
        setServices(services.filter((s) => s.id !== id))
      }
    } catch (error) {
      console.error("Error deleting service:", error)
    }
  }

  const handleCreateStaff = async () => {
    const token = localStorage.getItem("admin_token") || localStorage.getItem("auth_token") || ""
    try {
      const res = await fetch("http://localhost:5000/api/admin/staff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(staffForm),
      })
      const data = await res.json()
      if (data.success) {
        setStaff([...staff, data.data.staff])
        setStaffForm({ name: "", email: "", phone: "", position: "Technician", status: "Active" })
        setIsStaffDialogOpen(false)
      }
    } catch (error) {
      console.error("Error creating staff:", error)
    }
  }

  const handleUpdateStaff = async () => {
    if (!editingStaff) return
    const token = localStorage.getItem("admin_token") || localStorage.getItem("auth_token") || ""
    try {
      const res = await fetch(`http://localhost:5000/api/admin/staff/${editingStaff.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(staffForm),
      })
      const data = await res.json()
      if (data.success) {
        setStaff(staff.map((s) => (s.id === editingStaff.id ? { ...editingStaff, ...staffForm } : s)))
        setEditingStaff(null)
        setStaffForm({ name: "", email: "", phone: "", position: "Technician", status: "Active" })
        setIsStaffDialogOpen(false)
      }
    } catch (error) {
      console.error("Error updating staff:", error)
    }
  }

  const handleDeleteStaff = async (id: number) => {
    const token = localStorage.getItem("admin_token") || localStorage.getItem("auth_token") || ""
    try {
      const res = await fetch(`http://localhost:5000/api/admin/staff/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (data.success) {
        setStaff(staff.filter((s) => s.id !== id))
      }
    } catch (error) {
      console.error("Error deleting staff:", error)
    }
  }

  const handleUpdateBookingStatus = async (bookingId: string, newStatus: string) => {
    const token = localStorage.getItem("admin_token") || localStorage.getItem("auth_token") || ""
    try {
      const res = await fetch(`http://localhost:5000/api/admin/bookings/${bookingId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      })

      const data = await res.json()
      if (data.success) {
        setBookings(bookings.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b)))
        // Optionally refresh the entire data to get updated statistics
        await fetchAllData(token)
      }
    } catch (error) {
      console.error("[v0] Error updating booking status:", error)
    }
  }

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredServices = services.filter((s) => s.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
            <Check className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        )
      case "in-progress":
        return (
          <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            In Progress
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">
            <AlertCircle className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      case "confirmed":
        return (
          <Badge className="bg-primary/10 text-primary border-primary/20">
            <Check className="h-3 w-3 mr-1" />
            Confirmed
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user || user.role !== "admin") return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Admin Header */}
      <header className="bg-foreground text-background sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                <Droplets className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <span className="text-lg font-bold">SparkleWash</span>
                <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded ml-2">Admin</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-background hover:bg-background/10">
                  View Site
                </Button>
              </Link>
              <Button variant="ghost" size="icon" className="text-background hover:bg-background/10">
                <Settings className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-background hover:bg-background/10"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user.name}! Manage all operations here.</p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 flex flex-col items-center gap-2">
              <Calendar className="h-6 w-6 text-primary" />
              <p className="text-xs text-muted-foreground text-center">Total Bookings</p>
              <p className="text-2xl font-bold text-foreground">{stats.totalBookings}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex flex-col items-center gap-2">
              <Calendar className="h-6 w-6 text-primary" />
              <p className="text-xs text-muted-foreground text-center">Today</p>
              <p className="text-2xl font-bold text-foreground">{stats.todayBookings}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex flex-col items-center gap-2">
              <IndianRupee className="h-6 w-6 text-primary" />
              <p className="text-xs text-muted-foreground text-center">Total Revenue</p>
              <p className="text-2xl font-bold text-foreground">₹{stats.totalRevenue}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex flex-col items-center gap-2">
              <Users className="h-6 w-6 text-blue-500" />
              <p className="text-xs text-muted-foreground text-center">Customers</p>
              <p className="text-2xl font-bold text-foreground">{stats.totalCustomers}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex flex-col items-center gap-2">
              <Car className="h-6 w-6 text-amber-500" />
              <p className="text-xs text-muted-foreground text-center">Active Staff</p>
              <p className="text-2xl font-bold text-foreground">{stats.activeStaff}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex flex-col items-center gap-2">
              <Filter className="h-6 w-6 text-green-500" />
              <p className="text-xs text-muted-foreground text-center">Services</p>
              <p className="text-2xl font-bold text-foreground">{services.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="bookings" className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none bg-white px-6 py-4 h-auto">
            <TabsTrigger value="bookings" className="data-[state=active]:border-b-2">
              Bookings
            </TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6 p-6">
            <BookingsTable bookings={bookings} onStatusChange={handleUpdateBookingStatus} isLoading={isLoading} />
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6 p-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Users Management</CardTitle>
                  <CardDescription>Manage all customer accounts</CardDescription>
                </div>
                <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => {
                        setEditingUser(null)
                        setUserForm({ name: "", email: "", phone: "", role: "customer", password: "" })
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add User
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingUser ? "Edit User" : "Create New User"}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Name</Label>
                        <Input
                          value={userForm.name}
                          onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                          placeholder="Full Name"
                        />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input
                          value={userForm.email}
                          onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                          placeholder="email@example.com"
                        />
                      </div>
                      <div>
                        <Label>Phone</Label>
                        <Input
                          value={userForm.phone}
                          onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                          placeholder="Phone Number"
                        />
                      </div>
                      <div>
                        <Label>Role</Label>
                        <Select
                          value={userForm.role}
                          onValueChange={(value) => setUserForm({ ...userForm, role: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="customer">Customer</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {!editingUser && (
                        <div>
                          <Label>Password</Label>
                          <Input
                            type="password"
                            value={userForm.password}
                            onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                            placeholder="Password"
                          />
                        </div>
                      )}
                      <div className="flex gap-2 justify-end">
                        <Button variant="outline" onClick={() => setIsUserDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={editingUser ? handleUpdateUser : handleCreateUser}>
                          {editingUser ? "Update" : "Create"}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex gap-2">
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-medium">Name</th>
                        <th className="text-left p-3 font-medium">Email</th>
                        <th className="text-left p-3 font-medium">Phone</th>
                        <th className="text-left p-3 font-medium">Role</th>
                        <th className="text-left p-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((u) => (
                        <tr key={u.id} className="border-b hover:bg-muted/50">
                          <td className="p-3">{u.name}</td>
                          <td className="p-3">{u.email}</td>
                          <td className="p-3">{u.phone}</td>
                          <td className="p-3">
                            <Badge variant={u.role === "admin" ? "default" : "secondary"}>{u.role}</Badge>
                          </td>
                          <td className="p-3">
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setEditingUser(u)
                                  setUserForm({
                                    name: u.name,
                                    email: u.email,
                                    phone: u.phone,
                                    role: u.role,
                                    password: "",
                                  })
                                  setIsUserDialogOpen(true)
                                }}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-destructive hover:text-destructive"
                                onClick={() => handleDeleteUser(u.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6 p-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Services Management</CardTitle>
                  <CardDescription>Manage car wash services</CardDescription>
                </div>
                <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => {
                        setEditingService(null)
                        setServiceForm({ name: "", description: "", price: 0, duration: 30 })
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Service
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingService ? "Edit Service" : "Create New Service"}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Service Name</Label>
                        <Input
                          value={serviceForm.name}
                          onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                          placeholder="e.g., Premium Wash"
                        />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Input
                          value={serviceForm.description}
                          onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                          placeholder="Service description"
                        />
                      </div>
                      <div>
                        <Label>Price (₹)</Label>
                        <Input
                          type="number"
                          value={serviceForm.price}
                          onChange={(e) => setServiceForm({ ...serviceForm, price: Number.parseFloat(e.target.value) })}
                          placeholder="500"
                        />
                      </div>
                      <div>
                        <Label>Duration (minutes)</Label>
                        <Input
                          type="number"
                          value={serviceForm.duration}
                          onChange={(e) =>
                            setServiceForm({ ...serviceForm, duration: Number.parseInt(e.target.value) })
                          }
                          placeholder="30"
                        />
                      </div>
                      <div className="flex gap-2 justify-end">
                        <Button variant="outline" onClick={() => setIsServiceDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={editingService ? handleUpdateService : handleCreateService}>
                          {editingService ? "Update" : "Create"}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredServices.map((service) => (
                    <Card key={service.id} className="bg-muted">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-foreground">{service.name}</h3>
                            <p className="text-xs text-muted-foreground mt-1">{service.description}</p>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setEditingService(service)
                                setServiceForm({ ...service })
                                setIsServiceDialogOpen(true)
                              }}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-destructive"
                              onClick={() => handleDeleteService(service.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t">
                          <div>
                            <p className="text-2xl font-bold text-foreground">₹{service.price}</p>
                            <p className="text-xs text-muted-foreground">{service.duration} min</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Staff Tab */}
          <TabsContent value="staff" className="space-y-6 p-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Staff Management</CardTitle>
                  <CardDescription>Manage team members</CardDescription>
                </div>
                <Dialog open={isStaffDialogOpen} onOpenChange={setIsStaffDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => {
                        setEditingStaff(null)
                        setStaffForm({ name: "", email: "", phone: "", position: "Technician", status: "Active" })
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Staff
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingStaff ? "Edit Staff" : "Add New Staff Member"}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Name</Label>
                        <Input
                          value={staffForm.name}
                          onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                          placeholder="Staff Name"
                        />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input
                          value={staffForm.email}
                          onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                          placeholder="email@example.com"
                        />
                      </div>
                      <div>
                        <Label>Phone</Label>
                        <Input
                          value={staffForm.phone}
                          onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
                          placeholder="Phone Number"
                        />
                      </div>
                      <div>
                        <Label>Position</Label>
                        <Input
                          value={staffForm.position}
                          onChange={(e) => setStaffForm({ ...staffForm, position: e.target.value })}
                          placeholder="e.g., Wash Technician"
                        />
                      </div>
                      <div>
                        <Label>Status</Label>
                        <Select
                          value={staffForm.status}
                          onValueChange={(value) => setStaffForm({ ...staffForm, status: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex gap-2 justify-end">
                        <Button variant="outline" onClick={() => setIsStaffDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={editingStaff ? handleUpdateStaff : handleCreateStaff}>
                          {editingStaff ? "Update" : "Add"}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {staff.map((s) => (
                    <Card key={s.id} className="bg-muted">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-foreground">{s.name}</h3>
                            <p className="text-xs text-muted-foreground mt-1">{s.role}</p>
                          </div>
                          <Badge variant={s.status === "active" ? "default" : "secondary"}>
                            {s.status === "active" ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <div className="space-y-2 mb-4 text-xs text-muted-foreground">
                          <p>Email: {s.email || "N/A"}</p>
                          <p>Phone: {s.phone || "N/A"}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="flex-1 bg-transparent"
                            variant="outline"
                            onClick={() => {
                              setEditingStaff(s)
                              setStaffForm({
                                name: s.name,
                                email: s.email || "",
                                phone: s.phone || "",
                                position: s.role || "Technician",
                                status: s.status === "active" ? "Active" : "Inactive",
                              })
                              setIsStaffDialogOpen(true)
                            }}
                          >
                            <Edit2 className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteStaff(s.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6 p-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Revenue Analytics</CardTitle>
                <CardDescription>Revenue trend over the past week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyRevenue}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                        }}
                        formatter={(value: number) => [`₹${value}`, "Revenue"]}
                      />
                      <Bar dataKey="revenue" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
