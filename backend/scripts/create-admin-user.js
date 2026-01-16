import bcrypt from "bcryptjs"
import mysql from "mysql2/promise.js"
import dotenv from "dotenv"

dotenv.config()

async function createAdmin() {
  const password = "admin123"
  const hashedPassword = await bcrypt.hash(password, 10)

  console.log("Admin Email: admin@sparklewash.com")
  console.log("Admin Password: admin123")
  console.log("Hashed Password:", hashedPassword)
  console.log("\n")

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "sparkle_wash",
    })

    // Delete existing admin if exists
    await connection.execute("DELETE FROM users WHERE email = ?", ["admin@sparklewash.com"])

    // Insert new admin
    const result = await connection.execute(
      "INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)",
      ["Admin User", "admin@sparklewash.com", "9876543210", hashedPassword, "admin"],
    )

    console.log("Admin user created successfully!")
    console.log("ID:", result[0].insertId)

    await connection.end()
  } catch (error) {
    console.error("Error creating admin:", error)
  }
}

createAdmin()
