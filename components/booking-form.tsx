"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { timeSlots, vehicleTypes } from "@/lib/data"
import { useAuth } from "@/lib/auth-context"
import { Check, Car, Calendar, Clock, CreditCard, Plus, Loader2, AlertCircle } from "lucide-react"
import type { Service, Vehicle } from "@/lib/types"

type Step = "service" | "vehicle" | "datetime" | "confirm"

interface BookedSlot {
  time: string
  bookings: number
}

export function BookingForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const preSelectedService = searchParams.get("service")
  const { user } = useAuth()

  const [step, setStep] = useState<Step>("service")
  const [services, setServices] = useState<Service[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [selectedService, setSelectedService] = useState(preSelectedService || "")
  const [selectedVehicle, setSelectedVehicle] = useState("")
  const [selectedVehicleType, setSelectedVehicleType] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [isNewVehicle, setIsNewVehicle] = useState(false)
  const [newVehicleName, setNewVehicleName] = useState("")
  const [newVehicleNumber, setNewVehicleNumber] = useState("")
  const [bookingComplete, setBookingComplete] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)

  const API_URL = "http://localhost:5000/api"
  const MAX_BOOKINGS_PER_SLOT = 3

  // Fetch services on mount
  useEffect(() => {
    fetch(`${API_URL}/services`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setServices(data.data.services)
        }
      })
  }, [])

  // Fetch user's vehicles when logged in
  useEffect(() => {
    if (user) {
      fetch(`${API_URL}/vehicles`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("auth_token") || ""}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setVehicles(data.data.vehicles)
          }
        })
    }
  }, [user])

  useEffect(() => {
    if (selectedDate && step === "datetime") {
      setLoadingSlots(true)
      fetch(`${API_URL}/bookings/availability?date=${selectedDate}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setBookedSlots(data.data.bookedSlots || [])
          }
        })
        .catch(() => {
          setBookedSlots([])
        })
        .finally(() => setLoadingSlots(false))
    }
  }, [selectedDate, step])

  const service = services.find((s) => s.id === selectedService)
  const vehicleType = vehicleTypes.find((v) => v.id === selectedVehicleType)
  const totalPrice = service && vehicleType ? Math.round(service.price * vehicleType.priceMultiplier) : service?.price

  const isTimeSlotAvailable = (time: string) => {
    const bookedSlot = bookedSlots.find((slot) => slot.time === time)
    if (!bookedSlot) return true
    return bookedSlot.bookings < MAX_BOOKINGS_PER_SLOT
  }

  const getBookingCount = (time: string) => {
    const bookedSlot = bookedSlots.find((slot) => slot.time === time)
    return bookedSlot ? bookedSlot.bookings : 0
  }

  const steps = [
    { id: "service", label: "Service", icon: Car },
    { id: "vehicle", label: "Vehicle", icon: Car },
    { id: "datetime", label: "Date & Time", icon: Calendar },
    { id: "confirm", label: "Confirm", icon: CreditCard },
  ]

  const handleAddVehicle = async () => {
    if (!newVehicleName || !newVehicleNumber || !selectedVehicleType) {
      setError("Please fill all vehicle details")
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch(`${API_URL}/vehicles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token") || ""}`,
        },
        body: JSON.stringify({
          vehicle_type: selectedVehicleType,
          registration_number: newVehicleNumber,
        }),
      })
      const data = await res.json()

      console.log("[v0] Add vehicle response:", data)

      if (data.success) {
        setVehicles([...vehicles, data.data.vehicle])
        setSelectedVehicle(data.data.vehicle.id)
        setIsNewVehicle(false)
        setNewVehicleName("")
        setNewVehicleNumber("")
        setError("")
      } else {
        setError(data.error || "Failed to add vehicle")
      }
    } catch (err) {
      console.log("[v0] Add vehicle error:", err)
      setError("Failed to add vehicle: " + err.message)
    }
    setIsLoading(false)
  }

  const handleConfirmBooking = async () => {
    if (!user) {
      router.push("/login?redirect=/booking")
      return
    }

    if (!selectedVehicle) {
      setError("Please select a vehicle")
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError("")

    try {
      console.log("[v0] Booking submission started", {
        user_id: user.id,
        service_id: selectedService,
        vehicle_id: selectedVehicle,
        booking_date: selectedDate,
        booking_time: selectedTime,
      })

      const res = await fetch(`${API_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token") || ""}`,
        },
        body: JSON.stringify({
          service_id: selectedService,
          vehicle_id: selectedVehicle,
          booking_date: selectedDate,
          booking_time: selectedTime,
        }),
      })

      const data = await res.json()
      console.log("[v0] Booking response:", data, "Status:", res.status)

      if (data.success) {
        console.log("[v0] Booking confirmed successfully")
        setBookingComplete(true)
      } else {
        console.log("[v0] Booking failed:", data.error)
        setError(data.error || "Failed to create booking")
      }
    } catch (err) {
      console.log("[v0] Booking error:", err)
      setError("Failed to create booking: " + err.message)
    }
    setIsLoading(false)
  }

  const handleContinue = () => {
    if (step === "service" && selectedService) {
      if (!user) {
        router.push("/login?redirect=/booking")
        return
      }
      setStep("vehicle")
    } else if (step === "vehicle") {
      if (isNewVehicle) {
        if (!selectedVehicleType || !newVehicleName || !newVehicleNumber) {
          setError("Please fill in all vehicle details")
          return
        }
        handleAddVehicle().then(() => setStep("datetime"))
      } else {
        if (!selectedVehicle) {
          setError("Please select a vehicle")
          return
        }
        const vehicle = vehicles.find((v) => v.id === selectedVehicle)
        if (vehicle) setSelectedVehicleType(vehicle.type)
        setStep("datetime")
      }
    } else if (step === "datetime" && selectedDate && selectedTime) {
      setStep("confirm")
    } else if (step === "confirm") {
      handleConfirmBooking()
    }
  }

  if (bookingComplete) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Booking Confirmed!</h2>
          <p className="text-muted-foreground mb-6">
            Your appointment has been scheduled. We&apos;ve sent a confirmation to your email.
          </p>
          <div className="bg-muted rounded-lg p-4 text-left mb-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Service:</span>
                <p className="font-medium text-foreground">{service?.name}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Date:</span>
                <p className="font-medium text-foreground">{selectedDate}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Time:</span>
                <p className="font-medium text-foreground">{selectedTime}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Total:</span>
                <p className="font-medium text-primary">₹{totalPrice}</p>
              </div>
            </div>
          </div>
          <Button onClick={() => router.push("/dashboard")}>View My Bookings</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        {steps.map((s, index) => (
          <div key={s.id} className="flex items-center">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                step === s.id
                  ? "bg-primary border-primary text-primary-foreground"
                  : steps.findIndex((st) => st.id === step) > index
                    ? "bg-primary border-primary text-primary-foreground"
                    : "border-muted-foreground/30 text-muted-foreground"
              }`}
            >
              <s.icon className="h-5 w-5" />
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-12 md:w-24 h-1 mx-2 rounded ${
                  steps.findIndex((st) => st.id === step) > index ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {error && <div className="mb-4 p-3 text-sm text-destructive bg-destructive/10 rounded-lg">{error}</div>}

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {step === "service" && (
              <>
                <Car className="h-5 w-5 text-primary" /> Select Service
              </>
            )}
            {step === "vehicle" && (
              <>
                <Car className="h-5 w-5 text-primary" /> Select Vehicle
              </>
            )}
            {step === "datetime" && (
              <>
                <Calendar className="h-5 w-5 text-primary" /> Choose Date & Time
              </>
            )}
            {step === "confirm" && (
              <>
                <CreditCard className="h-5 w-5 text-primary" /> Confirm Booking
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Service Selection */}
          {step === "service" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((s) => (
                <div
                  key={s.id}
                  onClick={() => setSelectedService(s.id)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedService === s.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-foreground">{s.name}</h3>
                    <span className="text-lg font-bold text-primary">₹{s.price}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{s.description}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {s.duration} mins
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Vehicle Selection */}
          {step === "vehicle" && (
            <div className="space-y-6">
              <div>
                <Label className="text-base font-medium mb-3 block">Your Vehicles</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {vehicles.map((v) => (
                    <div
                      key={v.id}
                      onClick={() => {
                        setSelectedVehicle(v.id)
                        setSelectedVehicleType(v.type)
                        setIsNewVehicle(false)
                      }}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedVehicle === v.id && !isNewVehicle
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Car className="h-8 w-8 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-foreground">{v.name}</p>
                          <p className="text-sm text-muted-foreground">{v.number}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div
                    onClick={() => {
                      setIsNewVehicle(true)
                      setSelectedVehicle("")
                    }}
                    className={`p-4 rounded-lg border-2 border-dashed cursor-pointer transition-all flex items-center justify-center gap-2 ${
                      isNewVehicle ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Plus className="h-5 w-5" />
                    <span className="font-medium">Add New Vehicle</span>
                  </div>
                </div>
              </div>

              {isNewVehicle && (
                <div className="space-y-4 p-4 bg-muted rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="vehicleName">Vehicle Name</Label>
                      <Input
                        id="vehicleName"
                        placeholder="e.g., Honda City"
                        value={newVehicleName}
                        onChange={(e) => setNewVehicleName(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="vehicleNumber">Vehicle Number</Label>
                      <Input
                        id="vehicleNumber"
                        placeholder="e.g., MH12AB1234"
                        value={newVehicleNumber}
                        onChange={(e) => setNewVehicleNumber(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="mb-2 block">Vehicle Type</Label>
                    <div className="flex flex-wrap gap-2">
                      {vehicleTypes.map((type) => (
                        <Button
                          key={type.id}
                          type="button"
                          variant={selectedVehicleType === type.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedVehicleType(type.id)}
                        >
                          {type.name}
                          {type.priceMultiplier !== 1 && (
                            <span className="ml-1 text-xs opacity-70">
                              ({type.priceMultiplier > 1 ? "+" : ""}
                              {Math.round((type.priceMultiplier - 1) * 100)}%)
                            </span>
                          )}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Date & Time Selection */}
          {step === "datetime" && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="date" className="text-base font-medium mb-3 block">
                  Select Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="max-w-xs"
                />
              </div>

              {selectedDate && (
                <div>
                  <Label className="text-base font-medium mb-3 block">
                    Select Time Slot
                    {loadingSlots && (
                      <span className="ml-2 text-sm text-muted-foreground">(Loading availability...)</span>
                    )}
                  </Label>

                  {/* Availability Legend */}
                  <div className="mb-4 p-3 bg-muted rounded-lg text-sm flex gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-primary" />
                      <span>Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <span>Filling up</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-destructive" />
                      <span>Fully booked</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                    {timeSlots.map((time) => {
                      const available = isTimeSlotAvailable(time)
                      const bookingCount = getBookingCount(time)
                      const isNearCapacity = bookingCount >= MAX_BOOKINGS_PER_SLOT - 1 && available

                      return (
                        <div key={time} className="flex flex-col gap-1">
                          <Button
                            type="button"
                            variant={selectedTime === time ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedTime(time)}
                            disabled={!available}
                            className={`text-xs flex-1 ${
                              !available
                                ? "opacity-50 cursor-not-allowed"
                                : isNearCapacity
                                  ? "bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500"
                                  : ""
                            }`}
                          >
                            {time}
                          </Button>
                          <span className="text-xs text-muted-foreground text-center">
                            {bookingCount}/{MAX_BOOKINGS_PER_SLOT}
                          </span>
                        </div>
                      )
                    })}
                  </div>

                  {/* Full Booked Info */}
                  {bookedSlots.some((slot) => slot.bookings >= MAX_BOOKINGS_PER_SLOT) && (
                    <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg flex gap-2 text-sm">
                      <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                      <span className="text-yellow-800 dark:text-yellow-200">
                        Some time slots are fully booked. Please choose from available options.
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Confirmation */}
          {step === "confirm" && (
            <div className="space-y-6">
              <div className="bg-muted rounded-lg p-6">
                <h3 className="font-semibold text-foreground mb-4">Booking Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service</span>
                    <span className="font-medium text-foreground">{service?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Vehicle Type</span>
                    <span className="font-medium text-foreground">{vehicleType?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date</span>
                    <span className="font-medium text-foreground">{selectedDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time</span>
                    <span className="font-medium text-foreground">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium text-foreground">{service?.duration} mins</span>
                  </div>
                  <hr className="border-border" />
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold text-foreground">Total</span>
                    <span className="font-bold text-primary">₹{totalPrice}</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Payment will be collected at the service center after the wash is complete.
              </p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => {
                const stepOrder: Step[] = ["service", "vehicle", "datetime", "confirm"]
                const currentIndex = stepOrder.indexOf(step)
                if (currentIndex > 0) setStep(stepOrder[currentIndex - 1])
              }}
              disabled={step === "service"}
            >
              Back
            </Button>
            <Button
              onClick={handleContinue}
              disabled={
                isLoading ||
                (step === "service" && !selectedService) ||
                (step === "vehicle" &&
                  !selectedVehicle &&
                  !(isNewVehicle && selectedVehicleType && newVehicleName && newVehicleNumber)) ||
                (step === "datetime" && (!selectedDate || !selectedTime))
              }
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : step === "confirm" ? (
                "Confirm Booking"
              ) : (
                "Continue"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
