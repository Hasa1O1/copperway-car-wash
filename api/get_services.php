<?php
/**
 * API Endpoint: Get Available Services
 * Returns list of active services
 */

require_once __DIR__ . '/../config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

try {
    $pdo = getDBConnection();
    
    $stmt = $pdo->query("SELECT id, name, description, price, duration FROM services WHERE is_active = 1 ORDER BY price ASC");
    $services = $stmt->fetchAll();
    
    sendJSON([
        'success' => true,
        'data' => $services
    ]);
    
} catch (Exception $e) {
    sendJSON([
        'success' => false,
        'message' => 'Failed to fetch services',
        'error' => $e->getMessage()
    ], 500);
}

