# SparkleWash Project - Complete Testing Guide

## Prerequisites
- MySQL database running locally
- Node.js installed
- Database created: `sparkle_wash`
- Seed data inserted into MySQL

---

## BACKEND TESTING (Port 5000)

### 1. Start Backend Server
\`\`\`bash
cd backend
npm install
npm run dev
\`\`\`
Expected output: `Server running on http://localhost:5000`

### 2. Test Health Check
Open browser and go to:
\`\`\`
http://localhost:5000/api/health
\`\`\`
Expected response:
\`\`\`json
{
  "success": true,
  "message": "Server is running",
  "database": "connected"
}
\`\`\`

### 3. Backend API Tests

#### Authentication Endpoints

**Test 1: Register New User**
\`\`\`
POST http://localhost:5000/api/auth/register
Headers: Content-Type: application/json

Body:
{
  "name": "Test User",
  "email": "test@example.com",
  "phone": "9876543210",
  "password": "password123"
}

Expected: Status 201, returns user data + JWT token
\`\`\`

**Test 2: Login**
\`\`\`
POST http://localhost:5000/api/auth/login
Headers: Content-Type: application/json

Body:
{
  "email": "admin@sparklewash.com",
  "password": "admin123"
}

Expected: Status 200, returns token + user data
Save token for next requests
\`\`\`

**Test 3: Get Current User**
\`\`\`
GET http://localhost:5000/api/auth/me
Headers: Authorization: Bearer <token_from_login>

Expected: Status 200, returns logged-in user data
\`\`\`

**Test 4: Logout**
\`\`\`
POST http://localhost:5000/api/auth/logout
Headers: Authorization: Bearer <token>

Expected: Status 200, success message
\`\`\`

#### Services Endpoints

**Test 5: Get All Services**
\`\`\`
GET http://localhost:5000/api/services

Expected: Status 200, returns array of 4 services:
[
  {id: 1, name: "Basic Wash", price: 300, ...},
  {id: 2, name: "Premium Wash", price: 500, ...},
  ...
]
\`\`\`

**Test 6: Get Single Service**
\`\`\`
GET http://localhost:5000/api/services/1

Expected: Status 200, returns single service details
\`\`\`

#### Vehicles Endpoints

**Test 7: Get User Vehicles**
\`\`\`
GET http://localhost:5000/api/vehicles
Headers: Authorization: Bearer <token>

Expected: Status 200, returns user's vehicles array
\`\`\`

**Test 8: Add Vehicle**
\`\`\`
POST http://localhost:5000/api/vehicles
Headers: Authorization: Bearer <token>
Body:
{
  "vehicleType": "Sedan",
  "registrationNumber": "ABC123"
}

Expected: Status 201, vehicle created
\`\`\`

#### Bookings Endpoints

**Test 9: Get User Bookings**
\`\`\`
GET http://localhost:5000/api/bookings
Headers: Authorization: Bearer <token>

Expected: Status 200, returns user's bookings
\`\`\`

**Test 10: Create Booking**
\`\`\`
POST http://localhost:5000/api/bookings
Headers: Authorization: Bearer <token>
Body:
{
  "serviceId": 1,
  "vehicleId": 1,
  "bookingDate": "2025-01-15",
  "bookingTime": "10:00",
  "notes": "Please wash carefully"
}

Expected: Status 201, booking created
\`\`\`

#### Admin Endpoints

**Test 11: Get Admin Stats**
\`\`\`
GET http://localhost:5000/api/admin/stats
Headers: Authorization: Bearer <admin_token>

Expected: Status 200, returns {totalBookings, totalUsers, totalRevenue}
\`\`\`

**Test 12: Get All Bookings (Admin)**
\`\`\`
GET http://localhost:5000/api/admin/bookings
Headers: Authorization: Bearer <admin_token>

Expected: Status 200, returns all bookings (not just user's)
\`\`\`

**Test 13: Update Booking Status**
\`\`\`
PUT http://localhost:5000/api/admin/bookings/1
Headers: Authorization: Bearer <admin_token>
Body:
{
  "status": "Confirmed"
}

Expected: Status 200, booking status updated
\`\`\`

---

## FRONTEND TESTING (Port 3000)

### 1. Start Frontend Server
\`\`\`bash
npm run dev
\`\`\`
Expected: Frontend running on http://localhost:3000

### 2. Test Pages

#### Test 1: Home Page
- Go to http://localhost:3000
- Check: Hero section, 4 service cards visible
- Images should display properly
- Navigation menu working

#### Test 2: Services Page
- Click "Services" in navigation or "See All Services"
- Check: All 4 services displayed with images
- Service names, descriptions, prices visible

#### Test 3: Register Page
- Go to http://localhost:3000/register
- Fill form: Name, Email, Phone, Password
- Click Register
- Check: User created, auto-login, redirected to dashboard

#### Test 4: Login Page
- Go to http://localhost:3000/login
- Login with: admin@sparklewash.com / admin123
- Check: Token stored in localStorage
- Redirected to dashboard
- User name displayed in header

#### Test 5: User Dashboard
- After login, go to /dashboard
- Check sections:
  - User Profile (name, email, phone)
  - Your Bookings (if any)
  - Your Vehicles
  - Add Vehicle form

#### Test 6: Booking Page
- Click "Book Now" or go to /booking
- Step 1: Select a service
- Step 2: Select date & time
- Step 3: Select vehicle (or add new)
- Step 4: Add notes
- Click "Confirm Booking"
- Check: Booking created, confirmation shown

#### Test 7: Admin Dashboard
- Login with admin account
- Go to /admin
- Check sections:
  - Statistics (total bookings, users, revenue)
  - All Bookings table
  - Ability to update booking status
  - Staff management

---

## Complete User Flow Test

### Scenario: New User Books a Service

1. **Register**: Go to /register, create account
2. **Login**: Automatically logged in
3. **Add Vehicle**: In dashboard, add a vehicle
4. **Browse Services**: Go to /services, view all options
5. **Book Service**:
   - Click "Book Now"
   - Select service (e.g., Premium Wash - Rs 500)
   - Select date & time
   - Select vehicle
   - Add notes
   - Confirm booking
6. **View Booking**: In dashboard, see booking in "Your Bookings"
7. **Admin View**: Admin logs in and sees this booking
8. **Admin Update**: Admin changes status from "Pending" to "Confirmed"
9. **User Sees Update**: User sees booking status changed

---

## Expected Database Tables

\`\`\`sql
-- Users table
users: id, name, email, phone, password, role, created_at

-- Services table
services: id, name, description, price, image_url

-- Vehicles table
vehicles: id, user_id, vehicle_type, registration_number

-- Bookings table
bookings: id, user_id, service_id, vehicle_id, booking_date, booking_time, status, notes, total_price, created_at

-- Staff table
staff: id, name, role, status
\`\`\`

---

## Troubleshooting

### Backend Issues

**Error: "Cannot find module 'express'"**
- Solution: Run `npm install` in backend folder

**Error: "Database connection failed"**
- Solution: 
  - Check MySQL is running
  - Check .env file has correct DB credentials
  - Check database `sparkle_wash` exists

**Error: "CORS error"**
- Solution: Backend has CORS enabled, should work. Check frontend API URL is correct

### Frontend Issues

**Error: "Cannot GET /api/..."**
- Solution: Frontend is trying to call Next.js API routes (removed). Check network tab - should call http://localhost:5000/api/...

**Error: "Token invalid or expired"**
- Solution: 
  - Try logging in again
  - Check localStorage has auth_token
  - Check JWT_SECRET in backend .env

**Error: "Images not showing"**
- Solution:
  - Check images exist in /public folder
  - Check image paths in lib/data.ts match file names
  - Refresh browser cache (Ctrl+Shift+R)

---

## Success Criteria

Backend API is working if:
- Health check returns success
- Can register and login
- Can get services
- Can create bookings
- Admin endpoints return data

Frontend is working if:
- All pages load
- Can login and register
- Can book a service
- Dashboard shows bookings
- Admin panel shows all bookings

Both connected properly if:
- Frontend login works (calls backend)
- Frontend booking works (calls backend)
- Booking appears in dashboard immediately
- Admin sees all bookings
