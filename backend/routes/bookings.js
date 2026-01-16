import express from "express"
import { query } from "../db.js"
import { verifyToken } from "../middleware/auth.js"
import { createNotification, sendEmailNotification } from "../services/notification-service.js"

const router = express.Router()

router.get("/", verifyToken, async (req, res) => {
  try {
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
        s.name as serviceName,
        s.price,
        v.vehicle_type as vehicleName,
        v.registration_number as vehicleNumber
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      JOIN vehicles v ON b.vehicle_id = v.id
      WHERE b.user_id = ?
      ORDER BY b.booking_date DESC
    `,
      [req.user.id],
    )

    console.log("[backend] User bookings found:", bookings.length)
    res.json({ success: true, data: { bookings } })
  } catch (error) {
    console.error("[backend] Bookings error:", error)
    res.status(500).json({ success: false, error: error.message })
  }
})

router.get("/stats", verifyToken, async (req, res) => {
  try {
    const totalBookings = await query("SELECT COUNT(*) as count FROM bookings WHERE user_id = ?", [req.user.id])

    const totalRevenue = await query(
      "SELECT COALESCE(SUM(total_price), 0) as total FROM bookings WHERE user_id = ? AND status = 'completed'",
      [req.user.id],
    )

    res.json({
      success: true,
      data: {
        stats: {
          totalBookings: totalBookings[0]?.count || 0,
          totalRevenue: totalRevenue[0]?.total || 0,
        },
      },
    })
  } catch (error) {
    console.error("[backend] Stats error:", error)
    res.status(500).json({ success: false, error: error.message })
  }
})

router.post("/", verifyToken, async (req, res) => {
  try {
    const { service_id, serviceId, vehicle_id, vehicleId, booking_date, date, booking_time, time } = req.body

    console.log("[backend] Booking request received:", req.body)
    console.log("[backend] User:", req.user)

    const finalServiceId = service_id || serviceId
    const finalVehicleId = vehicle_id || vehicleId
    const finalDate = booking_date || date
    const finalTime = booking_time || time

    if (!finalServiceId || !finalVehicleId || !finalDate || !finalTime) {
      console.log("[backend] Missing fields:", { finalServiceId, finalVehicleId, finalDate, finalTime })
      return res.status(400).json({ success: false, error: "All fields required" })
    }

    const serviceData = await query("SELECT price FROM services WHERE id = ?", [finalServiceId])
    const totalPrice = serviceData[0]?.price || 0

    console.log("[backend] Inserting booking with:", {
      user_id: req.user.id,
      service_id: finalServiceId,
      vehicle_id: finalVehicleId,
      booking_date: finalDate,
      booking_time: finalTime,
      total_price: totalPrice,
    })

    const result = await query(
      "INSERT INTO bookings (user_id, service_id, vehicle_id, booking_date, booking_time, status, total_price) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [req.user.id, finalServiceId, finalVehicleId, finalDate, finalTime, "Pending", totalPrice],
    )

    console.log("[backend] Booking inserted successfully:", result)

    try {
      const bookingId = result.insertId
      const serviceData = await query("SELECT name FROM services WHERE id = ?", [finalServiceId])
      const serviceName = serviceData[0]?.name || "Your Service"

      const notificationId = await createNotification(
        req.user.id,
        bookingId,
        "booking_created",
        "Booking Created",
        `Your booking for ${serviceName} has been created successfully.`,
      )

      await sendEmailNotification(notificationId, req.user.id, bookingId, "booking_created")
    } catch (error) {
      console.log("[backend] Notification error (non-critical):", error.message)
    }

    res.json({ success: true, message: "Booking created successfully", data: { bookingId: result.insertId } })
  } catch (error) {
    console.log("[backend] Booking error:", error)
    res.status(500).json({ success: false, error: error.message })
  }
})

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await query("DELETE FROM bookings WHERE id = ? AND user_id = ?", [req.params.id, req.user.id])
    res.json({ success: true, message: "Booking cancelled" })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router
