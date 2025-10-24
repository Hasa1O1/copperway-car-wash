<?php
/**
 * Automatic Database Setup Script
 * This script will create database and import all tables automatically
 */

// Database configuration
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'copperway_carwash');

echo "Starting automatic database setup...\n\n";

try {
    // Connect to MySQL server (without database)
    $pdo = new PDO("mysql:host=" . DB_HOST, DB_USER, DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "[✓] Connected to MySQL server\n";
    
    // Create database if it doesn't exist
    echo "[1/4] Creating database...\n";
    $pdo->exec("CREATE DATABASE IF NOT EXISTS " . DB_NAME . " CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    echo "[✓] Database created successfully\n\n";
    
    // Connect to the database
    $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME, DB_USER, DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "[✓] Connected to database\n\n";
    
    // Read and execute SQL file
    echo "[2/4] Reading database.sql...\n";
    $sqlFile = __DIR__ . '/database.sql';
    
    if (!file_exists($sqlFile)) {
        throw new Exception("database.sql file not found!");
    }
    
    $sql = file_get_contents($sqlFile);
    
    // Remove the CREATE DATABASE and USE statements
    $sql = preg_replace('/CREATE DATABASE IF NOT EXISTS.*?;/s', '', $sql);
    $sql = preg_replace('/USE.*?;/s', '', $sql);
    
    // Split by semicolons and execute each statement
    $statements = explode(';', $sql);
    
    echo "[3/4] Creating tables...\n";
    $tableCount = 0;
    foreach ($statements as $statement) {
        $statement = trim($statement);
        if (!empty($statement)) {
            try {
                $pdo->exec($statement);
                // Count CREATE TABLE statements
                if (stripos($statement, 'CREATE TABLE') !== false) {
                    $tableCount++;
                }
            } catch (PDOException $e) {
                // Ignore table already exists errors
                if (strpos($e->getMessage(), 'already exists') === false) {
                    echo "[!] Warning: " . $e->getMessage() . "\n";
                }
            }
        }
    }
    
    echo "[✓] Tables created successfully ($tableCount tables)\n\n";
    
    // Verify tables
    echo "[4/4] Verifying setup...\n";
    $tables = ['services', 'bookings', 'admin_users', 'business_hours', 'location_settings', 'queue_history'];
    $verifiedTables = 0;
    
    foreach ($tables as $table) {
        $stmt = $pdo->query("SHOW TABLES LIKE '$table'");
        if ($stmt->fetch()) {
            echo "[✓] Table '$table' exists\n";
            $verifiedTables++;
        }
    }
    
    // Check services data
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM services");
    $result = $stmt->fetch();
    $serviceCount = $result['count'];
    
    // Check admin users
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM admin_users");
    $result = $stmt->fetch();
    $adminCount = $result['count'];
    
    echo "\n";
    echo "========================================\n";
    echo "Setup Complete!\n";
    echo "========================================\n";
    echo "Database: " . DB_NAME . "\n";
    echo "Tables: $verifiedTables verified\n";
    echo "Services: $serviceCount\n";
    echo "Admin users: $adminCount\n";
    echo "\n";
    echo "Access your application:\n";
    echo "Home: http://localhost/copperway-carwash/\n";
    echo "Booking: http://localhost/copperway-carwash/booking.html\n";
    echo "Admin: http://localhost/copperway-carwash/admin_login.html\n";
    echo "\n";
    echo "Admin credentials:\n";
    echo "Username: admin\n";
    echo "Password: admin123\n";
    echo "\n";
    
} catch (PDOException $e) {
    echo "[✗] Error: " . $e->getMessage() . "\n";
    echo "\n";
    echo "Please make sure:\n";
    echo "1. MySQL is running in XAMPP\n";
    echo "2. Database credentials are correct\n";
    echo "3. You have proper permissions\n";
    exit(1);
} catch (Exception $e) {
    echo "[✗] Error: " . $e->getMessage() . "\n";
    exit(1);
}
?>
