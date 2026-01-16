import express from "express"
import { query } from "../db.js"
import { verifyAdmin } from "../middleware/auth.js"
import bcrypt from "bcryptjs"

const router = express.Router()

// GET all users
router.get("/users", verifyAdmin, async (req, res) => {
  try {
    const users = await query("SELECT id, name, email, phone, role, created_at FROM users ORDER BY created_at DESC")
    res.json({ success: true, data: { users } })
  } catch (error) {
    console.error("[backend] Get users error:", error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// CREATE user
router.post("/users", verifyAdmin, async (req, res) => {
  try {
    const { name, email, phone, role, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: "Missing required fields" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const result = await query("INSERT INTO users (name, email, phone, role, password) VALUES (?, ?, ?, ?, ?)", [
      name,
      email,
      phone,
      role || "customer",
      hashedPassword,
    ])

    const user = {
      id: result.insertId,
      name,
      email,
      phone,
      role: role || "customer",
      created_at: new Date().toISOString(),
    }

    res.json({ success: true, data: { user }, message: "User created successfully" })
  } catch (error) {
    console.error("[backend] Create user error:", error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// UPDATE user
router.put("/users/:id", verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const { name, email, phone, role } = req.body

    await query("UPDATE users SET name = ?, email = ?, phone = ?, role = ? WHERE id = ?", [
      name,
      email,
      phone,
      role,
      id,
    ])

    res.json({ success: true, message: "User updated successfully" })
  } catch (error) {
    console.error("[backend] Update user error:", error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// DELETE user
router.delete("/users/:id", verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params

    await query("DELETE FROM users WHERE id = ?", [id])

    res.json({ success: true, message: "User deleted successfully" })
  } catch (error) {
    console.error("[backend] Delete user error:", error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// GET all services
router.get("/services", verifyAdmin, async (req, res) => {
  try {
    const services = await query("SELECT * FROM services ORDER BY created_at DESC")
    res.json({ success: true, data: { services } })
  } catch (error) {
    console.error("[backend] Get services error:", error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// CREATE service
router.post("/services", verifyAdmin, async (req, res) => {
  try {
    const { name, description, price, duration } = req.body

    if (!name || !price) {
      return res.status(400).json({ success: false, error: "Missing required fields" })
    }

    const result = await query("INSERT INTO services (name, description, price, duration) VALUES (?, ?, ?, ?)", [
      name,
      description,
      price,
      duration || 30,
    ])

    const service = {
      id: result.insertId,
      name,
      description,
      price,
      duration: duration || 30,
    }

    res.json({ success: true, data: { service }, message: "Service created successfully" })
  } catch (error) {
    console.error("[backend] Create service error:", error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// UPDATE service
router.put("/services/:id", verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const { name, description, price, duration } = req.body

    await query("UPDATE services SET name = ?, description = ?, price = ?, duration = ? WHERE id = ?", [
      name,
      description,
      price,
      duration,
      id,
    ])

    res.json({ success: true, message: "Service updated successfully" })
  } catch (error) {
    console.error("[backend] Update service error:", error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// DELETE service
router.delete("/services/:id", verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params

    await query("DELETE FROM services WHERE id = ?", [id])

    res.json({ success: true, message: "Service deleted successfully" })
  } catch (error) {
    console.error("[backend] Delete service error:", error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// GET all staff
router.get("/staff", verifyAdmin, async (req, res) => {
  try {
    const staff = await query("SELECT * FROM staff ORDER BY created_at DESC")
    res.json({ success: true, data: { staff } })
  } catch (error) {
    console.error("[backend] Get staff error:", error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// CREATE staff
router.post("/staff", verifyAdmin, async (req, res) => {
  try {
    const { name, email, phone, position, status } = req.body

    if (!name) {
      return res.status(400).json({ success: false, error: "Name is required" })
    }

    const result = await query("INSERT INTO staff (name, email, phone, position, status) VALUES (?, ?, ?, ?, ?)", [
      name,
      email,
      phone,
      position || "Technician",
      status || "Active",
    ])

    const staffMember = {
      id: result.insertId,
      name,
      email,
      phone,
      position: position || "Technician",
      status: status || "Active",
    }

    res.json({ success: true, data: { staff: staffMember }, message: "Staff member added successfully" })
  } catch (error) {
    console.error("[backend] Create staff error:", error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// UPDATE staff
router.put("/staff/:id", verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const { name, email, phone, position, status } = req.body

    await query("UPDATE staff SET name = ?, email = ?, phone = ?, position = ?, status = ? WHERE id = ?", [
      name,
      email,
      phone,
      position,
      status,
      id,
    ])

    res.json({ success: true, message: "Staff member updated successfully" })
  } catch (error) {
    console.error("[backend] Update staff error:", error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// DELETE staff
router.delete("/staff/:id", verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params

    await query("DELETE FROM staff WHERE id = ?", [id])

    res.json({ success: true, message: "Staff member deleted successfully" })
  } catch (error) {
    console.error("[backend] Delete staff error:", error)
    res.status(500).json({ success: false, error: error.message })
  }
})

router.get("/bookings", verifyAdmin, async (req, res) => {
  try {
    const bookings = await query(`
      SELECT 
        b.id,
        b.user_id,
        b.service_id,
        b.vehicle_id,
        b.booking_date as date,
        b.booking_time as time,
        b.status,
        b.total_price as amount,
        b.notes,
        s.name as serviceName,
        s.price,
        v.vehicle_type as vehicleName,
        v.registration_number as vehicleNumber,
        u.name as customerName,
        u.email as customerEmail,
        u.phone as customerPhone
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      JOIN vehicles v ON b.vehicle_id = v.id
      JOIN users u ON b.user_id = u.id
      ORDER BY b.booking_date DESC
    `)

    console.log("[backend] Admin bookings found:", bookings.length)
    res.json({ success: true, data: { bookings } })
  } catch (error) {
    console.error("[backend] Admin bookings error:", error)
    res.status(500).json({ success: false, error: error.message })
  }
})

router.patch("/bookings/:id", verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const { status, assignedTo } = req.body

    if (status) {
      await query("UPDATE bookings SET status = ? WHERE id = ?", [status, id])
    }

    res.json({ success: true, message: "Booking updated" })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

router.put("/bookings/:id", verifyAdmin, async (req, res) => {
  try {
    const { status } = req.body
    await query("UPDATE bookings SET status = ? WHERE id = ?", [status, req.params.id])
    res.json({ success: true, message: "Booking updated" })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

router.get("/stats", verifyAdmin, async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0]

    const totalBookings = await query("SELECT COUNT(*) as count FROM bookings")
    const totalRevenue = await query(
      "SELECT COALESCE(SUM(services.price), 0) as total FROM bookings JOIN services ON bookings.service_id = services.id WHERE bookings.status = 'Completed'",
    )
    const todayBookings = await query("SELECT COUNT(*) as count FROM bookings WHERE DATE(booking_date) = ?", [today])
    const todayRevenue = await query(
      "SELECT COALESCE(SUM(services.price), 0) as total FROM bookings JOIN services ON bookings.service_id = services.id WHERE DATE(bookings.booking_date) = ? AND bookings.status = 'Completed'",
      [today],
    )
    const totalCustomers = await query("SELECT COUNT(*) as count FROM users WHERE role = 'customer'")
    const activeStaff = await query("SELECT COUNT(*) as count FROM staff WHERE status = 'Active'")

    const weeklyData = await query(`
      SELECT DATE_FORMAT(bookings.booking_date, '%a') as day, COALESCE(SUM(services.price), 0) as revenue 
      FROM bookings 
      JOIN services ON bookings.service_id = services.id 
      WHERE bookings.booking_date >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
      GROUP BY DATE(bookings.booking_date)
      ORDER BY bookings.booking_date ASC
    `)

    res.json({
      success: true,
      data: {
        stats: {
          totalBookings: totalBookings[0]?.count || 0,
          totalRevenue: totalRevenue[0]?.total || 0,
          todayBookings: todayBookings[0]?.count || 0,
          todayRevenue: todayRevenue[0]?.total || 0,
          totalCustomers: totalCustomers[0]?.count || 0,
          activeStaff: activeStaff[0]?.count || 0,
        },
        weeklyRevenue: weeklyData,
      },
    })
  } catch (error) {
    console.error("[backend] Stats error:", error)
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router
