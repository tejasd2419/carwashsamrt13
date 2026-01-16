"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, CheckCircle, XCircle, AlertCircle, Mail, Calendar } from "lucide-react"
import type { Booking } from "@/lib/types"

interface BookingStatusModalProps {
  booking: Booking | null
  isOpen: boolean
  onClose: () => void
  onStatusChange: (bookingId: string, newStatus: string) => Promise<void>
  isUpdating: boolean
}

export function BookingStatusModal({ booking, isOpen, onClose, onStatusChange, isUpdating }: BookingStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>("")

  const statusOptions = ["Pending", "Confirmed", "In-Progress", "Completed", "Cancelled"]

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "in-progress":
        return "bg-purple-100 text-purple-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return <AlertCircle className="w-4 h-4" />
      case "confirmed":
        return <CheckCircle className="w-4 h-4" />
      case "in-progress":
        return <Clock className="w-4 h-4" />
      case "completed":
        return <CheckCircle className="w-4 h-4" />
      case "cancelled":
        return <XCircle className="w-4 h-4" />
      default:
        return null
    }
  }

  if (!booking) return null

  const handleStatusUpdate = async () => {
    if (selectedStatus && selectedStatus !== booking.status) {
      await onStatusChange(booking.id, selectedStatus)
      onClose()
      setSelectedStatus("")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Booking Details & Status Update</DialogTitle>
          <DialogDescription>Update the booking status and send notifications to customer</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Booking Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Booking Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Booking ID</p>
                  <p className="font-semibold">{booking.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Customer Name</p>
                  <p className="font-semibold">{booking.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Service</p>
                  <p className="font-semibold">{booking.serviceName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="font-semibold">₹{booking.amount}</p>
                </div>
              </div>

              <div className="border-t pt-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Date & Time</p>
                    <p className="font-semibold">
                      {booking.date} at {booking.time}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Customer Phone</p>
                    <p className="font-semibold">{booking.customerPhone}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Vehicle</p>
                  <p className="font-semibold">
                    {booking.vehicleName} - {booking.vehicleNumber}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Status */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Current Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                {getStatusIcon(booking.status)}
                <Badge className={`px-3 py-1 ${getStatusColor(booking.status)}`}>{booking.status}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Update Status */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Update Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">New Status</label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select new status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                <p className="font-semibold mb-1">Email Notification</p>
                <p>
                  Customer will automatically receive an email notification when you update the status to:{" "}
                  <strong>Confirmed, Completed, or Cancelled</strong>
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleStatusUpdate}
                  disabled={!selectedStatus || selectedStatus === booking.status || isUpdating}
                  className="flex-1"
                >
                  {isUpdating ? "Updating..." : "Update Status & Notify"}
                </Button>
                <Button onClick={onClose} variant="outline" className="flex-1 bg-transparent">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
