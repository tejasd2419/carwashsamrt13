// Notification Service - Handles all notification logic
import nodemailer from "nodemailer"
import { query } from "../db.js"

// Email transporter configuration (using Gmail or other SMTP)
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
  // Fallback to generic SMTP
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "localhost",
    port: process.env.SMTP_PORT || 587,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  })
}

// Notification templates
const emailTemplates = {
  booking_created: (booking, user) => ({
    subject: `Booking Confirmation - ${booking.serviceName}`,
    html: `
      <h2>Booking Confirmed!</h2>
      <p>Hi ${user.name},</p>
      <p>Your booking has been successfully created.</p>
      <p><strong>Booking Details:</strong></p>
      <ul>
        <li><strong>Service:</strong> ${booking.serviceName}</li>
        <li><strong>Date:</strong> ${booking.date}</li>
        <li><strong>Time:</strong> ${booking.time}</li>
        <li><strong>Vehicle:</strong> ${booking.vehicleName} (${booking.vehicleNumber})</li>
        <li><strong>Amount:</strong> ₹${booking.amount}</li>
      </ul>
      <p>Your booking is currently <strong>Pending</strong> confirmation.</p>
      <p>We will notify you once it's confirmed.</p>
    `,
  }),
  booking_confirmed: (booking, user) => ({
    subject: `Booking Confirmed - ${booking.serviceName}`,
    html: `
      <h2>Booking Confirmed!</h2>
      <p>Hi ${user.name},</p>
      <p>Great news! Your booking has been confirmed.</p>
      <p><strong>Booking Details:</strong></p>
      <ul>
        <li><strong>Service:</strong> ${booking.serviceName}</li>
        <li><strong>Date:</strong> ${booking.date}</li>
        <li><strong>Time:</strong> ${booking.time}</li>
        <li><strong>Vehicle:</strong> ${booking.vehicleName} (${booking.vehicleNumber})</li>
        <li><strong>Amount:</strong> ₹${booking.amount}</li>
      </ul>
      <p>Status: <strong style="color: green;">Confirmed</strong></p>
      <p>We'll see you soon!</p>
    `,
  }),
  booking_reminder: (booking, user) => ({
    subject: `Reminder: Your booking is tomorrow - ${booking.serviceName}`,
    html: `
      <h2>Booking Reminder</h2>
      <p>Hi ${user.name},</p>
      <p>This is a friendly reminder about your upcoming booking tomorrow.</p>
      <p><strong>Booking Details:</strong></p>
      <ul>
        <li><strong>Service:</strong> ${booking.serviceName}</li>
        <li><strong>Date:</strong> ${booking.date}</li>
        <li><strong>Time:</strong> ${booking.time}</li>
        <li><strong>Vehicle:</strong> ${booking.vehicleName} (${booking.vehicleNumber})</li>
      </ul>
      <p>Please arrive a few minutes early. If you need to reschedule, please let us know as soon as possible.</p>
    `,
  }),
  booking_completed: (booking, user) => ({
    subject: `Service Completed - ${booking.serviceName}`,
    html: `
      <h2>Service Completed!</h2>
      <p>Hi ${user.name},</p>
      <p>Your car wash service has been completed successfully.</p>
      <p><strong>Service Details:</strong></p>
      <ul>
        <li><strong>Service:</strong> ${booking.serviceName}</li>
        <li><strong>Date:</strong> ${booking.date}</li>
        <li><strong>Vehicle:</strong> ${booking.vehicleName} (${booking.vehicleNumber})</li>
        <li><strong>Amount:</strong> ₹${booking.amount}</li>
      </ul>
      <p>Thank you for choosing us! We hope you're satisfied with our service.</p>
      <p>We'd love your feedback. Please take a moment to rate us.</p>
    `,
  }),
  booking_cancelled: (booking, user) => ({
    subject: `Booking Cancelled - ${booking.serviceName}`,
    html: `
      <h2>Booking Cancelled</h2>
      <p>Hi ${user.name},</p>
      <p>Your booking has been cancelled.</p>
      <p><strong>Booking Details:</strong></p>
      <ul>
        <li><strong>Service:</strong> ${booking.serviceName}</li>
        <li><strong>Date:</strong> ${booking.date}</li>
        <li><strong>Time:</strong> ${booking.time}</li>
      </ul>
      <p>If you'd like to reschedule, you can book another appointment anytime.</p>
    `,
  }),
}

/**
 * Create a notification
 */
export async function createNotification(userId, bookingId, notificationType, title, message) {
  try {
    const result = await query(
      `INSERT INTO notifications (user_id, booking_id, type, title, message, status) 
       VALUES (?, ?, ?, ?, ?, 'pending')`,
      [userId, bookingId, notificationType, title, message],
    )
    console.log("[Notification Service] Notification created:", result.insertId)
    return result.insertId
  } catch (error) {
    console.error("[Notification Service] Error creating notification:", error.message)
    throw error
  }
}

/**
 * Send email notification
 */
