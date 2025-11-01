# Copperway Car Wash Booking System

Modern car wash booking system built with React, Express.js, TypeScript, PostgreSQL, and Socket.io.

## Tech Stack

### Frontend
- **React.js** - Component-based UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Socket.io Client** - Real-time updates
- **Google Maps API** - Location selection

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **PostgreSQL** - Relational database
- **Socket.io** - Real-time bidirectional communication
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing

## Features

### Customer Features
- ✅ **Multi-step Booking System** - Easy booking process with service selection, date/time slot picking, and customer information
- ✅ **Offline Payment Workflow** - Support for mobile money, bank transfer, and cash payments with verification process
- ✅ **Pickup & Delivery Options** - Choose between bringing car or requesting pickup service
- ✅ **Google Maps Integration** - Pickup/dropoff location selection with drag-and-drop markers
- ✅ **Location Navigation** - Get Google Maps directions to car wash location
- ✅ **Booking Status Tracking** - Real-time status updates via Socket.io
- ✅ **Mobile-Responsive Design** - Works perfectly on all devices

### Admin Features
- ✅ **Comprehensive Dashboard** - Monitor all aspects of business operations
- ✅ **Payment Verification** - Manually verify offline payments and convert bookings to confirmed slots
- ✅ **Real-time Queue Management** - Live queue updates with auto-refresh
- ✅ **Record Keeping System** - Track customer history, service records, and maintain detailed logs
- ✅ **Statistics & Analytics** - View overall stats, daily statistics, revenue tracking
- ✅ **Customer History** - Track repeat customers and their service history
- ✅ **Service Records** - Detailed record of all completed services
- ✅ **Business Hours Management** - Flexible scheduling system
- ✅ **JWT Authentication** - Secure admin access with role-based permissions
- ✅ **Socket.io Real-time Updates** - Instant notifications and queue updates

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Google Maps API key (for location picker)

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend and backend dependencies
npm run install:all
```

### 2. Database Setup

1. Create a PostgreSQL database:
```sql
CREATE DATABASE copperway_carwash;
```

2. Update `backend/.env` with your database credentials:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=copperway_carwash
DB_USER=postgres
DB_PASSWORD=your_password
```

The database schema will be automatically created on first run.

### 3. Environment Variables

**Backend** (`backend/.env`):
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=copperway_carwash
DB_USER=postgres
DB_PASSWORD=

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

### 4. Seed Admin User

Run the seed script to set up admin credentials:
```bash
cd backend
npm run seed
```

Default credentials:
- Username: `admin`
- Password: `admin123`

**⚠️ Important:** Change the default password in production!

### 5. Start Development Servers

```bash
# Start both frontend and backend
npm run dev

# Or start individually:
npm run dev:frontend  # Frontend on http://localhost:3000
npm run dev:backend   # Backend on http://localhost:5000
```

## Project Structure

```
.
├── frontend/           # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── lib/            # API client and utilities
│   │   ├── types/          # TypeScript type definitions
│   │   └── App.tsx         # Main app component
│   └── package.json
│
├── backend/           # Express.js backend API
│   ├── src/
│   │   ├── config/         # Database and config
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth middleware
│   │   ├── socket/         # Socket.io handlers
│   │   └── index.ts        # Server entry point
│   └── package.json
│
└── package.json       # Root package.json (workspaces)
```

## API Endpoints

### Public
- `GET /api/services` - Get all active services
- `GET /api/slots?date=&serviceId=` - Get available time slots
- `POST /api/bookings` - Create a new booking
- `GET /api/bookings/search?bookingNumber=&phone=` - Search for booking

### Admin (Requires Authentication)
- `POST /api/auth/login` - Admin login
- `GET /api/admin/pending-payments` - Get pending payments
- `POST /api/admin/verify-payment` - Verify payment
- `GET /api/admin/queue` - Get queue
- `PUT /api/admin/update-status` - Update booking status

### Records & Statistics
- `GET /api/admin/records/customers` - Get customer history
- `GET /api/admin/records/services` - Get service records
- `GET /api/admin/records/customer/:phone` - Get records for specific customer
- `GET /api/admin/stats/daily?days=30` - Get daily statistics
- `GET /api/admin/stats/overall` - Get overall statistics

### Location
- `GET /api/slots/location` - Get car wash location details

## Database Schema

The system uses the following main tables:

- **services** - Available car wash services with pricing
- **bookings** - Customer bookings with all details
- **admin_users** - Admin/staff authentication
- **queue_history** - Audit trail of booking status changes
- **business_hours** - Operating hours configuration
- **location_settings** - Car wash location details

### Views for Reporting
- **customer_history** - Customer visit and spending statistics
- **service_records** - Detailed completed service records
- **daily_stats** - Daily business metrics

## Production Build

```bash
# Build both frontend and backend
npm run build

# Start production servers
cd backend && npm start
cd frontend && npm run preview
```

## Security Notes

1. Change default admin password
2. Use strong JWT_SECRET in production
3. Enable HTTPS in production
4. Set proper CORS origins
5. Implement rate limiting (already included)
6. Sanitize user inputs (use Joi validation)

## License

MIT

