import mysql from "mysql2/promise.js"
import bcrypt from "bcryptjs"
import dotenv from "dotenv"

dotenv.config()

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "sparkle_wash",
})

async function fixAdminLogin() {
  const connection = await pool.getConnection()
  try {
    console.log("Starting admin login fix...")

    // Step 1: Delete existing admin user
    console.log("Step 1: Deleting old admin user...")
    await connection.execute("DELETE FROM users WHERE email = ?", ["admin@sparklewash.com"])
    console.log("Old admin user deleted")

    // Step 2: Create new password hash for "admin123"
    console.log("Step 2: Creating bcrypt hash for password 'admin123'...")
    const hashedPassword = await bcrypt.hash("admin123", 10)
    console.log("Password hashed successfully:", hashedPassword)

    // Step 3: Insert new admin user
    console.log("Step 3: Inserting new admin user...")
    const [result] = await connection.execute(
      "INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)",
      ["Admin User", "admin@sparklewash.com", "9876543210", hashedPassword, "admin"],
    )
    console.log("Admin user created with ID:", result.insertId)

    // Step 4: Verify by testing password
    console.log("Step 4: Verifying password match...")
    const [users] = await connection.execute("SELECT * FROM users WHERE email = ?", ["admin@sparklewash.com"])
    const adminUser = users[0]
    console.log("Admin user found in database")

    const passwordMatch = await bcrypt.compare("admin123", adminUser.password)
    console.log("Password verification result:", passwordMatch ? "MATCHES ✓" : "DOES NOT MATCH ✗")

    if (passwordMatch) {
      console.log("\n✓ SUCCESS! Admin login is now fixed.")
      console.log("Email: admin@sparklewash.com")
      console.log("Password: admin123")
      console.log("\nYou can now login to the admin dashboard!")
    } else {
      console.log("\n✗ ERROR: Password still does not match. There may be a bcrypt issue.")
    }

    process.exit(0)
  } catch (error) {
    console.error("Error fixing admin login:", error.message)
    process.exit(1)
  } finally {
    connection.release()
    await pool.end()
  }
}

fixAdminLogin()
