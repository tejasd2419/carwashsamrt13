import bcrypt from "bcryptjs"
import mysql from "mysql2/promise.js"

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "sparkle_wash",
})

async function testPassword() {
  try {
    const connection = await pool.getConnection()
    const [users] = await connection.execute("SELECT * FROM users WHERE email = 'admin@sparklewash.com'")
    connection.release()

    if (users.length === 0) {
      console.log("Admin user NOT found in database!")
      console.log("Creating admin user now...")

      const newConnection = await pool.getConnection()
      const hashedPassword = await bcrypt.hash("admin123", 10)
      console.log("Generated hash for 'admin123':", hashedPassword)

      await newConnection.execute("DELETE FROM users WHERE email = 'admin@sparklewash.com'")
      await newConnection.execute("INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)", [
        "Admin",
        "admin@sparklewash.com",
        "9999999999",
        hashedPassword,
        "admin",
      ])
      newConnection.release()

      console.log("✅ Admin user created successfully with password: admin123")
      console.log("Hash stored in database:", hashedPassword)
    } else {
      const user = users[0]
      console.log("Admin user found:", user.email, "Role:", user.role)
      console.log("Password hash in database:", user.password)

      // Test if password matches
      const testPassword = "admin123"
      const match = await bcrypt.compare(testPassword, user.password)
      console.log("Testing password 'admin123' against hash:", match ? "✅ MATCH" : "❌ NO MATCH")

      if (!match) {
        console.log("\n⚠️  Password hash is corrupted. Regenerating...")
        const newHash = await bcrypt.hash("admin123", 10)
        const updateConnection = await pool.getConnection()
        await updateConnection.execute("UPDATE users SET password = ? WHERE email = 'admin@sparklewash.com'", [newHash])
        updateConnection.release()
        console.log("✅ Password hash updated successfully")
        console.log("New hash:", newHash)
      }
    }

    process.exit(0)
  } catch (error) {
    console.error("Error:", error.message)
    process.exit(1)
  }
}

testPassword()
