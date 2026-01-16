import express from "express"
import { verifyToken } from "../middleware/auth.js"
import { query } from "../db.js"

const router = express.Router()

// Helper middleware: verify role is staff (assumes verifyToken populated req.user)
function requireStaff(req, res, next) {
  if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" })
  if (req.user.role !== "staff") return res.status(403).json({ success: false, message: "Forbidden: staff only" })
  next()
}

// GET /api/staff/bookings - all bookings assigned to logged-in staff
router.get("/bookings", verifyToken, requireStaff, async (req, res) => {
  try {
    const staffId = req.user.id
    const bookings = await query(
      `
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
        v.vehicle_type as vehicleName,
        u.name as customerName,
        u.email as customerEmail,
        u.phone as customerPhone
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      JOIN vehicles v ON b.vehicle_id = v.id
      JOIN users u ON b.user_id = u.id
      WHERE b.assigned_staff_id = ?
      ORDER BY b.booking_date DESC, b.booking_time DESC
      `,
      [staffId],
    )

    res.json({ success: true, data: { bookings } })
  } catch (error) {
    console.error("[backend] Staff bookings error:", error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// GET /api/staff/bookings/today - today's bookings for logged-in staff
router.get("/bookings/today", verifyToken, requireStaff, async (req, res) => {
  try {
    const staffId = req.user.id
    const bookings = await query(
      `
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
        v.vehicle_type as vehicleName,
        u.name as customerName,
        u.email as customerEmail,
        u.phone as customerPhone
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      JOIN vehicles v ON b.vehicle_id = v.id
      JOIN users u ON b.user_id = u.id
      WHERE b.assigned_staff_id = ? AND b.booking_date = CURRENT_DATE()
      ORDER BY b.booking_time ASC
      `,
      [staffId],
    )

    res.json({ success: true, data: { bookings } })
  } catch (error) {
    console.error("[backend] Staff today's bookings error:", error)
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router
