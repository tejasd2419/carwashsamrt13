import mysql from "mysql2/promise.js"
import bcrypt from "bcryptjs"
import dotenv from "dotenv"

dotenv.config()

async function fixAdminPassword() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "sparkle_wash",
    })

    console.log("[v0] Connected to database")

    // Create new password hash for admin123
    const password = "admin123"
    const hashedPassword = await bcrypt.hash(password, 10)
    console.log("[v0] Generated bcrypt hash for admin123")

    // Update admin user password
    await connection.execute("UPDATE users SET password = ? WHERE email = ?", [hashedPassword, "admin@sparklewash.com"])
    console.log("[v0] Updated admin password in database")

    // Verify the password now matches
    const [users] = await connection.execute("SELECT * FROM users WHERE email = ?", ["admin@sparklewash.com"])

    if (users.length === 0) {
      console.log("[v0] ERROR: Admin user does not exist. Creating new admin user...")
      const [result] = await connection.execute(
        "INSERT INTO users (name, email, phone, password, role, created_at) VALUES (?, ?, ?, ?, ?, NOW())",
        ["Admin User", "admin@sparklewash.com", "9876543210", hashedPassword, "admin"],
      )
      console.log("[v0] Admin user created with ID:", result.insertId)
    }

    const admin = users.length > 0 ? users[0] : null
    if (admin) {
      const passwordMatch = await bcrypt.compare(password, admin.password)
      console.log("[v0] Password verification:", passwordMatch ? "✓ SUCCESS" : "✗ FAILED")

      if (passwordMatch) {
        console.log("[v0] ✓ Admin login is now fixed!")
        console.log("[v0] Email: admin@sparklewash.com")
        console.log("[v0] Password: admin123")
      }
    }

    await connection.end()
  } catch (error) {
    console.error("[v0] Error:", error.message)
  }
}

fixAdminPassword()
