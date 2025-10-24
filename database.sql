-- Copperway Car Wash Database Schema
-- Database: copperway_carwash

-- Create database
CREATE DATABASE IF NOT EXISTS copperway_carwash CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE copperway_carwash;

-- Services table
CREATE TABLE IF NOT EXISTS services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    duration INT NOT NULL COMMENT 'Duration in minutes',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_number VARCHAR(20) UNIQUE NOT NULL COMMENT 'Displayed to customer',
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_email VARCHAR(100),
    vehicle_model VARCHAR(100) NOT NULL,
    vehicle_number_plate VARCHAR(20) NOT NULL,
    service_id INT NOT NULL,
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    pickup_required BOOLEAN DEFAULT FALSE,
    pickup_address TEXT,
    dropoff_address TEXT,
    status ENUM('pending_payment', 'payment_verified', 'confirmed', 'in_queue', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending_payment',
    amount DECIMAL(10, 2) NOT NULL,
    payment_confirmed BOOLEAN DEFAULT FALSE,
    payment_method VARCHAR(50),
    payment_screenshot VARCHAR(255) COMMENT 'File path if uploaded',
    payment_notes TEXT,
    slot_number INT COMMENT 'Assigned after payment confirmation',
    estimated_completion_time DATETIME,
    completed_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE RESTRICT,
    INDEX idx_booking_number (booking_number),
    INDEX idx_status (status),
    INDEX idx_scheduled_date (scheduled_date),
    INDEX idx_customer_phone (customer_phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL COMMENT 'Hashed password',
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    role ENUM('admin', 'staff', 'customer_service') DEFAULT 'staff',
    is_active BOOLEAN DEFAULT TRUE,
    last_login DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Queue history table (for tracking)
CREATE TABLE IF NOT EXISTS queue_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    status_change ENUM('pending_payment', 'payment_verified', 'confirmed', 'in_queue', 'in_progress', 'completed', 'cancelled'),
    changed_by INT COMMENT 'Admin user who made the change',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (changed_by) REFERENCES admin_users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default services
INSERT INTO services (name, description, price, duration) VALUES
('Exterior Wash', 'Thorough exterior cleaning for a sparkling finish', 19.99, 30),
('Interior Detailing', 'Deep clean and vacuum for the inside of your vehicle', 24.99, 45),
('Wax & Polish', 'Protect your paint and add a lasting shine', 29.99, 60),
('Express Package', 'Quick wash and dry services for busy schedules', 15.99, 20),
('Premium Package', 'Basic + Wax & Polish + Complimentary Air Freshener', 34.99, 75),
('Elite Package', 'Premium + Deep Interior Clean + Headlight Restoration', 49.99, 120);

-- Insert default admin user (password: admin123)
-- Password hash for 'admin123' using password_hash()
INSERT INTO admin_users (username, password, full_name, email, role) VALUES
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrator', 'admin@copperwaywash.com', 'admin'),
('staff1', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Customer Service Staff', 'staff@copperwaywash.com', 'customer_service');

-- Business hours configuration (can be stored in a separate table or config file)
CREATE TABLE IF NOT EXISTS business_hours (
    id INT AUTO_INCREMENT PRIMARY KEY,
    day_of_week INT NOT NULL COMMENT '0=Sunday, 1=Monday, etc.',
    open_time TIME NOT NULL,
    close_time TIME NOT NULL,
    is_open BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default business hours (Monday to Saturday, 8 AM to 6 PM)
INSERT INTO business_hours (day_of_week, open_time, close_time, is_open) VALUES
(1, '08:00:00', '18:00:00', TRUE), -- Monday
(2, '08:00:00', '18:00:00', TRUE), -- Tuesday
(3, '08:00:00', '18:00:00', TRUE), -- Wednesday
(4, '08:00:00', '18:00:00', TRUE), -- Thursday
(5, '08:00:00', '18:00:00', TRUE), -- Friday
(6, '08:00:00', '18:00:00', TRUE), -- Saturday
(0, '08:00:00', '18:00:00', FALSE); -- Sunday (closed)

-- Car wash location settings
CREATE TABLE IF NOT EXISTS location_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    phone VARCHAR(100),
    email VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default location
INSERT INTO location_settings (name, address, latitude, longitude, phone, email) VALUES
('Copperway Car Wash', 'Kitwe, Zambia', -12.8153, 28.2139, '+260 123 456789', 'contact@copperwaywash.com');

