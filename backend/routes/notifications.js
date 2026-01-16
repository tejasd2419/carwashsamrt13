import express from "express"
import { verifyToken } from "../middleware/auth.js"
import {
  getNotificationPreferences,
  updateNotificationPreferences,
  getUserNotifications,
  markNotificationAsRead,
} from "../services/notification-service.js"

const router = express.Router()

// Get user notifications
router.get("/", verifyToken, async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query
    const notifications = await getUserNotifications(req.user.id, Number.parseInt(limit), Number.parseInt(offset))

    res.json({
      success: true,
      data: { notifications },
    })
  } catch (error) {
    console.error("[backend] Get notifications error:", error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// Mark notification as read
router.patch("/:id/read", verifyToken, async (req, res) => {
  try {
    await markNotificationAsRead(req.params.id)
    res.json({ success: true, message: "Notification marked as read" })
  } catch (error) {
    console.error("[backend] Mark as read error:", error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// Get notification preferences
router.get("/preferences", verifyToken, async (req, res) => {
  try {
    const preferences = await getNotificationPreferences(req.user.id)
    res.json({
      success: true,
      data: { preferences },
    })
  } catch (error) {
    console.error("[backend] Get preferences error:", error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// Update notification preferences
router.put("/preferences", verifyToken, async (req, res) => {
  try {
    await updateNotificationPreferences(req.user.id, req.body)
    res.json({ success: true, message: "Preferences updated" })
  } catch (error) {
    console.error("[backend] Update preferences error:", error)
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router
