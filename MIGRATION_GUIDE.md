# Copperway Car Wash - Modern Tech Stack Migration

## 🚀 New Tech Stack

- **Frontend**: Next.js 14 + React 18 + TypeScript
- **Backend**: Node.js + Express + TypeScript (API Routes)
- **Database**: PostgreSQL + Prisma ORM
- **Styling**: Tailwind CSS
- **Authentication**: JWT Tokens
- **Deployment**: Vercel/Render + PostgreSQL

## 📁 Project Structure

```
copperway-car-wash/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # API Routes
│   │   │   ├── services/       # Services API
│   │   │   ├── slots/          # Time slots API
│   │   │   ├── bookings/       # Bookings API
│   │   │   └── admin/          # Admin APIs
│   │   ├── admin/              # Admin pages
│   │   ├── booking/            # Booking page
│   │   ├── status/             # Status page
│   │   └── page.tsx            # Home page
│   ├── lib/                    # Utilities
│   │   ├── prisma.ts          # Database client
│   │   ├── auth.ts            # Authentication
│   │   └── utils.ts           # Helper functions
│   └── types/                 # TypeScript types
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Database seeding
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup

#### Option A: Local PostgreSQL
```bash
# Install PostgreSQL locally
# Create database
createdb copperway_carwash

# Set environment variables
cp env.example .env.local
# Edit .env.local with your database URL
```

#### Option B: Cloud Database (Recommended)
- Use services like Supabase, PlanetScale, or Neon
- Get connection string and add to `.env.local`

### 3. Database Migration

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed database with initial data
npm run db:seed
```

### 4. Development

```bash
# Start development server
npm run dev
```

Visit `http://localhost:3000`

## 🔧 Environment Variables

Create `.env.local` file:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/copperway_carwash"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key"

# File Upload
UPLOAD_DIR="./uploads/payment_screenshots"
MAX_FILE_SIZE=5242880

# App Settings
NEXT_PUBLIC_APP_NAME="Copperway Car Wash"
NEXT_PUBLIC_TIMEZONE="Africa/Lusaka"

# Google Maps (Optional)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-api-key"
```

## 📱 Features Implemented

### ✅ Customer Features
- **Service Selection**: Browse available car wash services
- **Online Booking**: Multi-step booking form with validation
- **Time Slot Selection**: Real-time availability checking
- **Pickup Service**: Optional pickup and drop-off service
- **Status Tracking**: Real-time booking status updates
- **Payment Integration**: Offline payment methods support
- **Navigation**: Google Maps integration for directions

### ✅ Admin Features
- **Authentication**: JWT-based admin login
- **Payment Verification**: Verify customer payments manually
- **Queue Management**: View and manage service queue
- **Status Updates**: Update booking statuses
- **Dashboard**: Comprehensive admin dashboard
- **Booking History**: Track all bookings and records

## 🔐 Authentication

### Admin Login
- **URL**: `/admin/login`
- **Default Credentials**:
  - Username: `admin`
  - Password: `admin123`

⚠️ **Change default password immediately!**

## 🗄️ Database Schema

### Tables
- **services**: Available car wash services
- **bookings**: Customer bookings with all details
- **admin_users**: Admin user accounts
- **queue_history**: Status change tracking
- **business_hours**: Operating hours configuration
- **location_settings**: Car wash location details

### Booking Status Flow
1. `PENDING_PAYMENT` - Booking created, awaiting payment
2. `PAYMENT_VERIFIED` - Payment confirmed by admin
3. `CONFIRMED` - Booking confirmed and added to queue
4. `IN_QUEUE` - Waiting for service
5. `IN_PROGRESS` - Currently being serviced
6. `COMPLETED` - Service finished
7. `CANCELLED` - Booking cancelled

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel
   ```

2. **Environment Variables**
   - Add all environment variables in Vercel dashboard
   - Ensure `DATABASE_URL` points to production database

3. **Database Setup**
   ```bash
   # Run migrations
   npx prisma migrate deploy
   
   # Seed production database
   npx prisma db seed
   ```

### Render Deployment

1. **Create Services**
   - Web Service (Next.js)
   - PostgreSQL Database

2. **Environment Variables**
   - Add all required environment variables
   - Use Render's PostgreSQL connection string

3. **Build Commands**
   ```bash
   npm install
   npm run build
   ```

## 🔄 Migration from PHP/MySQL

### What Changed
- **Frontend**: HTML → Next.js React components
- **Backend**: PHP → Node.js API routes
- **Database**: MySQL → PostgreSQL with Prisma
- **Styling**: Custom CSS → Tailwind CSS
- **Authentication**: Sessions → JWT tokens

### Data Migration
1. Export data from MySQL database
2. Transform data to match new schema
3. Import into PostgreSQL using Prisma

## 🧪 Testing

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build test
npm run build
```

## 📞 Support

For issues or questions:
- Email: contact@copperwaywash.com
- Phone: +260 123 456789

## 📄 License

© 2025 Copperway Car Wash. All rights reserved.
