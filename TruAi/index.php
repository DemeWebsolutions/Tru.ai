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
$auth = new Auth();

if (!$auth->isAuthenticated() && $page !== 'login') {
    $page = 'login';
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= APP_NAME ?> - HTML Server Version</title>
    <link rel="stylesheet" href="/TruAi/assets/css/main.css">
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
            API_BASE: window.location.origin + '/TruAi',
            CSRF_TOKEN: '<?= Auth::generateCsrfToken() ?>',
            IS_AUTHENTICATED: <?= $auth->isAuthenticated() ? 'true' : 'false' ?>,
            USERNAME: '<?= $auth->getUsername() ?? '' ?>'
        };
    </script>
    
    <script src="/TruAi/assets/js/crypto.js"></script>
    <script src="/TruAi/assets/js/api.js"></script>
    <script src="/TruAi/assets/js/app.js"></script>
    
    <?php if ($auth->isAuthenticated()): ?>
        <script src="/TruAi/assets/js/dashboard.js"></script>
    <?php else: ?>
        <script src="/TruAi/assets/js/login.js"></script>
    <?php endif; ?>
</body>
</html>
