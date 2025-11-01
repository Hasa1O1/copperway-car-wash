# Copperway Car Wash - Complete Setup Guide

## Quick Start

### Prerequisites
- Node.js 18 or higher
- PostgreSQL database installed and running
- Google Maps API key (optional, for location picker)

### Step 1: Clone and Install

```bash
# Clone the repository
cd "C:\Users\Emmanuel Hasalama\Documents\Programming\Copperway car wash"

# Install all dependencies
npm run install:all
```

### Step 2: Setup Database

1. Create PostgreSQL database:
```sql
CREATE DATABASE copperway_carwash;
```

2. Create `.env` file in `backend/` directory:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=copperway_carwash
DB_USER=postgres
DB_PASSWORD=your_postgres_password

PORT=5000
NODE_ENV=development
JWT_SECRET=change-this-to-a-random-secret-in-production
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

3. Create `.env` file in `frontend/` directory:
```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### Step 3: Run Database Setup

The database schema will be automatically created when you start the backend for the first time.

To seed the database with default data:
```bash
cd backend
npm run seed
```

This creates:
- Default services (Saloon, SUV, Van, Carpet)
- Admin user (username: `admin`, password: `admin123`)
- Business hours (7 AM - 7 PM, all days)
- Location settings (Kitwe, Zambia)

### Step 4: Start Development Servers

```bash
# From root directory
npm run dev
```

This starts:
- Frontend: http://localhost:5173 (Vite default)
- Backend: http://localhost:5000

Or start individually:
```bash
npm run dev:frontend
npm run dev:backend
```

## Features Implemented

### ✅ Record Keeping System
- **Customer History View** - Tracks all customer visits, completed services, and total spending
- **Service Records View** - Detailed logs of all completed services with timestamps
- **Daily Statistics View** - Business metrics per day (revenue, bookings, etc.)
- **Audit Trail** - Queue history table logs all booking status changes

### ✅ Booking & Payment Workflow
- **Multi-step Booking Form** - Service selection, date/time slot, vehicle info, contact details
- **Offline Payment Methods** - Mobile money, bank transfer, cash
- **Booking Number Generation** - Unique identifier (e.g., CW202501011234)
- **Payment Verification** - Admin verifies payment and converts booking to slot
- **Status Progression**: pending_payment → payment_verified → in_queue → in_progress → completed

### ✅ Queue Management
- **Real-time Updates** - Socket.io broadcasts queue changes instantly
- **Slot Assignment** - Automatic slot numbering upon payment verification
- **Estimated Completion Times** - Calculated based on service duration
- **Queue Display** - Live view of current and upcoming bookings

### ✅ Navigation System
- **Pickup Service** - Customers can request pickup with custom addresses
- **Google Maps Integration** - Drag-and-drop location picker
- **Directions Link** - Direct Google Maps link to car wash location
- **Location API** - Get car wash location details and coordinates

### ✅ Admin Dashboard
**Tabs:**
1. **Pending Payments** - Bookings awaiting payment verification
2. **Queue** - Active bookings in service queue
3. **Records** - Customer history and service records
4. **Statistics** - Overall stats and daily metrics

**Features:**
- Verify offline payments manually
- Update booking status (start service, mark complete)
- View customer history and repeat customers
- Track revenue and booking statistics
- Real-time queue updates via WebSocket

## Admin Panel Login

1. Navigate to http://localhost:5173/admin/login
2. Login credentials:
   - Username: `admin`
   - Password: `admin123`

**⚠️ Change the default password in production!**

## Booking Flow

### Customer Journey:
1. **Select Service** - Choose from available services (Saloon, SUV, Van, Carpet)
2. **Choose Date & Time** - Pick available slot
3. **Vehicle Details** - Enter model and license plate
4. **Pickup Option** - Choose pickup service or bring car
5. **Contact & Payment** - Enter details and see payment methods
6. **Get Booking Number** - System generates unique booking number
7. **Make Payment** - Offline payment (mobile money, bank, cash)
8. **Wait for Verification** - Admin verifies payment
9. **Get Slot Number** - Booking confirmed and added to queue
10. **Track Status** - Check booking status in real-time

### Admin Actions:
1. **View Pending Payments** - See all unpaid bookings
2. **Verify Payment** - Confirm payment manually
3. **Assign Slot** - Slot number auto-assigned
4. **Update Queue** - Start service, mark complete
5. **View Records** - Check customer history and statistics

## API Endpoints

### Public Endpoints
- `GET /api/services` - List all services
- `GET /api/slots?date=&serviceId=` - Get available time slots
- `GET /api/slots/location` - Get car wash location
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/search?bookingNumber=&phone=` - Search booking

### Admin Endpoints (Requires Auth)
- `POST /api/auth/login` - Admin login
- `GET /api/admin/pending-payments` - Pending verifications
- `POST /api/admin/verify-payment` - Verify payment
- `GET /api/admin/queue` - Service queue
- `PUT /api/admin/update-status` - Change booking status

### Records & Statistics
- `GET /api/admin/records/customers` - Customer history
- `GET /api/admin/records/services` - Service records
- `GET /api/admin/records/customer/:phone` - Customer's bookings
- `GET /api/admin/stats/daily?days=30` - Daily statistics
- `GET /api/admin/stats/overall` - Overall stats

## Real-time Features

The system uses Socket.io for real-time updates:
- Queue automatically updates when bookings change status
- Admin dashboard receives live notifications
- No page refresh needed

## Production Deployment

### Build
```bash
npm run build
```

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run preview
```

### Important Production Checklist
- [ ] Change admin password
- [ ] Use strong JWT_SECRET
- [ ] Enable HTTPS
- [ ] Set proper CORS origins
- [ ] Configure production database
- [ ] Set NODE_ENV=production
- [ ] Enable rate limiting
- [ ] Set up backups
- [ ] Configure Google Maps API restrictions

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check `.env` credentials
- Ensure database exists

### Socket.io Not Working
- Check CORS settings in backend
- Verify FRONTEND_URL in .env
- Check browser console for errors

### Google Maps Not Loading
- Verify API key is set
- Check API key restrictions in Google Cloud Console
- Enable Maps JavaScript API and Places API

### Port Already in Use
- Change PORT in backend/.env
- Update VITE_API_URL in frontend/.env
- Or stop process using the port

## Support

For issues or questions:
- Check README.md for API documentation
- Review database schema in backend/src/config/schema.ts
- Check logs in console during development

