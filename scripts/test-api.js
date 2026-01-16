// Run this script with: node scripts/test-api.js
// Tests all backend API endpoints

const BASE_URL = "http://localhost:5000/api"
let adminToken = ""
let userId = ""
let vehicleId = ""
let bookingId = ""

async function test(name, method, endpoint, body = null, token = null) {
  try {
    console.log(`\n[TEST] ${name}`)
    console.log(`${method} ${endpoint}`)

    const options = {
      method,
      headers: { "Content-Type": "application/json" },
    }

    if (token) {
      options.headers.Authorization = `Bearer ${token}`
    }

    if (body) {
      options.body = JSON.stringify(body)
    }

    const res = await fetch(`${BASE_URL}${endpoint}`, options)
    const data = await res.json()

    if (data.success) {
      console.log(`✅ PASS - Status: ${res.status}`)
      console.log(`Response:`, JSON.stringify(data.data || data, null, 2))
      return data
    } else {
      console.log(`❌ FAIL - ${data.error}`)
      return null
    }
  } catch (error) {
    console.log(`❌ ERROR - ${error.message}`)
    return null
  }
}

async function runTests() {
  console.log("=".repeat(60))
  console.log("SPARKLEWASH API TESTING")
  console.log("=".repeat(60))

  // Test 1: Health Check
  console.log("\n--- HEALTH CHECK ---")
  await test("Health Check", "GET", "/health")

  // Test 2: Authentication
  console.log("\n--- AUTHENTICATION ---")
  const registerRes = await test("Register User", "POST", "/auth/register", {
    name: "Test User",
    email: `testuser${Date.now()}@example.com`,
    phone: "9876543210",
    password: "password123",
  })

  const loginRes = await test("Login", "POST", "/auth/login", {
    email: "admin@sparklewash.com",
    password: "admin123",
  })

  if (loginRes) {
    adminToken = loginRes.data.token
    userId = loginRes.data.user.id
    await test("Get Current User", "GET", "/auth/me", null, adminToken)
  }

  // Test 3: Services
  console.log("\n--- SERVICES ---")
  await test("Get All Services", "GET", "/services")
  await test("Get Service 1", "GET", "/services/1")

  // Test 4: Vehicles
  console.log("\n--- VEHICLES ---")
  const vehicleRes = await test(
    "Add Vehicle",
    "POST",
    "/vehicles",
    {
      vehicleType: "Sedan",
      registrationNumber: `TEST${Date.now()}`,
    },
    adminToken,
  )

  if (vehicleRes) {
    vehicleId = vehicleRes.data.id
  }

  await test("Get User Vehicles", "GET", "/vehicles", null, adminToken)

  // Test 5: Bookings
  console.log("\n--- BOOKINGS ---")
  const bookingRes = await test(
    "Create Booking",
    "POST",
    "/bookings",
    {
      serviceId: 1,
      vehicleId: vehicleId || 1,
      bookingDate: "2025-01-20",
      bookingTime: "10:00",
      notes: "Test booking",
    },
    adminToken,
  )

  if (bookingRes) {
    bookingId = bookingRes.data.id
  }

  await test("Get User Bookings", "GET", "/bookings", null, adminToken)

  // Test 6: Admin
  console.log("\n--- ADMIN ---")
  await test("Get Admin Stats", "GET", "/admin/stats", null, adminToken)
  await test("Get All Bookings", "GET", "/admin/bookings", null, adminToken)

  if (bookingId) {
    await test("Update Booking Status", "PUT", `/admin/bookings/${bookingId}`, { status: "Confirmed" }, adminToken)
  }

  console.log("\n" + "=".repeat(60))
  console.log("TESTING COMPLETE")
  console.log("=".repeat(60))
}

runTests()
