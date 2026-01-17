<?php
// /su endpoint for safe Voluum redirects

// 1. Validate 'rxy' parameter exists
if (!isset($_GET['rxy']) || empty($_GET['rxy'])) {
    http_response_code(400);
    exit;
}

// 2. URL-decode the destination
$dest = urldecode($_GET['rxy']);

// 3. Whitelist allowed Voluum domains (including your custom domain)
$allowed_domains = [
    <?php
    'voluum.com',
    'voluumrtb.com',
    'voluum.click',
    'prizonomyprecigner.com', // your tracking domain
];

// Parse destination host
$parsed = parse_url($dest);
if (!isset($parsed['host'])) {
    http_response_code(400);
    exit;
}

// Check if host ends with an allowed domain
$valid = false;
foreach ($allowed_domains as $domain) {
    if (substr($parsed['host'], -strlen($domain)) === $domain) {
        $valid = true;
        break;
    }
}
if (!$valid) {
    http_response_code(403);
    exit;
}

// 4. Preserve full query string (already included in $dest)

// 5. Redirect with HTTP 302
header('Location: ' . $dest, true, 302);
exit;
?>
