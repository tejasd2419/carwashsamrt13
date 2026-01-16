import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { query } from "./db.js"
import authRoutes from "./routes/auth.js"
import servicesRoutes from "./routes/services.js"
import vehiclesRoutes from "./routes/vehicles.js"
import bookingsRoutes from "./routes/bookings.js"
import adminRoutes from "./routes/admin.js"
import notificationsRoutes from "./routes/notifications.js"
import adminBookingsRoutes from "./routes/admin-bookings.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
  console.log(`[backend] ${req.method} ${req.path}`)
  next()
})

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/services", servicesRoutes)
app.use("/api/vehicles", vehiclesRoutes)
app.use("/api/bookings", bookingsRoutes)
app.use("/api/notifications", notificationsRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/admin/bookings", adminBookingsRoutes)

// Health check
app.get("/api/health", async (req, res) => {
  try {
    const result = await query("SELECT 1")
    console.log("[backend] Health check passed - database connected")
    res.json({ success: true, message: "Server is running", database: "connected" })
  } catch (error) {
    console.log("[backend] Health check failed - database error:", error.message)
    res.status(500).json({ success: false, error: "Database connection failed" })
  }
})

app.listen(PORT, () => {
  console.log(`[backend] Server running on http://localhost:${PORT}`)
})
