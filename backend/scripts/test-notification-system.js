import nodemailer from "nodemailer"
import { query } from "../db.js"
import dotenv from "dotenv"

dotenv.config()

const TEST_EMAIL = "tejasdhamdhere2419@gmail.com"

async function testNotificationSystem() {
  console.log("\n========================================")
  console.log("   NOTIFICATION SYSTEM VERIFICATION")
  console.log("========================================\n")

  // 1. Check environment variables
  console.log("1. Checking Email Configuration...")
  console.log(`   EMAIL_SERVICE: ${process.env.EMAIL_SERVICE || "NOT SET"}`)
  console.log(`   EMAIL_USER: ${process.env.EMAIL_USER ? "✓ Configured" : "✗ NOT SET"}`)
  console.log(`   EMAIL_PASSWORD: ${process.env.EMAIL_PASSWORD ? "✓ Configured" : "✗ NOT SET"}`)
  console.log(`   EMAIL_ENABLED: ${process.env.EMAIL_ENABLED || "NOT SET (defaults to true in production)"}`)
  console.log(`   NODE_ENV: ${process.env.NODE_ENV || "development"}`)

  // 2. Test email transporter
  console.log("\n2. Testing Email Transporter...")
  try {
    let transporter
    if (process.env.EMAIL_SERVICE === "gmail") {
      transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      })
    } else {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "localhost",
        port: process.env.SMTP_PORT || 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      })
    }

    // Test email connection
    const verification = await transporter.verify()
    if (verification) {
      console.log("   ✓ Email transporter is configured and working")

      // Send test email
      console.log(`\n3. Sending Test Email to ${TEST_EMAIL}...`)
      const testResult = await transporter.sendMail({
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: TEST_EMAIL,
        subject: "SparkleWash - Notification System Test",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">SparkleWash Notification System</h2>
            <p>Hello,</p>
            <p>This is a test email from your SparkleWash notification system.</p>
            <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #1e40af;">System Status: ✓ Operational</h3>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li>Email Service: ${process.env.EMAIL_SERVICE || "SMTP"}</li>
                <li>Test Time: ${new Date().toLocaleString()}</li>
                <li>Environment: ${process.env.NODE_ENV || "development"}</li>
              </ul>
            </div>
            <p>If you received this email, your notification system is working correctly!</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="font-size: 12px; color: #6b7280;">
              This is an automated test email. Please do not reply.
            </p>
          </div>
        `,
      })
      console.log("   ✓ Test email sent successfully!")
      console.log(`   Message ID: ${testResult.messageId}`)
    } else {
      console.log("   ✗ Email transporter verification failed")
      console.log("   Please check your email configuration")
    }
  } catch (error) {
    console.log("   ✗ Email transporter error:", error.message)
    console.log("\n   REQUIRED ENVIRONMENT VARIABLES:")
    console.log("   For Gmail:")
    console.log("     - EMAIL_SERVICE=gmail")
    console.log("     - EMAIL_USER=your-email@gmail.com")
    console.log("     - EMAIL_PASSWORD=your-app-password")
    console.log("     - EMAIL_FROM=your-email@gmail.com (optional)")
    console.log("\n   For Generic SMTP:")
    console.log("     - SMTP_HOST=smtp.example.com")
    console.log("     - SMTP_PORT=587")
    console.log("     - SMTP_USER=your-username")
    console.log("     - SMTP_PASSWORD=your-password")
  }

  // 3. Check database tables
  console.log("\n4. Checking Database Tables...")
  try {
    const tables = await query("SHOW TABLES LIKE '%notification%'")
    if (tables.length > 0) {
      console.log("   ✓ Notification tables exist:")
      tables.forEach((table) => {
        console.log(`     - ${Object.values(table)[0]}`)
      })
    } else {
      console.log("   ✗ No notification tables found")
    }
  } catch (error) {
    console.log("   ✗ Database error:", error.message)
  }

  // 4. Check sample data
  console.log("\n5. Checking Sample Data...")
  try {
    const users = await query("SELECT COUNT(*) as count FROM users")
    const notifications = await query("SELECT COUNT(*) as count FROM notifications")
    console.log(`   Users in system: ${users[0].count}`)
    console.log(`   Notifications in system: ${notifications[0].count}`)
  } catch (error) {
    console.log("   Note: Database not accessible")
  }

  console.log("\n========================================")
  console.log("   NOTIFICATION SYSTEM STATUS REPORT")
  console.log("========================================\n")
  console.log("Email Configuration: Check above ↑")
  console.log(`Test Email Sent To: ${TEST_EMAIL}`)
  console.log("Database Tables: Check above ↑")
  console.log("\n========================================\n")
}

testNotificationSystem()
