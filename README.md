# Copperway Car Wash - Modern Booking System

A comprehensive car wash booking and management system built with modern technologies.

## 🚀 Tech Stack

- **Frontend**: Next.js 14 + React 18 + TypeScript
- **Backend**: Node.js + Express + TypeScript (API Routes)
- **Database**: PostgreSQL + Prisma ORM
- **Styling**: Tailwind CSS
- **Authentication**: JWT Tokens
- **Deployment**: Vercel/Render + PostgreSQL

## ✨ Features

### Customer Features
- **Service Selection**: Choose from multiple car wash packages
- **Online Booking**: Multi-step booking form with real-time validation
- **Time Slot Selection**: Dynamic availability checking
- **Pickup Service**: Optional pickup and drop-off service
- **Status Tracking**: Real-time booking status updates
- **Payment Integration**: Support for offline payment methods
- **Navigation**: Google Maps integration for directions

### Admin Features
- **Secure Authentication**: JWT-based admin login system
- **Payment Verification**: Manual payment verification dashboard
- **Queue Management**: Real-time queue management system
- **Status Updates**: Update booking statuses with notes
- **Comprehensive Dashboard**: Multi-tab admin interface
- **Booking History**: Complete booking records and analytics

## 🛠️ Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd copperway-car-wash
   npm install
   ```

2. **Environment Setup**
   Copy `.env.local` to `.env` and configure:
   ```bash
   cp env.local .env
   ```

   Update `DATABASE_URL` with your Supabase or PostgreSQL connection string:
   ```
   DATABASE_URL="postgresql://..."
   ```

3. **Database Setup**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your database URL and other settings
   ```

3. **Database Setup**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # Seed with initial data
   npm run db:seed
   ```

4. **Start Development**
   ```bash
   npm run dev
   ```

Visit `http://localhost:3000`

## 🔧 Configuration

### Environment Variables

Create `.env.local` file:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/copperway_carwash"

# JWT Secret (generate a secure random string)
JWT_SECRET="your-super-secret-jwt-key"

# File Upload Settings
UPLOAD_DIR="./uploads/payment_screenshots"
MAX_FILE_SIZE=5242880

# Application Settings
NEXT_PUBLIC_APP_NAME="Copperway Car Wash"
NEXT_PUBLIC_TIMEZONE="Africa/Lusaka"

# Google Maps API (optional)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
```

### Default Admin Credentials
- **Username**: `admin`
- **Password**: `admin123`

⚠️ **Change these credentials immediately after setup!**

## 📱 Usage

### Customer Booking Flow

1. **Visit Homepage**: Browse services and pricing
2. **Book Service**: Click "Book Now" to start booking process
3. **Select Service**: Choose from available car wash packages
4. **Choose Time**: Select date and available time slot
5. **Vehicle Details**: Enter vehicle information and pickup preferences
6. **Contact Info**: Provide contact details
7. **Payment**: Complete booking and follow payment instructions
8. **Track Status**: Use booking number to check status

### Admin Management

1. **Login**: Access admin dashboard at `/admin/login`
2. **Pending Payments**: Verify customer payments
3. **Queue Management**: Manage service queue and update statuses
4. **Booking History**: View all bookings and customer records

## 🗄️ Database Schema

### Core Tables

- **services**: Available car wash services with pricing
- **bookings**: Customer bookings with complete details
- **admin_users**: Admin and staff accounts
- **queue_history**: Status change tracking and audit log
- **business_hours**: Operating hours configuration
- **location_settings**: Car wash location and contact details

### Booking Status Flow

```
PENDING_PAYMENT → PAYMENT_VERIFIED → CONFIRMED → IN_QUEUE → IN_PROGRESS → COMPLETED
                                    ↓
                                CANCELLED
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect Repository**
   ```bash
   npm i -g vercel
   vercel
   ```

2. **Environment Variables**
   - Add all environment variables in Vercel dashboard
   - Use production database URL

3. **Database Migration**
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```

### Render

1. **Create Services**
   - Web Service (Next.js)
   - PostgreSQL Database

2. **Deploy**
   - Connect GitHub repository
   - Use provided `render.yaml` configuration
   - Set environment variables

## 🔄 API Endpoints

### Customer APIs
- `GET /api/services` - Get available services
- `GET /api/slots?date=YYYY-MM-DD&serviceId=123` - Get available time slots
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/search?bookingNumber=XXX&phone=YYY` - Get booking status

### Admin APIs
- `POST /api/admin/login` - Admin authentication
- `GET /api/admin/pending-payments` - Get pending payments
- `POST /api/admin/verify-payment` - Verify payment
- `POST /api/admin/update-status` - Update booking status
- `GET /api/admin/queue?date=YYYY-MM-DD` - Get queue for date

## 🧪 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema changes
npm run db:migrate   # Run migrations
npm run db:seed      # Seed database

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

### Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/                # API Routes
│   ├── admin/              # Admin pages
│   ├── booking/            # Booking page
│   ├── status/             # Status page
│   └── page.tsx            # Home page
├── lib/                    # Utilities
│   ├── prisma.ts          # Database client
│   ├── auth.ts            # Authentication
│   └── utils.ts           # Helper functions
└── types/                  # TypeScript types
```

## 🔐 Security Features

- **JWT Authentication**: Secure admin authentication
- **Input Validation**: Comprehensive input sanitization
- **SQL Injection Prevention**: Prisma ORM with prepared statements
- **XSS Protection**: React's built-in XSS protection
- **Rate Limiting**: API rate limiting (configurable)
- **Environment Variables**: Secure configuration management

## 📞 Support

For issues or questions:
- **Email**: contact@copperwaywash.com
- **Phone**: +260 123 456789
- **Location**: Kitwe, Zambia

## 📄 License

© 2025 Copperway Car Wash. All rights reserved.

---

## 🔄 Migration from PHP/MySQL

This system represents a complete migration from the original PHP/MySQL implementation to a modern tech stack. Key improvements include:

- **Better Performance**: Next.js SSR/SSG capabilities
- **Type Safety**: Full TypeScript implementation
- **Modern UI**: React components with Tailwind CSS
- **Better Security**: JWT authentication and modern security practices
- **Scalability**: PostgreSQL with Prisma ORM
- **Developer Experience**: Modern tooling and development workflow

See `MIGRATION_GUIDE.md` for detailed migration instructions.