// PATCH /:id/assign endpoint - assign/unassign staff to a booking
router.patch('/:id/assign', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const { assignedTo } = req.body

    if (typeof assignedTo === 'undefined') {
      return res.status(400).json({ success: false, message: 'assignedTo is required (staff id or null)' })
    }

    if (assignedTo === null) {
      await query('UPDATE bookings SET assigned_staff_id = NULL WHERE id = ?', [id])
      return res.json({ success: true, message: 'Booking unassigned' })
    } else {
      const staffRow = await query('SELECT id FROM staff WHERE id = ?', [assignedTo])
      if (!staffRow || staffRow.length === 0) {
        return res.status(400).json({ success: false, message: 'Assigned staff not found' })
      }
      await query('UPDATE bookings SET assigned_staff_id = ? WHERE id = ?', [assignedTo, id])
      return res.json({ success: true, message: 'Booking assigned to staff' })
    }
  } catch (error) {
    console.error('[backend] Assign staff error:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router
