# SparkleWash - Complete Car Washing Booking Application

## Overview

SparkleWash is a full-stack car washing booking application built with:
- **Frontend**: Next.js 16 + React 19 + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Node.js + Express.js
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)

---

## Quick Start

### Prerequisites
- Node.js 18+
- MySQL 8.0+
- npm or yarn

### Installation

1. **Clone/Extract Project**
\`\`\`bash
cd sparkle-wash
\`\`\`

2. **Backend Setup**
\`\`\`bash
cd backend
npm install
\`\`\`

3. **Create MySQL Database**
\`\`\`sql
CREATE DATABASE sparkle_wash;
USE sparkle_wash;

-- Tables created automatically by backend on first run
-- Or manually run schema.sql if provided
\`\`\`

4. **Configure Backend .env**
\`\`\`
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=sparkle_wash
JWT_SECRET=your_secret_key_change_in_production
PORT=5000
\`\`\`

5. **Frontend Setup**
\`\`\`bash
cd ..
npm install
\`\`\`

### Running

**Terminal 1 - Backend:**
\`\`\`bash
cd backend
npm run dev
# Backend runs on http://localhost:5000
\`\`\`

**Terminal 2 - Frontend:**
\`\`\`bash
npm run dev
# Frontend runs on http://localhost:3000
\`\`\`

---

## Features

### User Features
- ✅ User Registration & Login (JWT authentication)
- ✅ View Car Wash Services (4 options: Basic, Premium, Deluxe, Express)
- ✅ Browse all available time slots
- ✅ Add & manage vehicles
- ✅ Create bookings with custom notes
- ✅ View booking history in dashboard
- ✅ Cancel bookings
- ✅ View profile information
- ✅ Responsive design for mobile & desktop

### Admin Features
- ✅ Admin Dashboard with statistics
- ✅ View all user bookings
- ✅ Update booking status (Pending → Confirmed → Completed)
- ✅ Manage staff members
- ✅ View revenue statistics
- ✅ View total users and bookings

### Technical Features
- ✅ Secure JWT authentication
- ✅ Role-based access control (Customer, Admin, Staff)
- ✅ Password hashing with bcryptjs
- ✅ CORS enabled for frontend
- ✅ RESTful API design
- ✅ MySQL database with proper schema
- ✅ Error handling and validation
- ✅ Responsive UI with Tailwind CSS
- ✅ 70+ pre-built UI components

---

## Architecture

\`\`\`
┌─────────────────────────────────────────┐
│   Frontend (Next.js - Port 3000)        │
│   • 7 Pages                             │
│   • Authentication Context              │
│   • API Client Utilities                │
│   • Responsive UI Components            │
└──────────────────┬──────────────────────┘
                   │ (API Calls)
                   ↓ (JSON Responses)
┌──────────────────────────────────────────┐
│   Backend (Express - Port 5000)          │
│   • 5 API Route Modules                  │
│   • JWT Authentication Middleware        │
│   • Admin Role Verification              │
│   • MySQL Connection Pool                │
└──────────────────┬───────────────────────┘
                   │ (SQL Queries)
                   ↓ (Data)
┌──────────────────────────────────────────┐
│   MySQL Database                         │
│   • users, services, vehicles            │
│   • bookings, staff tables               │
└──────────────────────────────────────────┘
\`\`\`

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login with email/password
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Services
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get single service

### Vehicles
- `GET /api/vehicles` - Get user's vehicles
- `POST /api/vehicles` - Add vehicle
- `DELETE /api/vehicles/:id` - Delete vehicle

### Bookings
- `GET /api/bookings` - Get user's bookings
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Cancel booking

### Admin
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/bookings` - All bookings
- `PUT /api/admin/bookings/:id` - Update booking status
- `GET /api/admin/staff` - Staff list

---

## Pages

### User Pages
1. **Home Page** (`/`) - Hero section + services overview
2. **Services Page** (`/services`) - All services grid
3. **Login Page** (`/login`) - User authentication
4. **Register Page** (`/register`) - New account creation
5. **Dashboard Page** (`/dashboard`) - User profile, vehicles, bookings
6. **Booking Page** (`/booking`) - Multi-step booking form

### Admin Pages
7. **Admin Dashboard** (`/admin`) - Statistics, manage bookings, staff

---

## Default Credentials

