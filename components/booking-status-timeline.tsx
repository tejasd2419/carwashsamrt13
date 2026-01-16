"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, AlertCircle, XCircle, Calendar, Car, IndianRupee } from "lucide-react"
import type { Booking } from "@/lib/types"

interface BookingStatusTimelineProps {
  booking: Booking
}

export function BookingStatusTimeline({ booking }: BookingStatusTimelineProps) {
  // Timeline steps
  const timeline = [
    {
      id: 1,
      label: "Booking Created",
      description: "Your booking was successfully created",
      icon: CheckCircle2,
      status: true,
    },
    {
      id: 2,
      label: "Pending Confirmation",
      description: "Admin reviewing your booking",
      icon: Clock,
      status: ["Pending", "Confirmed", "In-Progress", "Completed"].includes(booking.status),
    },
    {
      id: 3,
      label: "Confirmed",
      description: "Your booking has been confirmed",
      icon: CheckCircle2,
      status: ["Confirmed", "In-Progress", "Completed"].includes(booking.status),
    },
    {
      id: 4,
      label: "In Progress",
      description: "Your car wash is in progress",
      icon: Clock,
      status: ["In-Progress", "Completed"].includes(booking.status),
    },
    {
      id: 5,
      label: "Completed",
      description: "Service completed successfully",
      icon: CheckCircle2,
      status: booking.status === "Completed",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "in-progress":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return <AlertCircle className="w-5 h-5" />
      case "confirmed":
        return <CheckCircle2 className="w-5 h-5" />
      case "in-progress":
        return <Clock className="w-5 h-5" />
      case "completed":
        return <CheckCircle2 className="w-5 h-5" />
      case "cancelled":
        return <XCircle className="w-5 h-5" />
      default:
        return <AlertCircle className="w-5 h-5" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Main Status Card */}
      <Card className="border-2">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{booking.serviceName}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Booking ID: {booking.id}</p>
            </div>
            <div className="flex items-center gap-3">
              {getStatusIcon(booking.status)}
              <Badge className={`px-4 py-2 text-base font-semibold ${getStatusColor(booking.status)}`}>
                {booking.status}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Key Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4 bg-muted/50">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <p className="text-xs font-medium text-muted-foreground">DATE & TIME</p>
              </div>
              <p className="text-lg font-semibold">{booking.date}</p>
              <p className="text-sm text-muted-foreground">{booking.time}</p>
            </div>

            <div className="border rounded-lg p-4 bg-muted/50">
              <div className="flex items-center gap-2 mb-2">
                <Car className="w-4 h-4 text-muted-foreground" />
                <p className="text-xs font-medium text-muted-foreground">VEHICLE</p>
              </div>
              <p className="text-lg font-semibold">{booking.vehicleName}</p>
              <p className="text-sm text-muted-foreground">{booking.vehicleNumber}</p>
            </div>

            <div className="border rounded-lg p-4 bg-muted/50">
              <div className="flex items-center gap-2 mb-2">
                <IndianRupee className="w-4 h-4 text-muted-foreground" />
                <p className="text-xs font-medium text-muted-foreground">AMOUNT</p>
              </div>
              <p className="text-lg font-semibold">₹{booking.amount}</p>
              <p className="text-sm text-muted-foreground">Total Price</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Booking Timeline</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-0">
            {timeline.map((step, index) => {
              const Icon = step.icon
              const isActive = step.status
              const isCancelled = booking.status === "Cancelled"

              return (
                <div key={step.id} className="relative">
                  {/* Connector line */}
                  {index !== timeline.length - 1 && (
                    <div
                      className={`absolute left-6 top-16 w-0.5 h-8 ${
                        isActive ? "bg-primary" : "bg-gray-300"
                      } transition-colors`}
                    />
                  )}

                  {/* Timeline item */}
                  <div className="flex gap-4 pb-8">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                          isActive
                            ? "bg-primary text-primary-foreground shadow-md"
                            : isCancelled && booking.status === "Cancelled" && step.id > 1
                              ? "bg-red-100 text-red-600"
                              : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 pt-1">
                      <h3
                        className={`font-semibold text-base transition-colors ${
                          isActive
                            ? "text-foreground"
                            : isCancelled && booking.status === "Cancelled" && step.id > 1
                              ? "text-red-600 line-through"
                              : "text-muted-foreground"
                        }`}
                      >
                        {step.label}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">{step.description}</p>

                      {/* Status indicators */}
                      {step.status && !isCancelled && (
                        <div className="mt-3 inline-flex items-center gap-2 text-xs font-medium text-green-600">
                          <CheckCircle2 className="w-4 h-4" />
                          Completed
                        </div>
                      )}

                      {step.id === 2 && booking.status === "Pending" && (
                        <div className="mt-3 inline-flex items-center gap-2 text-xs font-medium text-yellow-600">
                          <Clock className="w-4 h-4" />
                          In Progress
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Cancelled state */}
            {booking.status === "Cancelled" && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="font-semibold text-red-900">This booking has been cancelled</p>
                    <p className="text-sm text-red-700 mt-1">
                      You can book another appointment at any time. If you have any questions, please contact us.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Next Steps Card */}
      {booking.status === "Completed" && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-lg text-green-900 mb-2">Thank You!</h3>
            <p className="text-green-800 mb-4">
              Your car wash service has been completed. We hope you are satisfied with our service.
            </p>
            <div className="space-y-2">
              <p className="text-sm font-medium text-green-900">What's next?</p>
              <ul className="text-sm text-green-800 space-y-1 list-disc list-inside">
                <li>Check your email for service details</li>
                <li>Rate your experience to help us improve</li>
                <li>Book another appointment anytime</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {booking.status === "Pending" && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-lg text-blue-900 mb-2">Booking Pending</h3>
            <p className="text-blue-800">
              Your booking is awaiting confirmation from our team. You will receive an email notification once it's
              confirmed. Thank you for booking with us!
            </p>
          </CardContent>
        </Card>
      )}

      {booking.status === "Confirmed" && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-lg text-blue-900 mb-2">Booking Confirmed!</h3>
            <p className="text-blue-800 mb-3">
              Great news! Your booking has been confirmed. Our team is ready to serve you.
            </p>
            <div className="space-y-2">
              <p className="text-sm font-medium text-blue-900">Important reminders:</p>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>Please arrive 5 minutes before your scheduled time</li>
                <li>Our team will contact you if there are any changes</li>
                <li>Keep your vehicle keys ready</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
