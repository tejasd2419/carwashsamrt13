import staffAuthRoutes from './routes/staffAuth.js'
import staffRoutes from './routes/staff.js'

// ... after existing app.use("/api/auth", authRoutes)
app.use("/api/auth", staffAuthRoutes)
app.use("/api/staff", staffRoutes)