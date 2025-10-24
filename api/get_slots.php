<?php
/**
 * API Endpoint: Get Available Time Slots
 * Returns available time slots for a given date
 */

require_once __DIR__ . '/../config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

try {
    $pdo = getDBConnection();
    
    $date = $_GET['date'] ?? date('Y-m-d');
    
    // Validate date format
    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
        sendJSON([
            'success' => false,
            'message' => 'Invalid date format'
        ], 400);
    }
    
    // Get business hours for the day
    $dayOfWeek = date('w', strtotime($date));
    $stmt = $pdo->prepare("SELECT open_time, close_time, is_open FROM business_hours WHERE day_of_week = ?");
    $stmt->execute([$dayOfWeek]);
    $hours = $stmt->fetch();
    
    if (!$hours || !$hours['is_open']) {
        sendJSON([
            'success' => false,
            'message' => 'We are closed on this day'
        ], 400);
    }
    
    // Get existing bookings for the date
    $stmt = $pdo->prepare("SELECT scheduled_time FROM bookings WHERE scheduled_date = ? AND status NOT IN ('cancelled')");
    $stmt->execute([$date]);
    $bookedSlots = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    // Generate available time slots (every 30 minutes)
    $availableSlots = [];
    $startTime = strtotime($hours['open_time']);
    $endTime = strtotime($hours['close_time']);
    
    for ($time = $startTime; $time < $endTime; $time += 1800) { // 1800 seconds = 30 minutes
        $slotTime = date('H:i:s', $time);
        
        // Check if slot is available (not already booked)
        if (!in_array($slotTime, $bookedSlots)) {
            $availableSlots[] = date('H:i', $time);
        }
    }
    
    sendJSON([
        'success' => true,
        'data' => $availableSlots
    ]);
    
} catch (Exception $e) {
    sendJSON([
        'success' => false,
        'message' => 'Failed to fetch time slots',
        'error' => $e->getMessage()
    ], 500);
}