\`\`\`
Admin Account:
Email: admin@sparklewash.com
Password: admin123
Role: admin

Customer Account:
Email: rahul@example.com
Password: user123
Role: customer
\`\`\`

---

## Database Schema

### users
\`\`\`sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  phone VARCHAR(15),
  password VARCHAR(255),
  role ENUM('customer', 'admin', 'staff') DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

### services
\`\`\`sql
CREATE TABLE services (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  description TEXT,
  price DECIMAL(10, 2),
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

### vehicles
\`\`\`sql
CREATE TABLE vehicles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  vehicle_type VARCHAR(50),
  registration_number VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
\`\`\`

### bookings
\`\`\`sql
CREATE TABLE bookings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  service_id INT NOT NULL,
  vehicle_id INT NOT NULL,
  booking_date DATE,
  booking_time TIME,
  status ENUM('Pending', 'Confirmed', 'Completed', 'Cancelled') DEFAULT 'Pending',
  notes TEXT,
  total_price DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (service_id) REFERENCES services(id),
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
);
\`\`\`

### staff
\`\`\`sql
CREATE TABLE staff (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  role VARCHAR(50),
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

---

## Deployment

### Frontend Deployment (Vercel)
\`\`\`bash
npm run build
# Push to GitHub
# Connect repo to Vercel
# Auto-deploys on push
\`\`\`

### Backend Deployment (Heroku/Railway)
\`\`\`bash
# Add Procfile
web: node server.js

# Deploy
git push heroku main
\`\`\`

### Database Deployment
- Use AWS RDS, Google Cloud SQL, or DigitalOcean Managed Database
- Update `.env` with production database credentials

### Environment Variables (Production)
\`\`\`
DB_HOST=production-db-host
DB_USER=production-user
DB_PASSWORD=strong-password
DB_NAME=sparkle_wash
JWT_SECRET=generate-strong-secret
PORT=5000
NODE_ENV=production
\`\`\`

---

## Testing

### Run Test Suite
\`\`\`bash
node scripts/test-api.js
\`\`\`

This tests:
- All authentication endpoints
- All service endpoints
- All booking endpoints
- Admin endpoints
- Database connection

See `TESTING.md` for detailed testing guide.

---

## Troubleshooting

### Backend Won't Start
\`\`\`
Error: Cannot find module 'express'
Solution: Run `npm install` in backend folder
\`\`\`

### Database Connection Failed
\`\`\`
Error: connect ECONNREFUSED 127.0.0.1:3306
Solution: 
- Check MySQL is running
- Check DB credentials in .env
- Check database sparkle_wash exists
\`\`\`

### CORS Error
\`\`\`
Error: Access to XMLHttpRequest blocked by CORS
Solution:
- Backend has CORS enabled
- Check frontend API URL points to http://localhost:5000
\`\`\`

### Images Not Showing
\`\`\`
Error: 404 on image request
Solution:
- Check images in /public folder
- Check image paths in lib/data.ts
- Hard refresh browser (Ctrl+Shift+R)
\`\`\`

### Token Expired
\`\`\`
Error: 401 Unauthorized
Solution:
- Login again to get new token
- Check token hasn't expired (7 days)
- Clear localStorage and refresh
\`\`\`

---

## File Structure Reference

\`\`\`
Frontend Files:
- app/page.tsx - Homepage
- app/login/page.tsx - Login
- app/register/page.tsx - Register
- app/booking/page.tsx - Booking form
- app/dashboard/page.tsx - User dashboard
- app/admin/page.tsx - Admin panel
- lib/auth-context.tsx - Authentication
- lib/api-client.ts - API utilities
- lib/data.ts - Static data

Backend Files:
- server.js - Main server
- db.js - Database connection
- routes/auth.js - Auth endpoints
- routes/services.js - Services endpoints
- routes/bookings.js - Booking endpoints
- routes/admin.js - Admin endpoints
- middleware/auth.js - JWT verification
\`\`\`

---

## Technologies Used

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Authentication**: JWT, bcryptjs
- **HTTP Client**: fetch API, CORS
- **UI Framework**: Tailwind CSS v4
- **Font**: Geist (Google Fonts)

---

## License

MIT License - Feel free to use this project

---

## Support

For issues or questions:
1. Check TESTING.md for test procedures
2. Check TROUBLESHOOTING in this file
3. Review API documentation in backend routes
4. Check database schema above

---

## Next Steps

1. Download and extract the project
2. Follow "Quick Start" section above
3. Run both frontend and backend
4. Test using TESTING.md guide
5. Deploy to production when ready

**Your SparkleWash app is ready to use!** 🚗✨
