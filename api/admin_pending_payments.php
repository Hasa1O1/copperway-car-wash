<?php
/**
 * API Endpoint: Get Pending Payments
 * Returns bookings awaiting payment verification
 */

require_once __DIR__ . '/../config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

session_start();

// Check if admin is logged in
if (!isset($_SESSION['admin_id'])) {
    sendJSON([
        'success' => false,
        'message' => 'Unauthorized'
    ], 401);
}

try {
    $pdo = getDBConnection();
    
    $stmt = $pdo->query("SELECT b.*, s.name as service_name FROM bookings b JOIN services s ON b.service_id = s.id WHERE b.status = 'pending_payment' ORDER BY b.created_at DESC");
    $bookings = $stmt->fetchAll();
    
    // Format the response
    foreach ($bookings as &$booking) {
        $booking['amount_formatted'] = formatCurrency($booking['amount']);
        $booking['pickup_required'] = (bool)$booking['pickup_required'];
    }
    
    sendJSON([
        'success' => true,
        'data' => $bookings
    ]);
    
} catch (Exception $e) {
    sendJSON([
        'success' => false,
        'message' => 'Failed to fetch pending payments',
        'error' => $e->getMessage()
    ], 500);
}

