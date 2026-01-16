export const adminStats = {
  todayBookings: 12,
  todayRevenue: 8450,
  totalCustomers: 245,
  activeStaff: 5,
}

export const recentBookings = [
  {
    id: "B101",
    customer: "Rahul Sharma",
    phone: "+91 98765 43210",
    service: "Premium Wash",
    vehicle: "Honda City - MH12AB1234",
    date: "2026-01-01",
    time: "10:00 AM",
    status: "in-progress",
    amount: 599,
    assignedTo: "Amit Kumar",
  },
  {
    id: "B102",
    customer: "Priya Patel",
    phone: "+91 87654 32109",
    service: "Deluxe Detailing",
    vehicle: "BMW X5 - MH14CD5678",
    date: "2026-01-01",
    time: "11:00 AM",
    status: "pending",
    amount: 1689,
    assignedTo: "Unassigned",
  },
  {
    id: "B103",
    customer: "Amit Singh",
    phone: "+91 76543 21098",
    service: "Basic Wash",
    vehicle: "Maruti Swift - MH15EF9012",
    date: "2026-01-01",
    time: "09:30 AM",
    status: "completed",
    amount: 299,
    assignedTo: "Ravi Verma",
  },
  {
    id: "B104",
    customer: "Neha Gupta",
    phone: "+91 65432 10987",
    service: "Express Wash",
    vehicle: "Hyundai i20 - MH16GH3456",
    date: "2026-01-01",
    time: "02:00 PM",
    status: "pending",
    amount: 149,
    assignedTo: "Unassigned",
  },
]

export const staffMembers = [
  { id: "S1", name: "Amit Kumar", role: "Senior Washer", status: "active", todayJobs: 3 },
  { id: "S2", name: "Ravi Verma", role: "Washer", status: "active", todayJobs: 2 },
  { id: "S3", name: "Suresh Yadav", role: "Detailer", status: "active", todayJobs: 1 },
  { id: "S4", name: "Vijay Patil", role: "Washer", status: "break", todayJobs: 2 },
  { id: "S5", name: "Manoj Singh", role: "Senior Detailer", status: "active", todayJobs: 2 },
]

export const weeklyRevenue = [
  { day: "Mon", revenue: 4500 },
  { day: "Tue", revenue: 5200 },
  { day: "Wed", revenue: 3800 },
  { day: "Thu", revenue: 6100 },
  { day: "Fri", revenue: 7200 },
  { day: "Sat", revenue: 9500 },
  { day: "Sun", revenue: 4200 },
]
