# SparkleWash - Verification & Testing Checklist

## Pre-Startup Checklist

### Backend Setup
- [ ] MySQL database installed and running
- [ ] Database `sparkle_wash` created
- [ ] Seed data inserted (users, services, staff)
- [ ] backend/.env file configured:
  - [ ] DB_HOST=localhost
  - [ ] DB_USER=root
  - [ ] DB_PASSWORD=(your password)
  - [ ] DB_NAME=sparkle_wash
  - [ ] JWT_SECRET set to something secure
  - [ ] PORT=5000

### Frontend Setup
- [ ] Node.js version 18+ installed
- [ ] npm dependencies installed (`npm install`)
- [ ] Images exist in /public folder (4 car wash images)
- [ ] lib/auth-context.tsx has API_URL = "http://localhost:5000/api"
- [ ] lib/api-client.ts has API_URL = "http://localhost:5000/api"

---

## Startup Verification

### Start Backend
\`\`\`bash
cd backend
npm run dev
\`\`\`

Expected output:
\`\`\`
Server running on http://localhost:5000
\`\`\`

Check in browser:
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

- [ ] Backend starts without errors
- [ ] Health check endpoint responds

### Start Frontend
\`\`\`bash
npm run dev
\`\`\`

Expected output:
\`\`\`
> Local:   http://localhost:3000
\`\`\`

- [ ] Frontend starts without errors
- [ ] No "Cannot find module" errors

---

## Frontend Page Tests

### Homepage (http://localhost:3000)
- [ ] Page loads without errors
- [ ] Hero section visible
- [ ] 4 service cards displayed
- [ ] All service images visible
- [ ] Navigation menu works
- [ ] "Book Now" buttons visible

### Services Page (http://localhost:3000/services)
- [ ] All 4 services shown in grid
- [ ] Service images display
- [ ] Service prices shown (300, 500, 800, 400)
- [ ] Service descriptions visible
- [ ] "Book Now" buttons work

### Register Page (http://localhost:3000/register)
- [ ] Form loads properly
- [ ] All fields present: Name, Email, Phone, Password
- [ ] Can fill form with test data
- [ ] Register button enabled
- [ ] After successful registration:
  - [ ] User created in database
  - [ ] Token stored in localStorage
  - [ ] Redirected to dashboard
  - [ ] User name displayed in header

### Login Page (http://localhost:3000/login)
- [ ] Form loads properly
- [ ] Email and Password fields present
- [ ] Login with admin@sparklewash.com / admin123
- [ ] After successful login:
  - [ ] Token stored in localStorage
  - [ ] Redirected to dashboard
  - [ ] User info displayed in header
  - [ ] "Logout" button appears

### Dashboard Page (http://localhost:3000/dashboard)
- [ ] User profile section shows:
  - [ ] User name
  - [ ] Email
  - [ ] Phone
- [ ] Your Vehicles section shows:
  - [ ] List of user's vehicles
  - [ ] Option to add new vehicle
- [ ] Your Bookings section shows:
  - [ ] Booking list (empty initially)
  - [ ] Booking details (service, date, time, status)
- [ ] Add Vehicle form works:
  - [ ] Can select vehicle type
  - [ ] Can enter registration number
  - [ ] Can submit and add vehicle

### Booking Page (http://localhost:3000/booking)
- [ ] Page redirects if not logged in
- [ ] Multi-step form visible:
  - [ ] Step 1: Select service (4 options)
  - [ ] Step 2: Select date & time (available slots)
  - [ ] Step 3: Select vehicle or add new
  - [ ] Step 4: Add notes
- [ ] Price calculated correctly
- [ ] "Confirm Booking" button works
- [ ] After booking:
  - [ ] Confirmation shown
  - [ ] Booking appears in dashboard
  - [ ] Booking stored in database

### Admin Dashboard (http://localhost:3000/admin)
- [ ] Admin page requires admin role (redirects if not admin)
- [ ] Statistics section shows:
  - [ ] Total bookings
  - [ ] Total users
  - [ ] Total revenue
- [ ] All Bookings table shows:
  - [ ] List of all bookings from all users
  - [ ] Booking details (user, service, date, status)
  - [ ] Option to update booking status
- [ ] Staff section shows:
  - [ ] List of staff members
  - [ ] Staff status

---

## Backend API Tests

### Authentication API
\`\`\`
Test 1: Register
POST http://localhost:5000/api/auth/register
Body: {name, email, phone, password}
Expected: Status 201, user data + token
\`\`\`
- [ ] Register endpoint works
- [ ] User created in database
- [ ] Password hashed

\`\`\`
Test 2: Login
POST http://localhost:5000/api/auth/login
Body: {email, password}
Expected: Status 200, user data + token
\`\`\`
- [ ] Login endpoint works
- [ ] Correct password accepts
- [ ] Wrong password rejects
- [ ] Token generated

\`\`\`
Test 3: Get Current User
GET http://localhost:5000/api/auth/me
Header: Authorization: Bearer {token}
Expected: Status 200, user data
\`\`\`
- [ ] Get user endpoint works
- [ ] Returns logged-in user
- [ ] Works with valid token
- [ ] Rejects invalid token

\`\`\`
Test 4: Logout
POST http://localhost:5000/api/auth/logout
Header: Authorization: Bearer {token}
Expected: Status 200, success
\`\`\`
- [ ] Logout endpoint works

### Services API
\`\`\`
Test 5: Get All Services
GET http://localhost:5000/api/services
Expected: Status 200, array of 4 services
\`\`\`
- [ ] Services endpoint works
- [ ] Returns all 4 services
- [ ] Service data has: id, name, description, price, image

\`\`\`
Test 6: Get Single Service
GET http://localhost:5000/api/services/1
Expected: Status 200, single service
\`\`\`
- [ ] Single service endpoint works

### Vehicles API
\`\`\`
Test 7: Get User Vehicles
GET http://localhost:5000/api/vehicles
Header: Authorization: Bearer {token}
Expected: Status 200, user's vehicles
\`\`\`
- [ ] Get vehicles endpoint works
- [ ] Returns only user's vehicles

\`\`\`
Test 8: Add Vehicle
POST http://localhost:5000/api/vehicles
Header: Authorization: Bearer {token}
Body: {vehicleType, registrationNumber}
Expected: Status 201, vehicle created
\`\`\`
- [ ] Add vehicle endpoint works
- [ ] Vehicle stored in database
- [ ] Vehicle associated with user

### Bookings API
\`\`\`
Test 9: Get User Bookings
GET http://localhost:5000/api/bookings
Header: Authorization: Bearer {token}
Expected: Status 200, user's bookings
\`\`\`
- [ ] Get bookings endpoint works
- [ ] Returns only user's bookings

\`\`\`
Test 10: Create Booking
POST http://localhost:5000/api/bookings
Header: Authorization: Bearer {token}
Body: {serviceId, vehicleId, bookingDate, bookingTime, notes}
Expected: Status 201, booking created
\`\`\`
- [ ] Create booking endpoint works
- [ ] Booking stored in database
- [ ] Total price calculated
- [ ] Status set to "Pending"

\`\`\`
Test 11: Update Booking
PUT http://localhost:5000/api/bookings/{id}
Header: Authorization: Bearer {token}
Body: {status}
Expected: Status 200, booking updated
\`\`\`
- [ ] Update booking endpoint works

\`\`\`
Test 12: Cancel Booking
DELETE http://localhost:5000/api/bookings/{id}
Header: Authorization: Bearer {token}
Expected: Status 200, booking deleted
\`\`\`
- [ ] Delete booking endpoint works

### Admin API
\`\`\`
Test 13: Get Admin Stats
GET http://localhost:5000/api/admin/stats
Header: Authorization: Bearer {admin_token}
Expected: Status 200, {totalBookings, totalUsers, totalRevenue}
\`\`\`
- [ ] Admin stats endpoint works
- [ ] Returns correct statistics

\`\`\`
Test 14: Get All Bookings
GET http://localhost:5000/api/admin/bookings
Header: Authorization: Bearer {admin_token}
Expected: Status 200, all bookings
\`\`\`
- [ ] Admin bookings endpoint works
- [ ] Returns ALL bookings (not just user's)

\`\`\`
Test 15: Update Booking Status
PUT http://localhost:5000/api/admin/bookings/{id}
Header: Authorization: Bearer {admin_token}
Body: {status}
Expected: Status 200, status updated
\`\`\`
- [ ] Admin update endpoint works
- [ ] Status changed in database

\`\`\`
Test 16: Get Staff
GET http://localhost:5000/api/admin/staff
Header: Authorization: Bearer {admin_token}
Expected: Status 200, staff list
\`\`\`
- [ ] Admin staff endpoint works

---

## Complete User Flow Test

### Scenario: New User Books a Car Wash

1. **Register**
   - [ ] Go to /register
   - [ ] Create new account
   - [ ] Verify user created in database

2. **Add Vehicle**
   - [ ] Go to /dashboard
   - [ ] Add a vehicle
   - [ ] Verify vehicle appears in list
   - [ ] Verify vehicle in database

3. **Browse Services**
   - [ ] Go to /services
   - [ ] View all 4 services
   - [ ] Verify images and prices

4. **Create Booking**
   - [ ] Go to /booking
   - [ ] Select service (Premium Wash - Rs 500)
   - [ ] Select date and time
   - [ ] Select vehicle
   - [ ] Add notes
   - [ ] Confirm booking
   - [ ] Verify booking created in database

5. **View Booking in Dashboard**
   - [ ] Go to /dashboard
   - [ ] See booking in "Your Bookings"
   - [ ] Booking shows: service, date, time, status (Pending), price

6. **Admin Manages Booking**
   - [ ] Login as admin
   - [ ] Go to /admin
   - [ ] See booking in bookings table
   - [ ] Change status to "Confirmed"
   - [ ] Verify status updated in database

7. **User Sees Update**
   - [ ] User refreshes dashboard
   - [ ] Booking status now shows "Confirmed"

---

## Error Handling Tests

### Backend Error Tests
\`\`\`
Test 1: Invalid Login
POST /api/auth/login
Body: {email: "wrong@email.com", password: "wrong"}
Expected: Status 401, error message
\`\`\`
- [ ] Returns 401 Unauthorized
- [ ] Error message helpful

\`\`\`
Test 2: Missing Required Fields
POST /api/auth/register
Body: {name: "Test"}  // missing email, phone, password
Expected: Status 400, validation error
\`\`\`
- [ ] Returns 400 Bad Request
- [ ] Error message shows missing fields

\`\`\`
Test 3: Unauthorized API Call
GET /api/admin/stats
Header: (no token)
Expected: Status 401, error
\`\`\`
- [ ] Returns 401 Unauthorized
- [ ] Cannot access admin endpoints without token

\`\`\`
Test 4: Invalid Token
GET /api/bookings
Header: Authorization: Bearer invalid_token
Expected: Status 401, error
\`\`\`
- [ ] Returns 401 Unauthorized

### Frontend Error Tests
- [ ] Cannot access dashboard without login
- [ ] Cannot access admin page without admin role
- [ ] Form validation prevents invalid input
- [ ] Error messages displayed when API fails

---

## Database Verification

### Check Tables Exist
\`\`\`sql
SHOW TABLES;
\`\`\`
- [ ] users table
- [ ] services table
- [ ] vehicles table
- [ ] bookings table
- [ ] staff table

### Check Seed Data
\`\`\`sql
SELECT COUNT(*) FROM services;  -- Should be 4
SELECT COUNT(*) FROM staff;     -- Should have staff
SELECT COUNT(*) FROM users;     -- Should have admin user
\`\`\`
- [ ] Services table has 4 entries
- [ ] Admin user exists
- [ ] Staff members exist

---

## Performance & Security

- [ ] API responds within 1 second
- [ ] Passwords are hashed (not plain text)
- [ ] Tokens expire after 7 days
- [ ] Only admins can access admin endpoints
- [ ] Users can only see their own bookings
- [ ] CORS allows frontend domain only

---

## Final Sign-Off

All tests passed:
- [ ] Frontend loads all pages
- [ ] Backend APIs respond correctly
- [ ] Authentication works
- [ ] Bookings flow works end-to-end
- [ ] Admin panel works
- [ ] Database stores data correctly
- [ ] No console errors
- [ ] No API errors

**Status: READY FOR DEPLOYMENT** ✅
