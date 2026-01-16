export const services = [
  {
    id: "1",
    name: "Basic Wash",
    description: "Exterior wash with hand dry",
    price: 500,
    duration: 30,
    image: "/service-basic-wash-exterior.jpg",
    features: ["Exterior Wash", "Hand Dry", "Tire Shine"],
  },

  {
    id: "2",
    name: "Premium Wash",
    description: "Full interior and exterior cleaning",
    price: 1000,
    duration: 60,
    image: "/service-premium-wash-interior.jpg",
    features: ["Exterior Wash", "Interior Vacuum", "Dashboard Polish", "Window Cleaning", "Air Freshener"],
  },
  {
    id: "3",
    name: "Deluxe Detailing",
    description: "Complete detailing with wax coating",
    price: 1500,
    duration: 120,
    image: "/service-deluxe-ceramic-wax.jpg",
    features: ["Full Wash", "Clay Bar Treatment", "Wax Coating", "Leather Conditioning", "Engine Bay Clean"],
  },
  {
    id: "4",
    name: "Express Wash",
    description: "Quick exterior wash for busy schedules",
    price: 300,
    duration: 15,
    image: "/service-express-quick-wash.jpg",
    features: ["Quick Rinse", "Foam Wash", "Air Dry"],
  },
]

export const timeSlots = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
  "05:00 PM",
  "05:30 PM",
]

export const vehicleTypes = [
  { id: "sedan", name: "Sedan", priceMultiplier: 1 },
  { id: "suv", name: "SUV", priceMultiplier: 1.3 },
  { id: "hatchback", name: "Hatchback", priceMultiplier: 0.9 },
  { id: "luxury", name: "Luxury", priceMultiplier: 1.5 },
  { id: "bike", name: "Bike", priceMultiplier: 0.5 },
]

export const mockBookings = [
  {
    id: "B001",
    service: "Premium Wash",
    vehicle: "Honda City - MH12AB1234",
    date: "2026-01-05",
    time: "10:00 AM",
    status: "completed",
    amount: 599,
  },
  {
    id: "B002",
    service: "Deluxe Detailing",
    vehicle: "BMW X5 - MH14CD5678",
    date: "2026-01-08",
    time: "02:00 PM",
    status: "upcoming",
    amount: 1689,
  },
]

export const mockVehicles = [
  { id: "1", name: "Honda City", number: "MH12AB1234", type: "sedan" },
  { id: "2", name: "BMW X5", number: "MH14CD5678", type: "suv" },
]
