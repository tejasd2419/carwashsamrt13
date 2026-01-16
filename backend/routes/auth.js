import express from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { query } from "../db.js"
import { verifyToken } from "../middleware/auth.js"

const router = express.Router()

router.post("/admin-login", async (req, res) => {
  try {
    const { email, password } = req.body

    console.log("[v0] Admin login attempt with email:", email)

    if (!email || !password) {
      return res.status(400).json({ success: false, error: "Email and password required" })
    }

    const users = await query("SELECT * FROM users WHERE email = ? AND role = ?", [email, "admin"])
    console.log("[v0] Admin user found:", users.length > 0)

    if (users.length === 0) {
      console.log("[v0] Admin user not found or user is not an admin")
      return res.status(401).json({ success: false, error: "Invalid admin credentials" })
    }

    const user = users[0]
    const passwordMatch = await bcrypt.compare(password, user.password)
    console.log("[v0] Admin password match result:", passwordMatch)

    if (!passwordMatch) {
      console.log("[v0] Admin password does not match")
      return res.status(401).json({ success: false, error: "Invalid admin credentials" })
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "your_jwt_secret_key_change_this_in_production",
      { expiresIn: "7d" },
    )

    console.log("[v0] Admin token created successfully")

    res.json({
      success: true,
      data: {
        token,
        user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role },
      },
    })
  } catch (error) {
    console.error("[v0] Admin login error:", error)
    res.status(500).json({ success: false, error: error.message })
  }
})

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    console.log("[v0] Login attempt with email:", email)

    if (!email || !password) {
      return res.status(400).json({ success: false, error: "Email and password required" })
    }

    const users = await query("SELECT * FROM users WHERE email = ?", [email])
    console.log("[v0] User found in database:", users.length > 0, "Users:", users)

    if (users.length === 0) {
      console.log("[v0] User not found in database")
      return res.status(401).json({ success: false, error: "Invalid credentials" })
    }

    const user = users[0]
    console.log("[v0] Comparing password. Password from request:", password)
    console.log("[v0] Hash from database:", user.password)

    const passwordMatch = await bcrypt.compare(password, user.password)
    console.log("[v0] Password match result:", passwordMatch)

    if (!passwordMatch) {
      console.log("[v0] Password does not match")
      return res.status(401).json({ success: false, error: "Invalid credentials" })
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "your_jwt_secret_key_change_this_in_production",
      { expiresIn: "7d" },
    )

    console.log("[v0] Token created successfully:", token)

    res.json({
      success: true,
      data: {
        token,
        user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role },
      },
    })
  } catch (error) {
    console.error("[v0] Login error:", error)
    res.status(500).json({ success: false, error: error.message })
  }
})

router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body

    console.log("[v0] Register attempt with email:", email, "password:", password)

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ success: false, error: "All fields required" })
    }

    const existingUsers = await query("SELECT id FROM users WHERE email = ?", [email])
    if (existingUsers.length > 0) {
      return res.status(400).json({ success: false, error: "Email already registered" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    console.log("[v0] Password hashed:", hashedPassword)

    const result = await query("INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)", [
      name,
      email,
      phone,
      hashedPassword,
      "customer",
    ])

    console.log("[v0] User inserted. Result:", result)
    const userId = result.insertId || result[0]?.insertId

    if (!userId) {
      console.log("[v0] ERROR: No insertId. Full result:", JSON.stringify(result))
      return res.status(500).json({ success: false, error: "Failed to create user" })
    }

    const token = jwt.sign(
      { id: userId, email, role: "customer" },
      process.env.JWT_SECRET || "your_jwt_secret_key_change_this_in_production",
      { expiresIn: "7d" },
    )

    console.log("[v0] User registered. ID:", userId, "Token created")

    res.json({ success: true, data: { token, user: { id: userId, name, email, phone, role: "customer" } } })
  } catch (error) {
    console.error("[v0] Register error:", error)
    res.status(500).json({ success: false, error: error.message })
  }
})

router.get("/me", verifyToken, async (req, res) => {
  try {
    const users = await query("SELECT * FROM users WHERE id = ?", [req.user.id])

    if (users.length === 0) {
      return res.status(404).json({ success: false, error: "User not found" })
    }

    const user = users[0]
    res.json({
      success: true,
      data: { user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role } },
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

router.post("/logout", verifyToken, (req, res) => {
  res.json({ success: true, message: "Logged out successfully" })
})

export default router
