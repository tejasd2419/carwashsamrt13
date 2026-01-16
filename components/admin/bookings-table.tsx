"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookingStatusModal } from "./booking-status-modal"
import { Calendar, Search, Edit2 } from "lucide-react"
import type { Booking } from "@/lib/types"

interface BookingsTableProps {
  bookings: Booking[]
  onStatusChange: (bookingId: string, newStatus: string) => Promise<void>
  isLoading?: boolean
}

export function BookingsTable({ bookings, onStatusChange, isLoading }: BookingsTableProps) {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isUpdating, setIsUpdating] = useState(false)

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.serviceName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.vehicleNumber?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filterStatus === "all" || booking.status?.toLowerCase() === filterStatus.toLowerCase()

    return matchesSearch && matchesFilter
  })

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

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    setIsUpdating(true)
    try {
      await onStatusChange(bookingId, newStatus)
      setIsModalOpen(false)
      setSelectedBooking(null)
    } finally {
      setIsUpdating(false)
    }
  }

  const openBookingModal = (booking: Booking) => {
    setSelectedBooking(booking)
    setIsModalOpen(true)
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Bookings Management</CardTitle>
            <span className="text-sm text-gray-500">{filteredBookings.length} bookings</span>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex gap-3 flex-col sm:flex-row">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by customer, service, vehicle..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="in-progress">In-Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="font-semibold">Customer</TableHead>
                  <TableHead className="font-semibold">Service</TableHead>
                  <TableHead className="font-semibold">Date & Time</TableHead>
                  <TableHead className="font-semibold">Vehicle</TableHead>
                  <TableHead className="font-semibold">Amount</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      {isLoading ? "Loading bookings..." : "No bookings found"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBookings.map((booking) => (
                    <TableRow key={booking.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="font-medium">{booking.customerName}</TableCell>
                      <TableCell>{booking.serviceName}</TableCell>
                      <TableCell className="text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {booking.date} {booking.time}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{booking.vehicleNumber}</TableCell>
                      <TableCell className="font-semibold">₹{booking.amount}</TableCell>
                      <TableCell>
                        <Badge className={`px-2.5 py-1 text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" onClick={() => openBookingModal(booking)} className="gap-1">
                          <Edit2 className="w-4 h-4" />
                          Update
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <BookingStatusModal
        booking={selectedBooking}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedBooking(null)
        }}
        onStatusChange={handleStatusChange}
        isUpdating={isUpdating}
      />
    </>
  )
}
