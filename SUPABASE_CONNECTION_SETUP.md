# Your Supabase Connection String Setup

## ✅ You Have Your Connection String!

Your Supabase connection string:
```
postgresql://postgres:[YOUR_PASSWORD]@db.easfsycisfbgbylenrzv.supabase.co:5432/postgres
```

## 🔧 Next Steps

### Step 1: Replace [YOUR_PASSWORD]
You need to replace `[YOUR_PASSWORD]` with the actual password you created when setting up your Supabase project.

**Example:**
If your password was `Copperway2025!SecurePass`, your connection string becomes:
```
postgresql://postgres:Copperway2025!SecurePass@db.easfsycisfbgbylenrzv.supabase.co:5432/postgres
```

### Step 2: Update Your .env.local File
1. **Open `.env.local`** in your project root directory
2. **Replace the DATABASE_URL line** with your complete connection string:

```env
# Database
DATABASE_URL="postgresql://postgres:YOUR_ACTUAL_PASSWORD@db.easfsycisfbgbylenrzv.supabase.co:5432/postgres"

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

### Step 3: Initialize Your Database
Run these commands in your terminal:

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with initial data
npm run db:seed
```

### Step 4: Test Your Setup
```bash
# Start development server
npm run dev
```

Then visit:
- **Homepage**: http://localhost:3000
- **Admin Login**: http://localhost:3000/admin/login

## 🔍 Troubleshooting

### If you get connection errors:
1. **Check your password** - make sure it's exactly what you set in Supabase
2. **Check for special characters** - some passwords with special characters might need URL encoding
3. **Verify project is ready** - wait 2-3 minutes after creating the project

### If you forgot your password:
1. Go to your Supabase dashboard
2. Go to Settings → Database
3. Click "Reset database password"
4. Create a new password
5. Update your connection string

## ✅ Success Indicators

You'll know it's working when:
- ✅ No errors in terminal when running `npm run db:push`
- ✅ Services appear on your homepage
- ✅ Admin login works with admin/admin123
- ✅ You can see tables in Supabase Table Editor

## 🚨 Security Reminder

- **Never commit `.env.local`** to version control
- **Keep your database password secure**
- **Change the JWT_SECRET** to a random string

Your Supabase project is ready! Just replace `[YOUR_PASSWORD]` with your actual password and you're good to go!
