# Complete Guide: Hosting Copperway Car Wash on Render

## Overview
This guide will walk you through deploying your PHP car wash booking system on Render.com.

---

## Prerequisites Checklist
- [ ] GitHub account
- [ ] Code pushed to GitHub (already done ✓)
- [ ] Render account (free tier available)

---

## Part 1: Sign Up for Render

### Step 1: Create Account
1. Go to https://render.com
2. Click **"Get Started for Free"**
3. Choose **"Sign up with GitHub"** (recommended for easier deployment)
4. Authorize Render to access your GitHub repositories
5. Complete your profile setup

---

## Part 2: Create Database

### Step 2: Create PostgreSQL Database
1. In Render Dashboard, click **"New +"** button (top right)
2. Select **"PostgreSQL"** from the dropdown
3. Fill in the form:
   - **Name**: `copperway-db`
   - **Database**: `copperway_carwash`
   - **User**: `copperway_user`
   - **Region**: Choose closest to your users (e.g., `Oregon (US West)`)
   - **PostgreSQL Version**: `Latest` (default)
   - **Plan**: Select **"Free"** plan
4. Click **"Create Database"**
5. Wait 2-3 minutes for database to provision

### Step 3: Save Database Credentials
1. Once database is created, click on it
2. In the **"Connections"** section, note these values:
   - **Internal Database URL**: Something like `postgresql://copperway_user:password@host:5432/copperway_carwash`
   - **Host**: e.g., `dpg-xxxxx-a.oregon-postgres.render.com`
   - **Port**: `5432`
   - **Database**: `copperway_carwash`
   - **User**: `copperway_user`
   - **Password**: (shown only once - save it!)

⚠️ **IMPORTANT**: Copy the password immediately - it won't be shown again!

---

## Part 3: Import Database Schema

### Step 4: Import Database Data
Since Render uses PostgreSQL but your schema is MySQL, you have two options:

#### Option A: Use MySQL-compatible Service (Recommended)
Consider using **PlanetScale** (free MySQL) or **Aiven** (free MySQL) instead of Render's PostgreSQL.

#### Option B: Convert to PostgreSQL
1. Install PostgreSQL client locally
2. Connect to your Render database:
   ```bash
   psql "postgresql://copperway_user:PASSWORD@HOST:5432/copperway_carwash"
   ```
3. You'll need to convert the SQL syntax from MySQL to PostgreSQL

**Quick Conversion Guide:**
- `AUTO_INCREMENT` → `SERIAL`
- `INT AUTO_INCREMENT PRIMARY KEY` → `SERIAL PRIMARY KEY`
- `ENGINE=InnoDB` → Remove (not needed)
- `TIMESTAMP DEFAULT CURRENT_TIMESTAMP` → Same

### Step 5: Import Using Render Shell
1. Go to your database dashboard
2. Click **"Connect"** tab
3. Use **"External Connection"**
4. Connect using a PostgreSQL client (pgAdmin, DBeaver, etc.)
5. Import your schema

---

## Part 4: Deploy Web Service

### Step 6: Create Web Service
1. In Render Dashboard, click **"New +"** button
2. Select **"Web Service"**
3. Connect your GitHub account if not already connected
4. Select repository: **`Hasa1O1/copperway-car-wash`**

### Step 7: Configure Web Service
Fill in the form:

**Basic Settings:**
- **Name**: `copperway-car-wash`
- **Environment**: Select **"PHP"**
- **Region**: Same as database (recommended)
- **Branch**: `master`

**Build & Deploy:**
- **Build Command**: Leave empty (no build needed)
- **Start Command**: `php -S 0.0.0.0:$PORT`

**Instance Type:**
- **Plan**: Select **"Free"** plan

Click **"Create Web Service"**

### Step 8: Configure Environment Variables
Before the service starts, you need to add environment variables:

1. In your web service dashboard, go to **"Environment"** tab
2. Click **"Add Environment Variable"**
3. Add these variables one by one:

```
Key: DB_HOST
Value: [Your database host from Step 3]
Example: dpg-xxxxx-a.oregon-postgres.render.com
```

```
Key: DB_NAME
Value: copperway_carwash
```

```
Key: DB_USER
Value: copperway_user
```

```
Key: DB_PASS
Value: [Your database password from Step 3]
```

```
Key: PHP_VERSION
Value: 8.1
```

4. Click **"Save Changes"**

---

## Part 5: Update Configuration

### Step 9: Update config.php for Render
You need to modify your config.php to use environment variables:

1. Go to your Render web service dashboard
2. Click **"Shell"** tab (or use local git)
3. Edit `config.php`:

Replace the database section with:
```php
// Database configuration from environment variables
define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_NAME', getenv('DB_NAME') ?: 'copperway_carwash');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') ?: '');
```

4. Commit and push:
```bash
git add config.php
git commit -m "Update config for Render deployment"
git push origin master
```

