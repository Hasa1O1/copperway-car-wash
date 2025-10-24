<?php
/**
 * Database Configuration File
 * Contains database connection settings for Copperway Car Wash
 * 
 * Copy this file to config.php and update with your database credentials
 */

// Database configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'copperway_carwash');
define('DB_USER', 'your_username');
define('DB_PASS', 'your_password');
define('DB_CHARSET', 'utf8mb4');

// Application settings
define('APP_NAME', 'Copperway Car Wash');
define('TIMEZONE', 'Africa/Lusaka');

// File upload settings
define('UPLOAD_DIR', 'uploads/payment_screenshots/');
define('MAX_FILE_SIZE', 5242880); // 5MB in bytes

// Generate booking number prefix
define('BOOKING_PREFIX', 'CW');

// Set timezone
date_default_timezone_set(TIMEZONE);

/**
 * Database connection function
 */
function getDBConnection() {
    try {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        
        $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        return $pdo;
    } catch (PDOException $e) {
        // Log error (in production, use proper logging)
        error_log("Database connection failed: " . $e->getMessage());
        die("Database connection failed. Please contact support.");
    }
}

/**
 * Generate unique booking number
 */
function generateBookingNumber() {
    $prefix = BOOKING_PREFIX;
    $date = date('Ymd');
    $random = str_pad(rand(0, 9999), 4, '0', STR_PAD_LEFT);
    return $prefix . $date . $random;
}

/**
 * Send JSON response
 */
function sendJSON($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

/**
 * Validate email
 */
function isValidEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

/**
 * Sanitize input
 */
function sanitizeInput($data) {
    return htmlspecialchars(strip_tags(trim($data)));
}

/**
 * Format currency
 */
function formatCurrency($amount) {
    return number_format($amount, 2);
}

