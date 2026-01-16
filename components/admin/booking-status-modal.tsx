"use client"
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

export function BookingStatusModal({ booking, isOpen, onClose, onStatusChange, isUpdating }) {
  const [staffList, setStaffList] = useState([])
  const [assigned, setAssigned] = useState(null)
  const [status, setStatus] = useState(booking?.status || "")

  useEffect(() => {
    if (isOpen) {
      setStatus(booking?.status || "")
      setAssigned(booking?.assigned_staff_id ?? null)
      const token = localStorage.getItem("admin_token") || localStorage.getItem("auth_token") || ""
      fetch("http://localhost:5000/api/admin/staff", { headers: { Authorization: `Bearer ${token}` } })
        .then((r) => r.json())
        .then((d) => {
          if (d.success) setStaffList(d.data.staff || [])
        })
        .catch((e) => console.error(e))
    }
  }, [isOpen, booking])

  const save = async () => {
    const token = localStorage.getItem("admin_token") || localStorage.getItem("auth_token") || ""
    try {
      if (status && status !== booking?.status) {
        await fetch(`http://localhost:5000/api/admin/bookings/${booking.id}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ status }),
        })
      }

      await fetch(`http://localhost:5000/api/admin/bookings/${booking.id}/assign`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ assignedTo: assigned === "" ? null : assigned }),
      })

      if (onStatusChange) await onStatusChange(booking.id, status)
      onClose()
    } catch (err) {
      console.error(err)
    }
  }

  if (!booking) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Booking</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="block text-sm">Status</label>
            <Select value={status} onValueChange={(v) => setStatus(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Confirmed">Confirmed</SelectItem>
                <SelectItem value="In-Progress">In-Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm">Assign Staff</label>
            <Select value={assigned ?? ""} onValueChange={(v) => setAssigned(v === "" ? null : Number(v))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Unassigned</SelectItem>
                {staffList.map((s) => (
                  <SelectItem key={s.id} value={String(s.id)}>
                    {s.name} {s.position ? `— ${s.position}` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={save} disabled={isUpdating}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}