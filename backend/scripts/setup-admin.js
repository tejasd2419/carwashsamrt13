import mysql from "mysql2/promise.js"
import bcrypt from "bcryptjs"
import dotenv from "dotenv"

dotenv.config()

async function setupAdmin() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "sparkle_wash",
    })

    console.log("[v0] Connected to database")

    // Delete existing admin user if exists
    await connection.execute("DELETE FROM users WHERE email = ?", ["admin@sparklewash.com"])
    console.log("[v0] Deleted old admin user if existed")

    // Create new password hash
    const password = "admin123"
    const hashedPassword = await bcrypt.hash(password, 10)
    console.log("[v0] Generated bcrypt hash:", hashedPassword)

    // Insert new admin user
    const [result] = await connection.execute(
      "INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)",
      ["Admin User", "admin@sparklewash.com", "9876543210", hashedPassword, "admin"],
    )

    console.log("[v0] Admin user created with ID:", result.insertId)

    // Verify password matches
    const [users] = await connection.execute("SELECT * FROM users WHERE email = ?", ["admin@sparklewash.com"])
    const admin = users[0]

    const passwordMatch = await bcrypt.compare(password, admin.password)
    console.log("[v0] Password verification:", passwordMatch ? "SUCCESS ✓" : "FAILED ✗")

    if (passwordMatch) {
      console.log("[v0] Admin user setup complete!")
      console.log("[v0] Login with: admin@sparklewash.com / admin123")
    } else {
      console.log("[v0] ERROR: Password does not match!")
    }

    await connection.end()
  } catch (error) {
    console.error("[v0] Error:", error.message)
  }
}

setupAdmin()
