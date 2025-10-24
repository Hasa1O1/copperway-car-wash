<?php
/**
 * Database Setup Script for Copperway Car Wash
 * Run this script to automatically set up the database
 */

// Database configuration
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'copperway_carwash');

echo "<h2>Copperway Car Wash - Database Setup</h2>";
echo "<style>body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; } .success { color: green; } .error { color: red; } .info { color: blue; }</style>";

try {
    // Connect to MySQL server (without database)
    $pdo = new PDO("mysql:host=" . DB_HOST, DB_USER, DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "<p class='info'>✓ Connected to MySQL server</p>";
    
    // Create database if it doesn't exist
    echo "<p>Creating database...</p>";
    $pdo->exec("CREATE DATABASE IF NOT EXISTS " . DB_NAME . " CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    echo "<p class='success'>✓ Database created successfully</p>";
    
    // Connect to the database
    $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME, DB_USER, DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "<p class='info'>✓ Connected to database</p>";
    
    // Read and execute SQL file
    echo "<p>Reading database.sql...</p>";
    $sql = file_get_contents('database.sql');
    
    // Remove the CREATE DATABASE and USE statements
    $sql = preg_replace('/CREATE DATABASE IF NOT EXISTS.*?;/', '', $sql);
    $sql = preg_replace('/USE.*?;/', '', $sql);
    
    // Split by semicolons and execute each statement
    $statements = explode(';', $sql);
    
    foreach ($statements as $statement) {
        $statement = trim($statement);
        if (!empty($statement)) {
            try {
                $pdo->exec($statement);
            } catch (PDOException $e) {
                // Ignore table already exists errors
                if (strpos($e->getMessage(), 'already exists') === false) {
                    echo "<p class='error'>Error: " . $e->getMessage() . "</p>";
                }
            }
        }
    }
    
    echo "<p class='success'>✓ Database tables created successfully</p>";
    
    // Verify tables
    echo "<p>Verifying tables...</p>";
    $tables = ['services', 'bookings', 'admin_users', 'business_hours', 'location_settings'];
    foreach ($tables as $table) {
        $stmt = $pdo->query("SHOW TABLES LIKE '$table'");
        if ($stmt->fetch()) {
            echo "<p class='success'>✓ Table '$table' exists</p>";
        } else {
            echo "<p class='error'>✗ Table '$table' missing</p>";
        }
    }
    
    // Check services data
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM services");
    $result = $stmt->fetch();
    echo "<p class='info'>✓ Services in database: " . $result['count'] . "</p>";
    
    // Check admin users
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM admin_users");
    $result = $stmt->fetch();
    echo "<p class='info'>✓ Admin users: " . $result['count'] . "</p>";
    
    echo "<hr>";
    echo "<h3>Setup Complete!</h3>";
    echo "<p><strong>Your database is ready!</strong></p>";
    echo "<p><a href='index.html'>Go to Home Page</a></p>";
    echo "<p><a href='booking.html'>Go to Booking Page</a></p>";
    echo "<p><a href='test_connection.php'>Test Connection</a></p>";
    
} catch (PDOException $e) {
    echo "<p class='error'>Error: " . $e->getMessage() . "</p>";
    echo "<p>Please make sure:</p>";
    echo "<ul>";
    echo "<li>MySQL is running in XAMPP</li>";
    echo "<li>Database credentials are correct</li>";
    echo "<li>You have proper permissions</li>";
    echo "</ul>";
}
?>
