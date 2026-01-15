<?php
/**
 * TruAi Server - Main Entry Point
 * 
 * HTML Server Version of Tru.ai
 * 
 * @package TruAi
 * @version 1.0.0
 * @copyright My Deme, LLC © 2026
 */

// Load configuration and dependencies
require_once __DIR__ . '/backend/config.php';
require_once __DIR__ . '/backend/database.php';
require_once __DIR__ . '/backend/auth.php';
require_once __DIR__ . '/backend/router.php';

// Session is started in config.php

// Enforce localhost access
Auth::enforceLocalhost();

// Check if this is an API request
$requestUri = $_SERVER['REQUEST_URI'];
if (strpos($requestUri, '/api/') !== false) {
    // Handle API request
    $router = new Router();
    $router->dispatch();
    exit;
}

// Serve frontend
$page = $_GET['page'] ?? 'login';

// Check if security has been acknowledged (temporary solution)
$securityAcknowledged = isset($_SESSION['security_acknowledged']) || 
                        (isset($_COOKIE['security_acknowledged']) && $_COOKIE['security_acknowledged'] === 'true');

if (!$securityAcknowledged && $page !== 'login') {
    $page = 'login';
}

// Set session flag if cookie is present
if (isset($_COOKIE['security_acknowledged']) && $_COOKIE['security_acknowledged'] === 'true') {
    $_SESSION['security_acknowledged'] = true;
}

// Handle acknowledgment (simple POST)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['acknowledge'])) {
    $_SESSION['security_acknowledged'] = true;
    setcookie('security_acknowledged', 'true', time() + (86400 * 30), '/'); // 30 days
    header('Location: /');
    exit;
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= APP_NAME ?> - HTML Server Version</title>
    <link rel="stylesheet" href="assets/css/main.css">
    <link rel="stylesheet" href="assets/css/ide.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            background: #0f1115;
            color: #fff;
            overflow: hidden;
            height: 100vh;
        }

        .loading {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            font-size: 18px;
            color: #888;
        }
    </style>
</head>
<body>
    <div id="app">
        <div class="loading">Loading Tru.ai...</div>
    </div>

    <script>
        // Global configuration
        window.TRUAI_CONFIG = {
            APP_NAME: '<?= APP_NAME ?>',
            APP_VERSION: '<?= APP_VERSION ?>',
            API_BASE: window.location.origin,
            CSRF_TOKEN: '<?= Auth::generateCsrfToken() ?>',
            IS_AUTHENTICATED: <?= $securityAcknowledged ? 'true' : 'false' ?>,
            USERNAME: 'Admin'
        };
    </script>
    
    <script src="assets/js/crypto.js"></script>
    <script src="assets/js/api.js"></script>
    <script src="assets/js/app.js"></script>
    
    <?php if ($securityAcknowledged): ?>
        <script src="assets/js/dashboard.js"></script>
    <?php else: ?>
        <script src="assets/js/login.js"></script>
    <?php endif; ?>
</body>
</html>
