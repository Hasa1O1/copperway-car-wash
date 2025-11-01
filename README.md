# Copperway Car Wash - Modern Booking System

A comprehensive car wash booking and management system with real-time updates, built with modern technologies.

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** - Fast build tool
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Socket.io Client** - Real-time updates
- **Axios** - API requests
- **Google Maps Integration** - Location services

### Backend
- **Node.js** + **Express** + **TypeScript**
- **PostgreSQL** - Database
- **Drizzle ORM** - Type-safe database queries
- **Socket.io** - Real-time communication
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File uploads

## ✨ Features

### Customer Features
- 🚗 **Service Selection**: Multiple car wash packages
- 📅 **Online Booking**: Multi-step booking form with validation
- ⏰ **Time Slot Selection**: Dynamic availability checking
- 🚖 **Pickup Service**: Optional pickup and drop-off
- 📊 **Status Tracking**: Real-time booking status updates
- 💳 **Payment Integration**: Offline payment support
- 🗺️ **Navigation**: Google Maps integration

### Admin Features
- 🔐 **Secure Authentication**: JWT-based login
- ✅ **Payment Verification**: Manual payment verification dashboard
- 📋 **Queue Management**: Real-time queue management
- 🔄 **Status Updates**: Update booking statuses with notes
- 📊 **Comprehensive Dashboard**: Multi-tab admin interface
- 📈 **Analytics**: Booking history and statistics

## 🛠️ Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- npm or yarn

### Local Development Setup

1. **Clone the repository**
```bash
git clone https://github.com/Hasa1O1/copperway-car-wash.git
cd copperway-car-wash
```

2. **Setup Backend**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run dev
```

3. **Setup Frontend**
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env if needed
npm run dev
```

4. **Initialize Database**
```bash
cd backend
npm run db:push   # Create tables
npm run seed      # Seed initial data
```

5. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/api/health

### Default Admin Credentials
- **Username**: `admin`
- **Password**: `admin123`

⚠️ **Change these credentials immediately after first login!**

## 🐳 Docker Deployment

### Using Docker Compose (Recommended for local testing)
```bash
docker-compose up -d
```

This will start:
- PostgreSQL database
- Backend + Frontend server
- All services configured and ready

### Building Docker Image
```bash
docker build -t copperway-car-wash .
```

## 🚀 Deployment

### Render Deployment

1. **Connect your GitHub repository** to Render
2. **Render will automatically detect** the `render.yaml` configuration
3. **Set environment variables** in Render dashboard:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `JWT_SECRET`: A secure random string
   - `NODE_ENV`: `production`

4. **Deploy**: Render will build and deploy automatically

### Environment Variables

#### Backend
```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRET=your-secure-jwt-secret
FRONTEND_URL=https://your-domain.com
```

#### Frontend
```env
VITE_API_URL=/api  # In production, uses relative URL
VITE_GOOGLE_MAPS_API_KEY=your-api-key
```

## 📁 Project Structure

```
copperway-car-wash/
├── backend/                 # Backend server
│   ├── src/
│   │   ├── config/         # Database and configuration
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth middleware
│   │   ├── socket/         # WebSocket handlers
│   │   └── index.ts        # Server entry point
│   ├── package.json
│   └── tsconfig.json
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── lib/           # API and utilities
│   │   └── types/         # TypeScript types
│   ├── package.json
│   └── vite.config.ts
├── Dockerfile              # Multi-stage Docker build
├── docker-compose.yml      # Local development with Docker
└── render.yaml            # Render deployment config
```

## 🔄 API Endpoints

### Public APIs
- `GET /api/health` - Health check
- `GET /api/services` - Get available services
- `GET /api/slots?date=YYYY-MM-DD&serviceId=123` - Get available time slots
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/search?bookingNumber=XXX&phone=YYY` - Search booking

### Admin APIs (Require Authentication)
- `POST /api/auth/login` - Admin login
- `GET /api/admin/pending-payments` - Get pending payments
- `POST /api/admin/verify-payment` - Verify payment
- `PUT /api/admin/update-status` - Update booking status
- `GET /api/admin/queue` - Get current queue
- `GET /api/admin/stats/overall` - Get overall statistics
- `GET /api/admin/records/customers` - Get customer records

## 🧪 Development Scripts

### Backend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run db:push      # Push schema changes to database
npm run seed         # Seed database with initial data
```

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🔐 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ SQL injection prevention (prepared statements)
- ✅ XSS protection (React + Helmet)
- ✅ CORS configuration
- ✅ Input validation
- ✅ Secure file uploads

## 📞 Support

For issues or questions:
- **Email**: contact@copperwaywash.com
- **GitHub Issues**: [Create an issue](https://github.com/Hasa1O1/copperway-car-wash/issues)
- **Location**: Kitwe, Zambia

## 📄 License

© 2025 Copperway Car Wash. All rights reserved.

## 🙏 Acknowledgments

Built with ❤️ using modern web technologies:
- React
- Express
- PostgreSQL
- TypeScript
- Tailwind CSS
- Socket.io

---

**Note**: This project has been restructured from a PHP/MySQL implementation to a modern TypeScript stack for better performance, type safety, and developer experience.