export async function sendEmailNotification(notificationId, userId, bookingId, notificationType) {
  try {
    // Get user details
    const users = await query("SELECT email, name FROM users WHERE id = ?", [userId])
    if (users.length === 0) {
      throw new Error("User not found")
    }
    const user = users[0]

    // Get booking details
    const bookings = await query(
      `SELECT 
        b.id, b.booking_date as date, b.booking_time as time, b.total_price as amount,
        s.name as serviceName, v.vehicle_type as vehicleName, v.registration_number as vehicleNumber
       FROM bookings b
       JOIN services s ON b.service_id = s.id
       JOIN vehicles v ON b.vehicle_id = v.id
       WHERE b.id = ?`,
      [bookingId],
    )

    if (bookings.length === 0) {
      throw new Error("Booking not found")
    }
    const booking = bookings[0]

    // Get email template
    const template = emailTemplates[notificationType]
    if (!template) {
      throw new Error(`Email template not found for notification type: ${notificationType}`)
    }

    const { subject, html } = template(booking, user)

    // Send email
    if (process.env.EMAIL_ENABLED === "true" || process.env.NODE_ENV === "production") {
      if (transporter) {
        await transporter.sendMail({
          from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
          to: user.email,
          subject,
          html,
        })

        // Mark email as sent in notification
        await query("UPDATE notifications SET email_sent = 1, status = ? WHERE id = ?", ["sent", notificationId])

        // Log to history
        await query(
          `INSERT INTO notification_history (notification_id, channel, recipient, delivery_status) 
           VALUES (?, 'email', ?, 'sent')`,
          [notificationId, user.email],
        )

        console.log(`[Notification Service] Email sent to ${user.email} for notification ${notificationId}`)
      } else {
        console.warn("[Notification Service] Email transporter is not configured.")
      }
    } else {
      console.log(`[Notification Service] Email disabled in dev mode. Would send to: ${user.email}`, { subject, html })
    }

    return true
  } catch (error) {
    console.error("[Notification Service] Error sending email:", error.message)
    await query(
      `INSERT INTO notification_history (notification_id, channel, recipient, delivery_status, error_message) 
       VALUES (?, 'email', ?, 'failed', ?)`,
      [notificationId, userId, error.message],
    )
    throw error
  }
}

/**
 * Get notification preferences for a user
 */
export async function getNotificationPreferences(userId) {
  try {
    const prefs = await query("SELECT * FROM notification_preferences WHERE user_id = ?", [userId])
    if (prefs.length === 0) {
      // Create default preferences if not exists
      await query(
        `INSERT INTO notification_preferences (user_id, email_notifications, sms_notifications, booking_confirmation, booking_reminder, booking_updates)
         VALUES (?, 1, 0, 1, 1, 1)`,
        [userId],
      )
      return {
        userId,
        email_notifications: 1,
        sms_notifications: 0,
        booking_confirmation: 1,
        booking_reminder: 1,
        booking_updates: 1,
        reminder_hours_before: 24,
      }
    }
    return prefs[0]
  } catch (error) {
    console.error("[Notification Service] Error getting preferences:", error.message)
    throw error
  }
}

/**
 * Update notification preferences
 */
export async function updateNotificationPreferences(userId, preferences) {
  try {
    const {
      email_notifications,
      sms_notifications,
      booking_confirmation,
      booking_reminder,
      booking_updates,
      reminder_hours_before,
    } = preferences

    await query(
      `UPDATE notification_preferences SET email_notifications = ?, sms_notifications = ?, booking_confirmation = ?, booking_reminder = ?, booking_updates = ?, reminder_hours_before = ? WHERE user_id = ?`,
      [
        email_notifications ?? 1,
        sms_notifications ?? 0,
        booking_confirmation ?? 1,
        booking_reminder ?? 1,
        booking_updates ?? 1,
        reminder_hours_before ?? 24,
        userId,
      ],
    )

    console.log("[Notification Service] Preferences updated for user:", userId)
    return true
  } catch (error) {
    console.error("[Notification Service] Error updating preferences:", error.message)
    throw error
  }
}

/**
 * Get user notifications
 */
export async function getUserNotifications(userId, limit = 20, offset = 0) {
  try {
    const notifications = await query(
      `SELECT n.*, b.booking_date, s.name as serviceName
       FROM notifications n
       LEFT JOIN bookings b ON n.booking_id = b.id
       LEFT JOIN services s ON b.service_id = s.id
       WHERE n.user_id = ?
       ORDER BY n.created_at DESC
       LIMIT ? OFFSET ?`,
      [userId, limit, offset],
    )
    return notifications
  } catch (error) {
    console.error("[Notification Service] Error getting notifications:", error.message)
    throw error
  }
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(notificationId) {
  try {
    await query("UPDATE notifications SET read_at = CURRENT_TIMESTAMP WHERE id = ?", [notificationId])
    return true
  } catch (error) {
    console.error("[Notification Service] Error marking notification as read:", error.message)
    throw error
  }
}
