// Types for the car washing center app

export interface User {
  id: string
  name: string
  email: string
  phone: string
  password: string // In production, this would be hashed
  role: "customer" | "admin" | "staff"
  createdAt: string
}

export interface Vehicle {
  id: string
  userId: string
  name: string
  number: string
  type: "sedan" | "suv" | "hatchback" | "luxury" | "bike"
}

export interface Service {
  id: string
  name: string
  description: string
  price: number
  duration: number
  image: string
  features: string[]
}

export interface Booking {
  id: string
  userId: string
  customerName: string
  customerPhone: string
  serviceId: string
  serviceName: string
  vehicleId: string
  vehicleName: string
  vehicleNumber: string
  date: string
  time: string
  status: "pending" | "confirmed" | "in-progress" | "completed" | "cancelled"
  amount: number
  assignedTo: string
  createdAt: string
}

export interface Staff {
  id: string
  name: string
  role: string
  status: "active" | "break" | "off"
  todayJobs: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}
