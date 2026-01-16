import express from "express"
import { query } from "../db.js"
import { verifyToken } from "../middleware/auth.js"

const router = express.Router()

router.get("/", verifyToken, async (req, res) => {
  try {
    const vehicles = await query("SELECT * FROM vehicles WHERE user_id = ?", [req.user.id])

    const formattedVehicles = vehicles.map((vehicle) => ({
      id: vehicle.id,
      userId: vehicle.user_id,
      name: vehicle.vehicle_type, // Map vehicle_type to name
      number: vehicle.registration_number, // Map registration_number to number
      type: vehicle.vehicle_type,
    }))

    console.log("[backend] GET /vehicles - Found vehicles:", formattedVehicles.length)
    res.json({ success: true, data: { vehicles: formattedVehicles } })
  } catch (error) {
    console.log("[backend] GET /vehicles error:", error.message)
    res.status(500).json({ success: false, error: error.message })
  }
})

router.post("/", verifyToken, async (req, res) => {
  try {
    const { vehicle_type, registration_number, vehicleType, registrationNumber, name, number, type } = req.body

    const finalType = vehicle_type || vehicleType || type || name
    const finalRegNum = registration_number || registrationNumber || number

    console.log("[backend] POST /vehicles - Request body:", req.body)
    console.log("[backend] POST /vehicles - Processed fields:", { finalType, finalRegNum, userId: req.user.id })

    if (!finalType || !finalRegNum) {
      console.log("[backend] POST /vehicles - VALIDATION FAILED - Missing fields")
      return res.status(400).json({ success: false, error: "Vehicle type and registration number required" })
    }

    const result = await query("INSERT INTO vehicles (user_id, vehicle_type, registration_number) VALUES (?, ?, ?)", [
      req.user.id,
      finalType,
      finalRegNum,
    ])

    console.log("[backend] POST /vehicles - SUCCESS - Created vehicle:", result.insertId)
    res.json({
      success: true,
      message: "Vehicle added successfully",
      data: {
        vehicle: {
          id: result.insertId,
          userId: req.user.id,
          name: finalType,
          number: finalRegNum,
          type: finalType,
        },
      },
    })
  } catch (error) {
    console.log("[backend] POST /vehicles - ERROR:", error.message)
    res.status(500).json({ success: false, error: error.message })
  }
})

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await query("DELETE FROM vehicles WHERE id = ? AND user_id = ?", [req.params.id, req.user.id])
    console.log("[backend] DELETE /vehicles/:id - Vehicle deleted")
    res.json({ success: true, message: "Vehicle deleted" })
  } catch (error) {
    console.log("[backend] DELETE /vehicles error:", error.message)
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router
