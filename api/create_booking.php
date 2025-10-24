<?php
/**
 * API Endpoint: Create Booking
 * Creates a new booking and returns booking number
 */

require_once __DIR__ . '/../config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

try {
    $pdo = getDBConnection();
    
    // Get POST data
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Validate required fields
    $required = ['customer_name', 'customer_phone', 'vehicle_model', 'vehicle_number_plate', 'service_id', 'scheduled_date', 'scheduled_time'];
    foreach ($required as $field) {
        if (empty($input[$field])) {
            sendJSON([
                'success' => false,
                'message' => "Field '$field' is required"
            ], 400);
        }
    }
    
    // Get service details
    $stmt = $pdo->prepare("SELECT id, price, duration FROM services WHERE id = ? AND is_active = 1");
    $stmt->execute([$input['service_id']]);
    $service = $stmt->fetch();
    
    if (!$service) {
        sendJSON([
            'success' => false,
            'message' => 'Invalid service selected'
        ], 400);
    }
    
    // Generate unique booking number
    $bookingNumber = generateBookingNumber();
    
    // Ensure booking number is unique
    $stmt = $pdo->prepare("SELECT id FROM bookings WHERE booking_number = ?");
    $stmt->execute([$bookingNumber]);
    while ($stmt->fetch()) {
        $bookingNumber = generateBookingNumber();
        $stmt->execute([$bookingNumber]);
    }
    
    // Prepare booking data
    $bookingData = [
        'booking_number' => $bookingNumber,
        'customer_name' => sanitizeInput($input['customer_name']),
        'customer_phone' => sanitizeInput($input['customer_phone']),
        'customer_email' => !empty($input['customer_email']) ? sanitizeInput($input['customer_email']) : null,
        'vehicle_model' => sanitizeInput($input['vehicle_model']),
        'vehicle_number_plate' => sanitizeInput($input['vehicle_number_plate']),
        'service_id' => $service['id'],
        'scheduled_date' => $input['scheduled_date'],
        'scheduled_time' => $input['scheduled_time'],
        'pickup_required' => !empty($input['pickup_required']) ? 1 : 0,
        'pickup_address' => !empty($input['pickup_address']) ? sanitizeInput($input['pickup_address']) : null,
        'dropoff_address' => !empty($input['dropoff_address']) ? sanitizeInput($input['dropoff_address']) : null,
        'amount' => $service['price'],
        'status' => 'pending_payment'
    ];
    
    // Insert booking
    $stmt = $pdo->prepare("INSERT INTO bookings (booking_number, customer_name, customer_phone, customer_email, vehicle_model, vehicle_number_plate, service_id, scheduled_date, scheduled_time, pickup_required, pickup_address, dropoff_address, amount, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    
    $stmt->execute([
        $bookingData['booking_number'],
        $bookingData['customer_name'],
        $bookingData['customer_phone'],
        $bookingData['customer_email'],
        $bookingData['vehicle_model'],
        $bookingData['vehicle_number_plate'],
        $bookingData['service_id'],
        $bookingData['scheduled_date'],
        $bookingData['scheduled_time'],
        $bookingData['pickup_required'],
        $bookingData['pickup_address'],
        $bookingData['dropoff_address'],
        $bookingData['amount'],
        $bookingData['status']
    ]);
    
    $bookingId = $pdo->lastInsertId();
    
    sendJSON([
        'success' => true,
        'message' => 'Booking created successfully',
        'data' => [
            'booking_id' => $bookingId,
            'booking_number' => $bookingNumber,
            'amount' => $service['price']
        ]
    ], 201);
    
} catch (Exception $e) {
    sendJSON([
        'success' => false,
        'message' => 'Failed to create booking',
        'error' => $e->getMessage()
    ], 500);
}

