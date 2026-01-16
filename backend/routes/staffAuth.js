import express from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { query } from "../db.js"

const router = express.Router()

// POST /api/auth/staff-login
router.post("/staff-login", async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ success: false, message: "Missing credentials" })

    const rows = await query("SELECT * FROM staff WHERE email = ?", [email])
    const staff = rows && rows.length ? rows[0] : null

    if (!staff || !staff.password) {
      return res.status(401).json({ success: false, message: "Invalid credentials" })
    }

    const match = await bcrypt.compare(password, staff.password)
    if (!match) return res.status(401).json({ success: false, message: "Invalid credentials" })

    const tokenPayload = { id: staff.id, role: "staff", name: staff.name, email: staff.email }
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET || "replace_with_env_secret", {
      expiresIn: process.env.JWT_EXPIRES_IN || "8h",
    })

    res.json({ success: true, data: { token, staff: { id: staff.id, name: staff.name, email: staff.email } } })
  } catch (error) {
    console.error("[backend] Staff login error:", error)
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router
