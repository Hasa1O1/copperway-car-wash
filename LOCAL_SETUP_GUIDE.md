# Local Development Setup Guide

## Quick Fix for Booking System Issues

The booking feature isn't working because you need a proper web server environment with PHP and MySQL support. Here are the solutions:

## Option 1: XAMPP (Recommended - Easiest)

### 1. Install XAMPP
- Download from: https://www.apachefriends.org/download.html
- Install with default settings
- Start XAMPP Control Panel

### 2. Setup Project
```bash
# Copy your project to XAMPP htdocs folder
# Default location: C:\xampp\htdocs\
# Create folder: C:\xampp\htdocs\copperway-carwash\
# Copy all your files there
```

### 3. Start Services
- Open XAMPP Control Panel
- Start Apache
- Start MySQL

### 4. Setup Database
- Open http://localhost/phpmyadmin
- Create database: `copperway_carwash`
- Import `database.sql` file
- Update `config.php` with correct credentials:
  ```php
  define('DB_HOST', 'localhost');
  define('DB_NAME', 'copperway_carwash');
  define('DB_USER', 'root');
  define('DB_PASS', '');
  ```

### 5. Access Application
- Open: http://localhost/copperway-carwash/
- Test booking feature

## Option 2: PHP Built-in Server

### 1. Install PHP
- Download PHP from: https://www.php.net/downloads.php
- Add PHP to your PATH environment variable

### 2. Install MySQL
- Download MySQL: https://dev.mysql.com/downloads/mysql/
- Or use MySQL Workbench

### 3. Setup Database
- Create database: `copperway_carwash`
- Import `database.sql`
- Update `config.php`

### 4. Start Server
```bash
# Run the batch file
start_local_server.bat
# Or manually:
php -S localhost:8000
```

### 5. Access Application
- Open: http://localhost:8000

## Option 3: Docker (Advanced)

### 1. Install Docker Desktop
- Download from: https://www.docker.com/products/docker-desktop

### 2. Run with Docker
```bash
# Build and run
docker-compose up -d
```

## Troubleshooting

### Common Issues:

1. **"Database connection failed"**
   - Check MySQL is running
   - Verify database credentials in config.php
   - Ensure database exists and schema is imported

2. **"404 Not Found" for API endpoints**
   - Make sure you're accessing via web server (http://localhost/)
   - Not opening HTML files directly in browser

3. **"Services not loading"**
   - Check browser console for errors
   - Verify API endpoints are accessible
   - Check database has services data

4. **"Permission denied" for uploads**
   - Ensure uploads folder has write permissions
   - Check PHP upload settings

### Quick Test:
1. Open browser console (F12)
2. Go to booking.html
3. Check for any JavaScript errors
4. Try to load services - should see API calls to get_services.php

## File Structure After Setup:
```
C:\xampp\htdocs\copperway-carwash\
├── index.html
├── booking.html
├── api/
│   ├── get_services.php
│   ├── create_booking.php
│   └── ...
├── config.php
├── database.sql
└── uploads/
    └── payment_screenshots/
```

## Next Steps:
1. Choose one of the setup options above
2. Follow the steps
3. Test the booking feature
4. If issues persist, check browser console and server logs
