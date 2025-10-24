<?php
/**
 * API Endpoint: Update Booking Status
 * Admin updates booking status (in_progress, completed, etc.)
 */

require_once __DIR__ . '/../config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

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
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    $bookingId = $input['booking_id'] ?? null;
    $status = $input['status'] ?? null;
    $notes = $input['notes'] ?? null;
    
    if (!$bookingId || !$status) {
        sendJSON([
            'success' => false,
            'message' => 'Booking ID and status are required'
        ], 400);
    }
    
    // Validate status
    $validStatuses = ['pending_payment', 'payment_verified', 'confirmed', 'in_queue', 'in_progress', 'completed', 'cancelled'];
    if (!in_array($status, $validStatuses)) {
        sendJSON([
            'success' => false,
            'message' => 'Invalid status'
        ], 400);
    }
    
    // Update booking status
    $stmt = $pdo->prepare("UPDATE bookings SET status = ? WHERE id = ?");
    $stmt->execute([$status, $bookingId]);
    
    // Log status change
    $stmt = $pdo->prepare("INSERT INTO queue_history (booking_id, status_change, changed_by, notes) VALUES (?, ?, ?, ?)");
    $stmt->execute([$bookingId, $status, $_SESSION['admin_id'], $notes]);
    
    // If completed, set completed_at timestamp
    if ($status === 'completed') {
        $stmt = $pdo->prepare("UPDATE bookings SET completed_at = NOW() WHERE id = ?");
        $stmt->execute([$bookingId]);
    }
    
    sendJSON([
        'success' => true,
        'message' => 'Booking status updated successfully'
    ]);
    
} catch (Exception $e) {
    sendJSON([
        'success' => false,
        'message' => 'Failed to update booking status',
        'error' => $e->getMessage()
    ], 500);
}

