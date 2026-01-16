# SparkleWash App - Complete Run Guide

## Prerequisites
- Node.js installed (v16 or higher)
- MySQL installed and running
- Both folders extracted: frontend and backend

---

## Step 1: Setup Database

### Option A: Using SQL File (Recommended)
1. Open MySQL Workbench
2. File → Open SQL Script
3. Select `backend/scripts/database-setup.sql`
4. Click Execute (lightning bolt icon)
5. Wait for completion

### Option B: Manual SQL Commands
1. Open MySQL Workbench
2. Run this SQL:
\`\`\`sql
DROP DATABASE IF EXISTS sparkle_wash;
CREATE DATABASE sparkle_wash;
USE sparkle_wash;
\`\`\`
3. Then paste entire content from `backend/scripts/database-setup.sql`

---

## Step 2: Start Backend (Port 5000)

Open Command Prompt/Terminal and run:

\`\`\`bash
cd backend
npm install
npm run dev
\`\`\`

You should see:
\`\`\`
[backend] Server running on http://localhost:5000
[backend] Connected to MySQL database
\`\`\`

---

## Step 3: Start Frontend (Port 3000)

Open NEW Command Prompt/Terminal and run:

\`\`\`bash
npm install
npm run dev
\`\`\`

You should see:
\`\`\`
▲ Next.js 16
- Local: http://localhost:3000
\`\`\`

---

## Step 4: Access the App

Open your browser and go to:
- **Frontend:** http://localhost:3000

---

## Step 5: Test Admin Login

### Admin Credentials:
- Email: `admin@sparklewash.com`
- Password: `admin123`

### Admin Features:
- View all user bookings
- Update booking status (Pending → Confirmed → Completed)
- View revenue statistics
- Manage staff members

---

## Step 6: Test User Features

### Create New User Account
1. Click "Register" on homepage
2. Fill in: Name, Email, Phone, Password
3. Click "Sign Up"
4. You'll be logged in automatically

### User Dashboard
After login, go to Dashboard to:
- View your profile
- Add/manage vehicles
- View booking history
- Cancel bookings if needed

### Book a Service
1. Click "Services" or "Book Now"
2. Select a service (Basic, Premium, Deluxe, Express)
3. Select date and time
4. Select or add a vehicle
5. Add notes (optional)
6. Click "Confirm Booking"

---

## Troubleshooting

### Backend won't start
- Make sure MySQL is running
- Check `.env` file has correct database credentials
- Run `npm install` in backend folder

### Frontend won't start
- Make sure backend is running on port 5000
- Run `npm install` in frontend folder
- Clear `.next` folder and try again

### Login not working
- Check MySQL has data by running:
  \`\`\`sql
  SELECT * FROM users;
  \`\`\`
- If admin user missing, run:
  \`\`\`bash
  cd backend
  node scripts/setup-admin.js
  \`\`\`

### Port already in use
- Kill process on port 5000:
  \`\`\`bash
  lsof -ti:5000 | xargs kill -9
  \`\`\`
- Kill process on port 3000:
  \`\`\`bash
  lsof -ti:3000 | xargs kill -9
  \`\`\`

---

## Project Structure

\`\`\`
sparkle-wash-app/
├── app/                 (Frontend pages)
│   ├── page.tsx        (Homepage)
│   ├── login/
│   ├── register/
│   ├── booking/
│   ├── dashboard/
│   ├── admin/
│   └── services/
├── components/          (React components)
├── lib/                 (Utilities & auth)
├── public/              (Images & assets)
├── backend/             (Node.js server)
│   ├── server.js       (Main server)
│   ├── db.js           (Database connection)
│   ├── routes/         (API endpoints)
│   │   ├── auth.js
│   │   ├── bookings.js
│   │   ├── services.js
│   │   ├── vehicles.js
│   │   └── admin.js
│   ├── middleware/     (Authentication)
│   └── scripts/        (Database scripts)
└── package.json
\`\`\`

---

## API Endpoints (Backend)

### Authentication
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get logged-in user
- `POST /api/auth/logout` - Logout

### Services
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get single service

### Bookings
- `GET /api/bookings` - Get user's bookings
- `POST /api/bookings` - Create booking
- `DELETE /api/bookings/:id` - Cancel booking

### Vehicles
- `GET /api/vehicles` - Get user's vehicles
- `POST /api/vehicles` - Add vehicle
- `DELETE /api/vehicles/:id` - Delete vehicle

### Admin
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/bookings` - All bookings
- `PUT /api/admin/bookings/:id` - Update booking status
- `GET /api/admin/staff` - Staff list

---

## Features Included

✅ User Registration & Login  
✅ JWT Authentication  
✅ Booking Management  
✅ Service Browsing  
✅ Vehicle Management  
✅ User Dashboard  
✅ Admin Dashboard  
✅ Booking Status Management  
✅ Revenue Statistics  
✅ Responsive Design  
✅ Error Handling  
✅ Database Integration  

---

## Next Steps

1. Run the project using steps above
2. Test all features
3. Download as ZIP file
4. Push to GitHub
5. Deploy to production (Vercel for frontend, Heroku/Railway for backend)

---

Good luck! 🚀
