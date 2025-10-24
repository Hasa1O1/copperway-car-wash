# Copperway Car Wash - Setup Guide

## Quick Start Guide

This guide will help you set up the Copperway Car Wash booking system step by step.

## Step 1: Install Requirements

Make sure you have:
- PHP 7.4 or higher
- MySQL 5.7 or higher
- Apache/Nginx web server
- PHP extensions: PDO, PDO_MySQL

## Step 2: Setup Database

1. Open MySQL command line or phpMyAdmin
2. Create the database:
```sql
CREATE DATABASE copperway_carwash CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

3. Import the schema:
```bash
mysql -u root -p copperway_carwash < database.sql
```

Or use phpMyAdmin to import `database.sql`

## Step 3: Configure Database Connection

Edit `config.php` and update these lines:
```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'copperway_carwash');
define('DB_USER', 'your_username');
define('DB_PASS', 'your_password');
```

## Step 4: Create Upload Directory

Create the uploads directory:
```bash
mkdir -p uploads/payment_screenshots
chmod 755 uploads
chmod 755 uploads/payment_screenshots
```

## Step 5: Access the Application

Open your web browser and navigate to:
- Main Website: `http://localhost/copperway_carwash/index.html`
- Booking Page: `http://localhost/copperway_carwash/booking.html`
- Admin Login: `http://localhost/copperway_carwash/admin_login.html`

## Default Login Credentials

**Admin Login:**
- Username: `admin`
- Password: `admin123`

⚠️ **IMPORTANT**: Change this password immediately after first login!

## Testing the System

### 1. Test Customer Booking Flow

1. Go to `booking.html`
2. Select a service
3. Fill in vehicle details
4. Choose date and time
5. Enter contact information
6. Submit booking
7. Note your booking number
8. Upload payment screenshot or contact support

### 2. Test Admin Verification

1. Login to admin dashboard
2. Go to "Pending Payments" tab
3. Find the booking you just created
4. Click "Verify Payment"
5. Select payment method and add notes
6. Click "Verify Payment"
7. Booking should move to "Queue" tab

### 3. Test Status Tracking

1. Go to `status.html`
2. Enter booking number and phone
3. Click "Check Status"
4. You should see booking details and status

## Customization

### Change Business Hours

Edit in database:
```sql
UPDATE business_hours SET open_time = '09:00:00', close_time = '19:00:00' WHERE day_of_week = 1;
```

### Update Location

Edit in database:
```sql
UPDATE location_settings SET address = 'Your Address', latitude = -12.8153, longitude = 28.2139 WHERE id = 1;
```

### Add New Services

```sql
INSERT INTO services (name, description, price, duration) VALUES
('Full Service', 'Complete interior and exterior cleaning', 59.99, 90);
```

## Troubleshooting

### Database Connection Error
- Check credentials in `config.php`
- Verify MySQL is running
- Ensure database exists

### File Upload Not Working
- Check directory permissions
- Verify PHP upload settings
- Check file size limits

### API Not Responding
- Check PHP error logs
- Verify file paths
- Ensure database connection works

## Support

For help, contact:
- Email: contact@copperwaywash.com
- Phone: +260 123 456789

## Next Steps

1. Change admin password
2. Update business hours
3. Add your services
4. Update location coordinates
5. Test booking flow
6. Train staff on admin dashboard

