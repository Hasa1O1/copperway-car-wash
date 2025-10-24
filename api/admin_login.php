<?php
/**
 * API Endpoint: Admin Login
 * Authenticates admin users
 */

require_once __DIR__ . '/../config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

session_start();

try {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $username = $input['username'] ?? null;
    $password = $input['password'] ?? null;
    
    if (!$username || !$password) {
        sendJSON([
            'success' => false,
            'message' => 'Username and password are required'
        ], 400);
    }
    
    $pdo = getDBConnection();
    
    $stmt = $pdo->prepare("SELECT id, username, password, full_name, email, role, is_active FROM admin_users WHERE username = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch();
    
    if (!$user || !password_verify($password, $user['password'])) {
        sendJSON([
            'success' => false,
            'message' => 'Invalid username or password'
        ], 401);
    }
    
    if (!$user['is_active']) {
        sendJSON([
            'success' => false,
            'message' => 'Account is inactive'
        ], 403);
    }
    
    // Update last login
    $stmt = $pdo->prepare("UPDATE admin_users SET last_login = NOW() WHERE id = ?");
    $stmt->execute([$user['id']]);
    
    // Set session
    $_SESSION['admin_id'] = $user['id'];
    $_SESSION['admin_username'] = $user['username'];
    $_SESSION['admin_role'] = $user['role'];
    
    sendJSON([
        'success' => true,
        'message' => 'Login successful',
        'data' => [
            'id' => $user['id'],
            'username' => $user['username'],
            'full_name' => $user['full_name'],
            'role' => $user['role']
        ]
    ]);
    
} catch (Exception $e) {
    sendJSON([
        'success' => false,
        'message' => 'Login failed',
        'error' => $e->getMessage()
    ], 500);
}

