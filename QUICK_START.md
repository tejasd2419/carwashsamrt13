# SparkleWash App - Quick Start Guide

## Prerequisites
- Node.js installed
- MySQL running
- Backend and Frontend folders downloaded

## Step 1: Setup Database (One-time only)

1. Open MySQL Workbench or MySQL Command Line
2. Run this command to DROP and recreate the database:

\`\`\`sql
DROP DATABASE IF EXISTS sparkle_wash;
CREATE DATABASE sparkle_wash;
USE sparkle_wash;
\`\`\`

3. Then run ALL SQL from: `/backend/scripts/database-setup.sql`

**Test**: Verify tables exist:
\`\`\`sql
SHOW TABLES;
SELECT * FROM users;  -- Should show admin user
SELECT * FROM services;  -- Should show 4 services
\`\`\`

## Step 2: Install Backend Dependencies

\`\`\`bash
cd backend
npm install
\`\`\`

## Step 3: Start Backend Server

\`\`\`bash
cd backend
npm run dev
\`\`\`

**Expected Output:**
\`\`\`
Server running on http://localhost:5000
\`\`\`

**Test Backend**: Open http://localhost:5000/api/health in browser
Should show: \`{"success":true,"message":"Server is running","database":"connected"}\`

## Step 4: Install Frontend Dependencies

Open NEW terminal/command prompt:

\`\`\`bash
npm install
\`\`\`

## Step 5: Start Frontend

\`\`\`bash
npm run dev
\`\`\`

**Expected Output:**
\`\`\`
▲ Next.js 15.0.0
- Local: http://localhost:3000
\`\`\`

## Step 6: Test the App

1. Open http://localhost:3000 in browser
2. You should see the home page with 4 services

### Test Login:
- **Email**: admin@sparklewash.com
- **Password**: admin123
- Click Login
- Should redirect to dashboard

### Test Registration:
- Click "Register"
- Fill in: Name, Email, Phone, Password
- Create account
- Should auto-login and show dashboard

## Troubleshooting

### Error: "Failed to load resource: the server responded with a status of 404"
- Check: Is backend running? (npm run dev in backend folder)
- Check: Is MySQL running?
- Check: Did you run database-setup.sql?

### Error: "Failed to load resource: the server responded with a status of 401"
- This means database has no users
- Run the database-setup.sql file again to insert admin user

### Error: "Connection refused"
- Backend not running
- Start backend with: \`cd backend && npm run dev\`

### Error: "ECONNREFUSED 127.0.0.1:3306"
- MySQL not running
- Start MySQL server

## Summary of Running Servers

**Terminal 1 - Backend (Port 5000):**
\`\`\`bash
cd backend
npm run dev
\`\`\`

**Terminal 2 - Frontend (Port 3000):**
\`\`\`bash
npm run dev
\`\`\`

Both must be running for the app to work!
