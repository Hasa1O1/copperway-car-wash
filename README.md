# Copperway Car Wash - Booking System

A comprehensive car wash booking and management system with offline payment verification, queue management, and admin dashboard.

## Features

### Customer Features
- **Service Selection**: Choose from multiple car wash packages
- **Booking System**: Select date and time slots
- **Pickup Service**: Optional pickup and drop-off service
- **Payment Confirmation**: Upload payment screenshots or contact support
- **Status Tracking**: Real-time booking status updates
- **Navigation**: Google Maps integration for directions

### Admin Features
- **Payment Verification**: Verify customer payments manually
- **Queue Management**: View and manage service queue
- **Status Updates**: Update booking statuses (in progress, completed, etc.)
- **Dashboard**: Comprehensive admin dashboard with multiple views
- **Booking History**: Track all bookings and customer records

## Tech Stack

- **Frontend**: HTML5, Tailwind CSS, JavaScript
- **Backend**: PHP 7.4+
- **Database**: MySQL 5.7+
- **APIs**: RESTful API endpoints

## Installation

### Prerequisites
- PHP 7.4 or higher
- MySQL 5.7 or higher
- Apache/Nginx web server
- PHP extensions: PDO, PDO_MySQL, GD (for image handling)

### Step 1: Database Setup

1. Create a MySQL database:
```sql
CREATE DATABASE copperway_carwash CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Import the database schema:
```bash
mysql -u root -p copperway_carwash < database.sql
```

### Step 2: Configuration

1. Edit `config.php` and update database credentials:
```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'copperway_carwash');
define('DB_USER', 'your_username');
define('DB_PASS', 'your_password');
```

2. Update business hours in the database if needed:
```sql
UPDATE business_hours SET open_time = '08:00:00', close_time = '18:00:00' WHERE day_of_week = 1;
```

3. Update location settings:
```sql
UPDATE location_settings SET latitude = -12.8153, longitude = 28.2139 WHERE id = 1;
```

### Step 3: File Permissions

Create upload directory and set permissions:
```bash
mkdir -p uploads/payment_screenshots
chmod 755 uploads
chmod 755 uploads/payment_screenshots
```

### Step 4: Web Server Configuration

#### Apache (.htaccess)
The `.htaccess` file is included for URL rewriting.

#### Nginx
Add this to your server block:
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

### Step 5: Access the Application

- **Main Website**: `http://localhost/copperway_carwash/index.html`
- **Booking Page**: `http://localhost/copperway_carwash/booking.html`
- **Status Check**: `http://localhost/copperway_carwash/status.html`
- **Admin Login**: `http://localhost/copperway_carwash/admin_login.html`

**Default Admin Credentials:**
- Username: `admin`
- Password: `admin123`

⚠️ **Important**: Change the default password immediately after first login!

## API Endpoints

### Customer APIs
- `GET api/get_services.php` - Get available services
- `GET api/get_slots.php?date=YYYY-MM-DD` - Get available time slots
- `POST api/create_booking.php` - Create new booking
- `GET api/get_booking.php?booking_number=XXX&phone=YYY` - Get booking status
- `POST api/upload_payment.php` - Upload payment screenshot

### Admin APIs
- `POST api/admin_login.php` - Admin authentication
- `GET api/admin_pending_payments.php` - Get pending payments
- `POST api/admin_verify_payment.php` - Verify payment
- `POST api/admin_update_status.php` - Update booking status
- `GET api/get_queue.php?date=YYYY-MM-DD` - Get queue for date

## Database Schema

### Main Tables
- **services**: Available car wash services
- **bookings**: Customer bookings with all details
- **admin_users**: Admin user accounts
- **queue_history**: Status change tracking
- **business_hours**: Operating hours configuration
- **location_settings**: Car wash location details

### Booking Status Flow
1. `pending_payment` - Booking created, awaiting payment
2. `payment_verified` - Payment confirmed by admin
3. `confirmed` - Booking confirmed and added to queue
4. `in_queue` - Waiting for service
5. `in_progress` - Currently being serviced
6. `completed` - Service finished
7. `cancelled` - Booking cancelled

## Customization

### Adding New Services
```sql
INSERT INTO services (name, description, price, duration) VALUES
('Full Service', 'Complete interior and exterior cleaning', 59.99, 90);
```

### Changing Business Hours
```sql
UPDATE business_hours SET open_time = '09:00:00', close_time = '19:00:00' WHERE day_of_week = 1;
```

### Updating Location
```sql
UPDATE location_settings SET address = 'New Address', latitude = -12.8153, longitude = 28.2139 WHERE id = 1;
```

## Payment Methods

The system supports offline payment methods:
- Mobile Money
- Bank Transfer
- Cash Payment

Customers can upload payment screenshots or contact support for verification.

## Security Notes

1. **Change Default Passwords**: Update admin passwords immediately
2. **File Uploads**: Validate and sanitize uploaded files
3. **SQL Injection**: Uses prepared statements (PDO)
4. **XSS Protection**: Input sanitization in place
5. **Session Security**: Configure secure session settings
6. **HTTPS**: Use SSL/TLS in production

## Troubleshooting

### Database Connection Error
- Check database credentials in `config.php`
- Verify MySQL service is running
- Ensure database exists

### File Upload Not Working
- Check directory permissions (`chmod 755 uploads`)
- Verify PHP upload settings in `php.ini`
- Check `MAX_FILE_SIZE` constant in `config.php`

### Booking Not Appearing
- Check database for booking records
- Verify API endpoints are accessible
- Check browser console for JavaScript errors

## Support

For issues or questions:
- Email: contact@copperwaywash.com
- Phone: +260 123 456789

## License

© 2025 Copperway Car Wash. All rights reserved.

