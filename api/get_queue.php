<?php
/**
 * API Endpoint: Get Queue (Current Day)
 * Returns today's confirmed bookings for queue display
 */

require_once __DIR__ . '/../config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

try {
    $pdo = getDBConnection();
    
    $date = $_GET['date'] ?? date('Y-m-d');
    
    $stmt = $pdo->prepare("SELECT b.*, s.name as service_name FROM bookings b JOIN services s ON b.service_id = s.id WHERE b.scheduled_date = ? AND b.status IN ('confirmed', 'in_queue', 'in_progress') ORDER BY b.slot_number ASC, b.scheduled_time ASC");
    $stmt->execute([$date]);
    $queue = $stmt->fetchAll();
    
    // Format the response
    foreach ($queue as &$item) {
        $item['amount_formatted'] = formatCurrency($item['amount']);
        $item['pickup_required'] = (bool)$item['pickup_required'];
    }
    
    sendJSON([
        'success' => true,
        'data' => $queue
    ]);
    
} catch (Exception $e) {
    sendJSON([
        'success' => false,
        'message' => 'Failed to fetch queue',
        'error' => $e->getMessage()
    ], 500);
}

