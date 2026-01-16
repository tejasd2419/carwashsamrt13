import express from "express"
import { query } from "../db.js"
import bcrypt from "bcryptjs"
import { verifyToken } from "../middleware/auth.js"

const router = express.Router()

router.get("/", verifyToken, async (req, res) => {
  try {
    const result = await query("SELECT id, name, email, phone, role, created_at FROM users ORDER BY created_at DESC")
    res.json({
      success: true,
      data: { users: result },
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

router.post("/", verifyToken, async (req, res) => {
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

    res.json({ success: true, data: { user } })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

router.put("/:id", verifyToken, async (req, res) => {
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
    res.status(500).json({ success: false, error: error.message })
  }
})

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params

    await query("DELETE FROM users WHERE id = ?", [id])

    res.json({ success: true, message: "User deleted successfully" })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router
