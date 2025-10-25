# Complete Supabase Setup with Your Password

## ✅ Your Complete Connection String

With your password `D4Jep&X+k2Yb!ja`, your complete connection string is:

```
postgresql://postgres:D4Jep&X+k2Yb!ja@db.easfsycisfbgbylenrzv.supabase.co:5432/postgres
```

## 🔧 Update Your .env.local File

1. **Open `.env.local`** in your project root directory
2. **Replace the DATABASE_URL** with your complete connection string:

```env
# Database
DATABASE_URL="postgresql://postgres:D4Jep&X+k2Yb!ja@db.easfsycisfbgbylenrzv.supabase.co:5432/postgres"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# File Upload Settings
UPLOAD_DIR="./uploads/payment_screenshots"
MAX_FILE_SIZE=5242880

# Application Settings
NEXT_PUBLIC_APP_NAME="Copperway Car Wash"
NEXT_PUBLIC_TIMEZONE="Africa/Lusaka"

# Google Maps API (optional)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
```

## 🚀 Initialize Your Database

Run these commands in your terminal:

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with initial data
npm run db:seed
```

## 🧪 Test Your Application

```bash
# Start development server
npm run dev
```

Then visit:
- **Homepage**: http://localhost:3000
- **Admin Login**: http://localhost:3000/admin/login

## ✅ What Should Happen

1. **Database Commands**: Should run without errors
2. **Homepage**: Should show car wash services
3. **Admin Login**: Should work with admin/admin123
4. **Supabase Dashboard**: Should show your tables in Table Editor

## 🔍 Troubleshooting

### If you get connection errors:
- **Check password**: Make sure it's exactly `D4Jep&X+k2Yb!ja`
- **Check special characters**: The `&` and `!` characters should work fine
- **Verify project is ready**: Wait 2-3 minutes after creating the project

### If you get "relation does not exist" errors:
- Run `npm run db:push` again
- Make sure the schema was pushed successfully

## 🎉 Success!

Once you complete these steps, your Copperway Car Wash booking system will be fully functional with:
- ✅ PostgreSQL database on Supabase
- ✅ All tables created (services, bookings, admin_users, etc.)
- ✅ Initial data seeded (services, admin users, business hours)
- ✅ Working admin login
- ✅ Customer booking system

Your password is now properly configured and your database should be ready to use!
