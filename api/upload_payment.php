<?php
/**
 * API Endpoint: Upload Payment Screenshot
 * Handles file upload for payment confirmation
 */

require_once __DIR__ . '/../config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

try {
    $pdo = getDBConnection();
    
    $bookingNumber = $_POST['booking_number'] ?? null;
    
    if (!$bookingNumber) {
        sendJSON([
            'success' => false,
            'message' => 'Booking number is required'
        ], 400);
    }
    
    // Check if booking exists
    $stmt = $pdo->prepare("SELECT id FROM bookings WHERE booking_number = ?");
    $stmt->execute([$bookingNumber]);
    $booking = $stmt->fetch();
    
    if (!$booking) {
        sendJSON([
            'success' => false,
            'message' => 'Booking not found'
        ], 404);
    }
    
    // Handle file upload
    if (!isset($_FILES['payment_screenshot'])) {
        sendJSON([
            'success' => false,
            'message' => 'No file uploaded'
        ], 400);
    }
    
    $file = $_FILES['payment_screenshot'];
    
    // Validate file
    if ($file['error'] !== UPLOAD_ERR_OK) {
        sendJSON([
            'success' => false,
            'message' => 'File upload error'
        ], 400);
    }
    
    if ($file['size'] > MAX_FILE_SIZE) {
        sendJSON([
            'success' => false,
            'message' => 'File size exceeds maximum allowed (5MB)'
        ], 400);
    }
    
    // Create upload directory if it doesn't exist
    if (!is_dir(UPLOAD_DIR)) {
        mkdir(UPLOAD_DIR, 0755, true);
    }
    
    // Generate unique filename
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = $bookingNumber . '_' . time() . '.' . $extension;
    $filepath = UPLOAD_DIR . $filename;
    
    // Move uploaded file
    if (!move_uploaded_file($file['tmp_name'], $filepath)) {
        sendJSON([
            'success' => false,
            'message' => 'Failed to save file'
        ], 500);
    }
    
    // Update booking with payment screenshot
    $stmt = $pdo->prepare("UPDATE bookings SET payment_screenshot = ? WHERE booking_number = ?");
    $stmt->execute([$filepath, $bookingNumber]);
    
    sendJSON([
        'success' => true,
        'message' => 'Payment screenshot uploaded successfully',
        'data' => [
            'file_path' => $filepath
        ]
    ]);
    
} catch (Exception $e) {
    sendJSON([
        'success' => false,
        'message' => 'Failed to upload payment screenshot',
        'error' => $e->getMessage()
    ], 500);
}

