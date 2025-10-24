# XAMPP Setup Guide for Copperway Car Wash

## Quick Setup (5 Minutes)

### Step 1: Run the Setup Script
Double-click `setup_xampp.bat` to automatically:
- Copy your project to XAMPP
- Start Apache and MySQL services
- Prepare everything for use

### Step 2: Setup Database
1. Open your browser and go to: http://localhost/phpmyadmin
2. Click "New" to create a database
3. Name it: `copperway_carwash`
4. Click "Import" tab
5. Choose file: `database.sql` (in your project folder)
6. Click "Go"

**OR** Use the automatic setup:
1. Go to: http://localhost/copperway-carwash/setup_database.php
2. This will automatically create database and tables

### Step 3: Update Config File
Open `config.php` and verify these settings:
```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'copperway_carwash');
define('DB_USER', 'root');
define('DB_PASS', '');
```

### Step 4: Access Your Application
Open your browser and go to:
- **Home Page**: http://localhost/copperway-carwash/
- **Booking Page**: http://localhost/copperway-carwash/booking.html
- **Status Check**: http://localhost/copperway-carwash/status.html
- **Admin Login**: http://localhost/copperway-carwash/admin_login.html

## Manual Setup (If Script Doesn't Work)

### Step 1: Start XAMPP Services
1. Open XAMPP Control Panel
2. Click "Start" for Apache
3. Click "Start" for MySQL

### Step 2: Copy Files
1. Navigate to: `C:\xampp\htdocs\`
2. Create folder: `copperway-carwash`
3. Copy all your project files there

### Step 3: Setup Database
1. Open phpMyAdmin: http://localhost/phpmyadmin
2. Click "New" → Create database: `copperway_carwash`
3. Click "Import" → Select `database.sql`
4. Click "Go"

### Step 4: Update Config
Edit `C:\xampp\htdocs\copperway-carwash\config.php`:
```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'copperway_carwash');
define('DB_USER', 'root');
define('DB_PASS', '');
```

## Testing Your Setup

### Test 1: Check Database Connection
Go to: http://localhost/copperway-carwash/test_connection.php

You should see:
- ✅ Database connection successful
- ✅ Tables created
- ✅ Services loaded

### Test 2: Try Booking
1. Go to: http://localhost/copperway-carwash/booking.html
2. Try to book a service
3. Check browser console (F12) for errors

### Test 3: Admin Login
1. Go to: http://localhost/copperway-carwash/admin_login.html
2. Login with:
   - Username: `admin`
   - Password: `admin123`

## Troubleshooting

### Issue: Apache won't start
**Solution:**
- Check if port 80 is in use
- Run XAMPP Control Panel as Administrator
- Check Apache error logs

### Issue: MySQL won't start
**Solution:**
- Check if port 3306 is in use
- Check MySQL error logs
- Try restarting your computer

### Issue: Database connection failed
**Solution:**
- Check MySQL is running
- Verify database name in config.php
- Check username/password

### Issue: Services not loading
**Solution:**
- Check browser console (F12)
- Verify API endpoints are accessible
- Check Apache error logs

### Issue: Permission denied for uploads
**Solution:**
- Right-click uploads folder → Properties
- Remove "Read-only"
- Give full control to Everyone

## File Structure After Setup
```
C:\xampp\htdocs\copperway-carwash\
├── index.html
├── booking.html
├── status.html
├── admin_login.html
├── admin_dashboard.html
├── config.php
├── database.sql
├── api/
│   ├── get_services.php
│   ├── create_booking.php
│   ├── get_slots.php
│   └── ...
├── uploads/
│   └── payment_screenshots/
├── setup_database.php
└── test_connection.php
```

## Default Admin Credentials
⚠️ **CHANGE THESE IMMEDIATELY AFTER FIRST LOGIN!**

- Username: `admin`
- Password: `admin123`

## Services Available
- Exterior Wash - $19.99 (30 min)
- Interior Detailing - $24.99 (45 min)
- Wax & Polish - $29.99 (60 min)
- Express Package - $15.99 (20 min)
- Premium Package - $34.99 (75 min)
- Elite Package - $49.99 (120 min)

## Next Steps
1. ✅ Setup complete
2. Test booking functionality
3. Change admin password
4. Customize services and pricing
5. Update contact information
6. Deploy to production (Render.com)

## Support
If you encounter issues:
1. Check browser console (F12)
2. Check Apache error logs
3. Check MySQL error logs
4. Review this guide again

## Quick Commands

### Start XAMPP
```bash
C:\xampp\apache_start.bat
C:\xampp\mysql_start.bat
```

### Stop XAMPP
```bash
C:\xampp\apache_stop.bat
C:\xampp\mysql_stop.bat
```

### Access phpMyAdmin
http://localhost/phpmyadmin

### Access Your App
http://localhost/copperway-carwash/

---

**Setup Complete! Your booking system is ready to use!** 🚗✨
