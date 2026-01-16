import express from "express"
import { verifyAdmin } from "../middleware/auth.js"
import { query } from "../db.js"
import { createNotification, sendEmailNotification } from "../services/notification-service.js"

const router = express.Router()

// Update booking status (with notifications)
router.patch("/:id/status", verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    if (!status) {
      return res.status(400).json({ success: false, error: "Status is required" })
    }

    // Get booking details
    const bookings = await query(
      `SELECT b.*, u.id as userId, u.email, u.name, s.name as serviceName FROM bookings b
       JOIN users u ON b.user_id = u.id
       JOIN services s ON b.service_id = s.id
       WHERE b.id = ?`,
      [id],
    )

    if (bookings.length === 0) {
      return res.status(404).json({ success: false, error: "Booking not found" })
    }

    const booking = bookings[0]
    const oldStatus = booking.status

    // Update booking status
    await query("UPDATE bookings SET status = ?, status_updated_at = CURRENT_TIMESTAMP WHERE id = ?", [status, id])

    // Log status change in history
    await query(
      `INSERT INTO booking_status_history (booking_id, old_status, new_status, updated_by) 
       VALUES (?, ?, ?, ?)`,
      [id, oldStatus, status, req.user.id],
    )

    // Determine notification type based on status
    let notificationType, title, message
    switch (status) {
      case "Confirmed":
        notificationType = "booking_confirmed"
        title = "Booking Confirmed!"
        message = `Your booking for ${booking.serviceName} on ${booking.booking_date} has been confirmed.`
        break
      case "Completed":
        notificationType = "booking_completed"
        title = "Service Completed!"
        message = `Your ${booking.serviceName} service has been completed. Thank you!`
        break
      case "Cancelled":
        notificationType = "booking_cancelled"
        title = "Booking Cancelled"
        message = `Your booking for ${booking.serviceName} has been cancelled.`
        break
      default:
        notificationType = null
    }

    // Create and send notification
    if (notificationType) {
      try {
        const notificationId = await createNotification(booking.userId, id, notificationType, title, message)
        await sendEmailNotification(notificationId, booking.userId, id, notificationType)
      } catch (error) {
        console.error("[backend] Error sending notification:", error.message)
        // Don't fail the status update if notification fails
      }
    }

    res.json({ success: true, message: "Booking status updated", data: { oldStatus, newStatus: status } })
  } catch (error) {
    console.error("[backend] Update booking status error:", error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// Get booking status history
router.get("/:id/history", verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params

    const history = await query(
      `SELECT bsh.*, u.name as updated_by_name FROM booking_status_history bsh
       LEFT JOIN users u ON bsh.updated_by = u.id
       WHERE bsh.booking_id = ?
       ORDER BY bsh.created_at DESC`,
      [id],
    )

    res.json({ success: true, data: { history } })
  } catch (error) {
    console.error("[backend] Get booking history error:", error)
    res.status(500).json({ success: false, error: error.message })
  }
})

router.get("/", verifyAdmin, async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query
    const bookings = await query(
      `SELECT 
        b.id,
        b.user_id,
        b.service_id,
        b.vehicle_id,
        b.booking_date as date,
        b.booking_time as time,
        b.status,
        b.total_price as amount,
        s.name as serviceName,
        s.price,
        v.vehicle_type as vehicleName,
        v.registration_number as vehicleNumber,
        u.name as userName,
        u.email
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      JOIN vehicles v ON b.vehicle_id = v.id
      JOIN users u ON b.user_id = u.id
      ORDER BY b.booking_date DESC
      LIMIT ? OFFSET ?`,
      [Number.parseInt(limit), Number.parseInt(offset)],
    )

    const countResult = await query("SELECT COUNT(*) as total FROM bookings")
    const total = countResult[0].total

    res.json({ success: true, data: { bookings, total } })
  } catch (error) {
    console.error("[backend] Get bookings error:", error)
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router
