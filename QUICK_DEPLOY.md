# 🚀 Quick Deploy to Render - Copperway Car Wash

## Deploy Your Updated Booking System in 5 Minutes

### What's Been Updated
✅ Services: Saloon Cars (K50), SUVs (K100), Vans (K70), Carpets (K200)  
✅ Contact: 0974323234, +26076977857, +260972297220  
✅ Location: Chalala Selena Area, Lusaka  
✅ Hours: All 7 Days, 07:00-19:00  
✅ Complete booking system with all features working

---

## Step-by-Step Deployment

### 1️⃣ Connect Your Repository to Render

1. Go to https://render.com and sign in
2. Click "New +" → "Blueprint"
3. Connect your GitHub/GitLab repository
4. Select the branch (usually `main` or `master`)
5. Render will detect the `render.yaml` file automatically

### 2️⃣ Configure Database

**Option A: Use Supabase (Recommended - Already Setup)**
1. Your Supabase database is already configured
2. Copy your Supabase connection string from Project Settings → Database
3. Use the **Connection Pooler** URL (port 6543) for best performance

**Option B: Use Render PostgreSQL**
1. In Render, go to "New +" → "PostgreSQL"
2. Name it `copperway-db`
3. Use Render's connection string

### 3️⃣ Add Environment Variables

In Render Web Service settings, add:

```env
DATABASE_URL=<your-database-connection-string>
JWT_SECRET=<generate-random-secret>
NODE_ENV=production
NEXT_PUBLIC_APP_NAME=Copperway Car Wash
NEXT_PUBLIC_TIMEZONE=Africa/Lusaka
```

### 4️⃣ Deploy

Render will automatically:
- Install dependencies
- Generate Prisma client
- Build the Next.js app
- Start the service

### 5️⃣ Initialize Database

After first deployment, go to Render Shell and run:

```bash
npx prisma db push
npm run db:seed
```

This will create tables and seed initial data.

---

## 🔗 Your Deployment Will Be Available At

**Free Tier**: `https://copperway-car-wash.onrender.com`  
**Custom Domain**: Add your own domain in Render settings

---

## 📱 Access Admin Dashboard

1. Go to: `https://your-url.onrender.com/admin/login`
2. Username: `admin`
3. Password: `admin123`

**Change password immediately after first login!**

---

## ✅ Verify Everything Works

1. **Homepage**: See updated pricing and contact info
2. **Booking**: Complete a test booking
3. **Admin Login**: Access dashboard
4. **Services**: Check all 4 services load correctly
5. **Payment**: Test payment verification flow

---

## 🎯 Features Available on Render

- ✅ Booking system with 4 service types
- ✅ Online booking with time slots
- ✅ Offline payment verification
- ✅ Queue management
- ✅ Admin dashboard
- ✅ Customer record keeping
- ✅ Real-time status updates
- ✅ FREE pickup & delivery info

---

## ⚡ Performance Tips

1. **Upgrade to Starter Plan** ($7/month)
   - No sleep mode
   - Faster response times
   - Better for production

2. **Use Supabase Pooler**
   - Better connection handling
   - Improved performance
   - Free tier available

3. **Enable Caching**
   - Automatic on Render
   - Faster page loads

---

## 🆘 Troubleshooting

### Database Connection Failed
- Verify DATABASE_URL is correct
- Check database is accessible
- Try Supabase connection pooler URL

### Build Failed
- Check Node.js version (18+)
- Review build logs in Render
- Ensure all dependencies install

### Pages Don't Load
- Check environment variables
- Verify Prisma client generated
- Review application logs

---

## 📞 Support

- Render Docs: https://render.com/docs
- Status: https://status.render.com
- Community: https://community.render.com

---

## 🎉 You're Live!

Your Copperway Car Wash booking system is now deployed with all updates:
- Correct pricing (K50, K100, K70, K200)
- Accurate contact information
- "Vans" service name
- 7 days, 07:00-19:00 hours
- All features working!

Start accepting bookings! 🚗✨

