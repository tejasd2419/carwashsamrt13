# SparkleWash - Car Washing App

## Project Architecture

This is a full-stack application with **separate frontend and backend servers**:

- **Frontend**: Next.js on port 3000
- **Backend**: Node.js Express on port 5000
- **Database**: MySQL

## Frontend Setup

Navigate to project root directory:

\`\`\`bash
npm install
npm run dev
\`\`\`

Frontend runs on: `http://localhost:3000`

The frontend calls backend API at: `http://localhost:5000/api`

## Backend Setup

Navigate to backend directory:

\`\`\`bash
cd backend
npm install
npm run dev
\`\`\`

Backend runs on: `http://localhost:5000`

## Database Setup

Make sure MySQL is running, then:

\`\`\`bash
mysql -u root -p
CREATE DATABASE sparkle_wash;
EXIT;
\`\`\`

Run SQL scripts in MySQL Workbench:
1. `scripts/01-init-database.sql` - Create tables
2. `scripts/02-seed-data.sql` - Seed initial data
3. `scripts/03-reset-users.sql` - Reset users with working credentials

## Environment Variables

### Frontend (.env.local)
\`\`\`
NEXT_PUBLIC_API_URL=http://localhost:5000/api
\`\`\`

### Backend (backend/.env)
\`\`\`
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=sparkle_wash
DB_PORT=3306
JWT_SECRET=your_secret_key
PORT=5000
\`\`\`

## Test Credentials

After seeding data:

**Admin Account:**
- Email: `admin@sparklewash.com`
- Password: `admin123`

**Customer Account:**
- Email: `rahul@example.com`
- Password: `user123`

## Frontend Features

- **Pages**: Home, Services, Booking, Dashboard, Admin, Login, Register
- **Components**: Header, Footer, ServiceCard, BookingForm, etc.
- **Auth**: JWT token stored in localStorage
- **API Integration**: All calls to `http://localhost:5000/api`

## Backend Features

- **Auth Routes**: Login, Register, Me, Logout
- **Services Routes**: Get services
- **Vehicles Routes**: Get, Add, Delete vehicles
- **Bookings Routes**: CRUD operations
- **Admin Routes**: Bookings, Stats, Staff
- **Middleware**: JWT verification, Admin role protection
- **Database**: MySQL connection pooling

## Key Files

**Frontend:**
- `lib/auth-context.tsx` - Authentication context
- `lib/api-client.ts` - API utilities
- `components/booking-form.tsx` - Booking form
- `app/dashboard/page.tsx` - User dashboard
- `app/admin/page.tsx` - Admin dashboard

**Backend:**
- `backend/server.js` - Express server
- `backend/db.js` - Database connection
- `backend/middleware/auth.js` - JWT middleware
- `backend/routes/auth.js` - Auth routes
- `backend/routes/bookings.js` - Booking routes
- `backend/routes/admin.js` - Admin routes

## Development Workflow

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `npm run dev` (in another terminal)
3. Access app: `http://localhost:3000`
4. API requests automatically include JWT token from localStorage

## Deployment

For production:
1. Update database credentials in `backend/.env`
2. Update API URL in frontend `.env.local`
3. Set JWT_SECRET to a secure random string
4. Deploy backend and frontend to separate servers/services
