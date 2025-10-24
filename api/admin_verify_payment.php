<?php
/**
 * API Endpoint: Verify Payment
 * Admin verifies payment and confirms booking
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
    $paymentMethod = $input['payment_method'] ?? null;
    $notes = $input['notes'] ?? null;
    
    if (!$bookingId) {
        sendJSON([
            'success' => false,
            'message' => 'Booking ID is required'
        ], 400);
    }
    
    // Get booking details
    $stmt = $pdo->prepare("SELECT id, booking_number, scheduled_date FROM bookings WHERE id = ?");
    $stmt->execute([$bookingId]);
    $booking = $stmt->fetch();
    
    if (!$booking) {
        sendJSON([
            'success' => false,
            'message' => 'Booking not found'
        ], 404);
    }
    
    // Get the next slot number for the day
    $stmt = $pdo->prepare("SELECT MAX(slot_number) as max_slot FROM bookings WHERE scheduled_date = ? AND slot_number IS NOT NULL");
    $stmt->execute([$booking['scheduled_date']]);
    $result = $stmt->fetch();
    $nextSlot = ($result['max_slot'] ?? 0) + 1;
    
    // Update booking status
    $stmt = $pdo->prepare("UPDATE bookings SET payment_confirmed = 1, payment_method = ?, payment_notes = ?, status = 'confirmed', slot_number = ? WHERE id = ?");
    $stmt->execute([$paymentMethod, $notes, $nextSlot, $bookingId]);
    
    // Log status change
    $stmt = $pdo->prepare("INSERT INTO queue_history (booking_id, status_change, changed_by, notes) VALUES (?, 'confirmed', ?, ?)");
    $stmt->execute([$bookingId, $_SESSION['admin_id'], 'Payment verified by admin']);
    
    sendJSON([
        'success' => true,
        'message' => 'Payment verified successfully',
        'data' => [
            'booking_number' => $booking['booking_number'],
            'slot_number' => $nextSlot
        ]
    ]);
    
} catch (Exception $e) {
    sendJSON([
        'success' => false,
        'message' => 'Failed to verify payment',
        'error' => $e->getMessage()
    ], 500);
}

