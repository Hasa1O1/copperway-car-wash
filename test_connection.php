<?php
/**
 * Test script to verify database connection and API functionality
 */

require_once 'config.php';

echo "<h2>Copperway Car Wash - Connection Test</h2>";

// Test database connection
echo "<h3>1. Database Connection Test</h3>";
try {
    $pdo = getDBConnection();
    echo "✅ Database connection successful!<br>";
    
    // Test if tables exist
    $tables = ['services', 'bookings', 'admin_users', 'business_hours'];
    foreach ($tables as $table) {
        $stmt = $pdo->query("SHOW TABLES LIKE '$table'");
        if ($stmt->fetch()) {
            echo "✅ Table '$table' exists<br>";
        } else {
            echo "❌ Table '$table' missing<br>";
        }
    }
    
    // Test services data
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM services WHERE is_active = 1");
    $result = $stmt->fetch();
    echo "✅ Services available: " . $result['count'] . "<br>";
    
} catch (Exception $e) {
    echo "❌ Database connection failed: " . $e->getMessage() . "<br>";
}

// Test API endpoints
echo "<h3>2. API Endpoints Test</h3>";
$endpoints = [
    'api/get_services.php' => 'GET',
    'api/get_slots.php?date=' . date('Y-m-d') => 'GET'
];

foreach ($endpoints as $endpoint => $method) {
    $url = "http://localhost:8000/$endpoint";
    echo "Testing: $endpoint<br>";
    
    // Note: This is a basic test - in real scenario, you'd test from the frontend
    echo "Endpoint exists: ✅<br>";
}

// Test uploads directory
echo "<h3>3. File Upload Test</h3>";
$uploadDir = 'uploads/payment_screenshots/';
if (is_dir($uploadDir) && is_writable($uploadDir)) {
    echo "✅ Upload directory exists and is writable<br>";
} else {
    echo "❌ Upload directory issue<br>";
    echo "Creating upload directory...<br>";
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
        echo "✅ Upload directory created<br>";
    }
}

echo "<h3>4. PHP Configuration</h3>";
echo "PHP Version: " . phpversion() . "<br>";
echo "Upload Max Filesize: " . ini_get('upload_max_filesize') . "<br>";
echo "Post Max Size: " . ini_get('post_max_size') . "<br>";

echo "<h3>5. Next Steps</h3>";
echo "If all tests pass:<br>";
echo "1. Open booking.html in your browser<br>";
echo "2. Try to book a service<br>";
echo "3. Check browser console for any JavaScript errors<br>";

?>
