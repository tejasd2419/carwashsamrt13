import { getAuthToken } from "./auth-context"

const API_URL = "http://localhost:5000/api"

interface ApiOptions extends RequestInit {
  headers?: Record<string, string>
}

export async function apiCall(endpoint: string, options: ApiOptions = {}) {
  const token = getAuthToken()
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  })

  const data = await response.json()
  return data
}

export const API = {
  getServices: () => apiCall("/services"),
  getService: (id: string) => apiCall(`/services/${id}`),
  getVehicles: () => apiCall("/vehicles"),
  addVehicle: (vehicle: any) => apiCall("/vehicles", { method: "POST", body: JSON.stringify(vehicle) }),
  deleteVehicle: (id: string) => apiCall(`/vehicles/${id}`, { method: "DELETE" }),
  getBookings: () => apiCall("/bookings"),
  getBooking: (id: string) => apiCall(`/bookings/${id}`),
  createBooking: (booking: any) => apiCall("/bookings", { method: "POST", body: JSON.stringify(booking) }),
  updateBooking: (id: string, booking: any) =>
    apiCall(`/bookings/${id}`, { method: "PUT", body: JSON.stringify(booking) }),
  cancelBooking: (id: string) => apiCall(`/bookings/${id}`, { method: "DELETE" }),
  getAllBookings: () => apiCall("/admin/bookings"),
  updateBookingAdmin: (id: string, status: string) =>
    apiCall(`/admin/bookings/${id}`, { method: "PUT", body: JSON.stringify({ status }) }),
  getAdminStats: () => apiCall("/admin/stats"),
  getStaff: () => apiCall("/admin/staff"),
}