### Step 10: Redeploy
After pushing changes:
1. Render will automatically redeploy
2. Go to **"Events"** tab to watch deployment
3. Wait for **"Deploy successful"** message

---

## Part 6: Configure File Uploads

### Step 11: Set Up Upload Directory
1. In Render Shell, run:
```bash
mkdir -p uploads/payment_screenshots
chmod 755 uploads
chmod 755 uploads/payment_screenshots
```

2. Or create via git:
```bash
git add uploads/payment_screenshots/.gitkeep
git commit -m "Ensure uploads directory exists"
git push origin master
```

⚠️ **Note**: Render's filesystem is ephemeral. Files uploaded to the server will be lost on restart. For production, use cloud storage (see below).

---

## Part 7: Test Your Deployment

### Step 12: Access Your Application
1. Once deployed, your app will be at:
   `https://copperway-car-wash.onrender.com`

2. Test these URLs:
   - Main page: `https://copperway-car-wash.onrender.com/index.html`
   - Booking: `https://copperway-car-wash.onrender.com/booking.html`
   - Status: `https://copperway-car-wash.onrender.com/status.html`
   - Admin: `https://copperway-car-wash.onrender.com/admin_login.html`

### Step 13: Test Database Connection
1. Go to your admin login page
2. Try logging in with default credentials:
   - Username: `admin`
   - Password: `admin123`

---

## Part 8: Set Up Custom Domain (Optional)

### Step 14: Add Custom Domain
1. In your web service dashboard, go to **"Settings"** tab
2. Scroll to **"Custom Domains"** section
3. Click **"Add Custom Domain"**
4. Enter your domain: `www.yourdomain.com`
5. Follow DNS instructions provided by Render
6. Add the CNAME record to your domain provider

---

## Troubleshooting

### Database Connection Failed
**Problem**: Can't connect to database
**Solution**: 
- Verify environment variables are set correctly
- Check database is running (green status)
- Ensure database name matches exactly

### 404 Errors
**Problem**: Pages not found
**Solution**:
- Check `.htaccess` is in root directory
- Verify `index.html` exists
- Check file paths are correct

### File Upload Not Working
**Problem**: Can't upload payment screenshots
**Solution**:
- Check directory permissions
- Verify `uploads` directory exists
- Check PHP upload settings in Render

### Services Spin Down
**Problem**: App slow after inactivity
**Solution**: 
- Free tier spins down after 15 minutes
- First request after spin-down takes ~30 seconds
- Consider upgrading to paid plan for always-on

---

## Important Notes

### ⚠️ Render Free Tier Limitations
1. **Spinning Down**: Services sleep after 15 min inactivity
2. **Database**: PostgreSQL only (not MySQL)
3. **Storage**: Ephemeral filesystem
4. **Build Time**: Limited to 90 minutes

### 💡 Production Recommendations

1. **Database**: Consider managed MySQL service
   - PlanetScale (free tier)
   - Aiven (free tier)
   - AWS RDS (paid)

2. **File Storage**: Use cloud storage
   - AWS S3
   - Cloudinary
   - Firebase Storage

3. **Always-On**: Upgrade to paid plan ($7/month)

4. **SSL**: Free SSL included automatically

---

## Alternative: Use MySQL-Compatible Hosting

If PostgreSQL conversion is too complex, consider:

### Option 1: PlanetScale (Free MySQL)
1. Sign up at https://planetscale.com
2. Create database
3. Import MySQL schema directly
4. Get connection string
5. Update config.php with PlanetScale credentials

### Option 2: Aiven (Free MySQL)
1. Sign up at https://aiven.io
2. Create MySQL service
3. Import schema
4. Configure connection

---

## Quick Command Reference

```bash
# Connect to Render database
psql "postgresql://user:password@host:5432/database"

# Access Render shell
# Go to service dashboard → Shell tab

# View logs
# Go to service dashboard → Logs tab

# Redeploy
git push origin master
```

---

## Support Resources

- Render Docs: https://render.com/docs
- Render Community: https://community.render.com
- PostgreSQL Docs: https://www.postgresql.org/docs/

---

## Summary Checklist

- [ ] Created Render account
- [ ] Created PostgreSQL database
- [ ] Saved database credentials
- [ ] Imported database schema
- [ ] Created web service
- [ ] Set environment variables
- [ ] Updated config.php
- [ ] Pushed changes to GitHub
- [ ] Tested application
- [ ] Verified all pages work
- [ ] Tested admin login
- [ ] Set up custom domain (optional)

---

## Your Live URLs

- **Main App**: https://copperway-car-wash.onrender.com
- **Admin Dashboard**: https://copperway-car-wash.onrender.com/admin_login.html
- **GitHub Repo**: https://github.com/Hasa1O1/copperway-car-wash

---

Good luck with your deployment! 🚀

