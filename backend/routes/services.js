import express from "express"
import { query } from "../db.js"

const router = express.Router()

router.get("/", async (req, res) => {
  try {
    const services = await query("SELECT * FROM services")
    res.json({ success: true, data: { services } })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

router.get("/:id", async (req, res) => {
  try {
    const services = await query("SELECT * FROM services WHERE id = ?", [req.params.id])

    if (services.length === 0) {
      return res.status(404).json({ success: false, error: "Service not found" })
    }

    res.json({ success: true, data: { service: services[0] } })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router
