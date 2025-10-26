# Deploy Copperway Car Wash to Render - Updated Instructions

## 🚀 Quick Deploy Steps

### 1. Create Render Account (if not already done)
- Go to https://render.com
- Sign up or log in

### 2. Create PostgreSQL Database
1. Click "New +" → "PostgreSQL"
2. Name: `copperway-db`
3. Plan: Free (or Starter)
4. Region: Choose closest to Zambia
5. Click "Create Database"
6. **Copy the Internal Database URL** (will use later)

### 3. Setup Database Schema
Once your database is created:

**Option A: Using Render Database Shell**
1. Go to your database service
2. Click "Connect" → "External Connection"
3. Copy the connection string
4. Run locally:
   ```bash
   npx prisma db push
   npm run db:seed
   ```

**Option B: Using psql**
1. Get connection string from Render
2. Install psql on your machine
3. Run:
   ```bash
   psql "your-connection-string"
   ```
4. Then run SQL commands from `database.sql`

### 4. Deploy Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `copperway-car-wash`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free (or Starter)

### 5. Add Environment Variables
In the Web Service settings, add these environment variables:

```
DATABASE_URL=<your-postgres-connection-string>
JWT_SECRET=<generate-a-random-secret>
NODE_ENV=production
NEXT_PUBLIC_APP_NAME=Copperway Car Wash
NEXT_PUBLIC_TIMEZONE=Africa/Lusaka
UPLOAD_DIR=./uploads/payment_screenshots
MAX_FILE_SIZE=5242880
```

**Important**: Replace `<your-postgres-connection-string>` with the Internal Database URL from step 2.

### 6. Optional: Add Custom Domain
1. Go to your web service settings
2. Click "Custom Domains"
3. Add your domain name

## 📝 Environment Variables Setup

### For Supabase Database:
If using Supabase instead of Render's PostgreSQL:

1. Go to Supabase Dashboard
2. Project Settings → Database
3. Copy the connection string
4. Use Connection Pooler URL (port 6543) for better performance
5. Add to Render environment variables as `DATABASE_URL`

Example format:
```
postgresql://postgres.easfsycisfbgbylenrzv:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

## 🔧 After Deployment

### 1. Run Database Migrations
Once deployed, SSH into your Render service or use the Shell:

```bash
npx prisma db push
npm run db:seed
```

### 2. Verify Deployment
- Visit your Render URL: `https://copperway-car-wash.onrender.com`
- Test booking flow
- Check admin login
- Verify all pages load correctly

### 3. Test Admin Access
- Go to: `https://your-url.onrender.com/admin/login`
- Username: `admin`
- Password: `admin123`

## 📱 Current Configuration

### Services & Pricing
- **Saloon Cars**: K50
- **SUVs (Hilux, etc.)**: K100
- **Vans**: K70
- **Carpets (per sqm)**: K200

### Contact Information
- **Phone**: 0974323234
- **WhatsApp**: +26076977857
- **Supervisor**: +260972297220
- **Location**: Chalala Selena Area (Opposite White Shop), Lusaka, Zambia

### Operating Hours
- **All 7 Days**: 07:00 - 19:00

## ⚠️ Troubleshooting

### Database Connection Issues
- Make sure DATABASE_URL uses the correct format
- Use Connection Pooler URL from Supabase (if applicable)
- Check that database is accessible from Render's servers

### Build Failures
- Check Node.js version (requires 18+)
- Ensure all dependencies install correctly
- Verify Prisma schema is valid

### Prisma Issues
- Run `npx prisma generate` during build
- Ensure DATABASE_URL is set correctly
- Check database schema is up to date

## 🎯 What Gets Deployed

- ✅ Complete booking system
- ✅ Admin dashboard
- ✅ Queue management
- ✅ Payment verification system
- ✅ Customer record keeping
- ✅ Updated services & pricing
- ✅ Contact information
- ✅ Operating hours configuration

## 🚨 Important Notes

1. **First Deploy**: May take 5-10 minutes
2. **Sleep Mode**: Free tier apps sleep after 15 minutes of inactivity
3. **Cold Start**: First request after sleep takes 30-60 seconds
4. **Database**: Keep Render PostgreSQL or switch to Supabase
5. **Scaling**: Upgrade to Starter plan ($7/month) for always-on service

## 📊 Monitoring

After deployment, monitor:
- Application logs in Render dashboard
- Database connections
- Error rates
- Response times

## 🔐 Security

- Change admin password after first login
- Use strong JWT_SECRET
- Enable HTTPS (automatic on Render)
- Regularly update dependencies

Your booking system is now ready to go live! 🎉

