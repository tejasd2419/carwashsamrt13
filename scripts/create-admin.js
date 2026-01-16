import mysql from "mysql2/promise.js"
import bcrypt from "bcryptjs"
import dotenv from "dotenv"

dotenv.config({ path: "../backend/.env" })

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "sparkle_wash",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

async function createAdmin() {
  const connection = await pool.getConnection()
  try {
    const adminEmail = "admin@sparklewash.com"
    const adminPassword = "admin123"
    const hashedPassword = await bcrypt.hash(adminPassword, 10)

    // Check if admin already exists
    const [existingAdmin] = await connection.execute("SELECT * FROM users WHERE email = ?", [adminEmail])

    if (existingAdmin.length > 0) {
      console.log("Admin user already exists!")
      process.exit(0)
    }

    // Create admin user
    await connection.execute("INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)", [
      "Admin",
      adminEmail,
      "9999999999",
      hashedPassword,
      "admin",
    ])

    console.log("✅ Admin user created successfully!")
    console.log("Email: admin@sparklewash.com")
    console.log("Password: admin123")
    console.log("\nNow you can login to the admin dashboard!")

    process.exit(0)
  } catch (error) {
    console.error("❌ Error creating admin:", error.message)
    process.exit(1)
  } finally {
    await connection.release()
  }
}

createAdmin()
