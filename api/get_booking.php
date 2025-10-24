<?php
/**
 * API Endpoint: Get Booking Status
 * Returns booking details by booking number or phone
 */

require_once __DIR__ . '/../config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

try {
    $pdo = getDBConnection();
    
    $bookingNumber = $_GET['booking_number'] ?? null;
    $phone = $_GET['phone'] ?? null;
    
    if (!$bookingNumber && !$phone) {
        sendJSON([
            'success' => false,
            'message' => 'Booking number or phone number is required'
        ], 400);
    }
    
    // Build query based on available parameters
    if ($bookingNumber && $phone) {
        $stmt = $pdo->prepare("SELECT b.*, s.name as service_name, s.duration FROM bookings b JOIN services s ON b.service_id = s.id WHERE b.booking_number = ? AND b.customer_phone = ?");
        $stmt->execute([$bookingNumber, $phone]);
    } elseif ($bookingNumber) {
        $stmt = $pdo->prepare("SELECT b.*, s.name as service_name, s.duration FROM bookings b JOIN services s ON b.service_id = s.id WHERE b.booking_number = ?");
        $stmt->execute([$bookingNumber]);
    } else {
        $stmt = $pdo->prepare("SELECT b.*, s.name as service_name, s.duration FROM bookings b JOIN services s ON b.service_id = s.id WHERE b.customer_phone = ? ORDER BY b.created_at DESC LIMIT 10");
        $stmt->execute([$phone]);
    }
    
    $bookings = $stmt->fetchAll();
    
    if (empty($bookings)) {
        sendJSON([
            'success' => false,
            'message' => 'No booking found'
        ], 404);
    }
    
    // Format the response
    foreach ($bookings as &$booking) {
        $booking['amount_formatted'] = formatCurrency($booking['amount']);
        $booking['pickup_required'] = (bool)$booking['pickup_required'];
        $booking['payment_confirmed'] = (bool)$booking['payment_confirmed'];
    }
    
    sendJSON([
        'success' => true,
        'data' => count($bookings) === 1 ? $bookings[0] : $bookings
    ]);
    
} catch (Exception $e) {
    sendJSON([
        'success' => false,
        'message' => 'Failed to fetch booking',
        'error' => $e->getMessage()
    ], 500);
}

