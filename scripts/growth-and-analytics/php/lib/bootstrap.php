<?php

declare(strict_types=1);

function loadConfig(): array
{
    $path = __DIR__ . '/../config.php';
    if (!is_file($path)) {
        throw new RuntimeException('Missing config.php — add it next to sync_yesterday.php');
    }

    /** @var array $config */
    $config = require $path;
    date_default_timezone_set($config['timezone'] ?? 'UTC');

    return $config;
}

function logLine(string $message): void
{
    $line = '[' . date('Y-m-d H:i:s') . '] ' . $message . PHP_EOL;
    if (PHP_SAPI === 'cli') {
        fwrite(STDOUT, $line);
        return;
    }
    echo $line;
}

function httpJson(string $method, string $url, ?array $body, array $headers = []): array
{
    $ch = curl_init($url);
    if ($ch === false) {
        throw new RuntimeException('curl_init failed');
    }

    $requestHeaders = array_merge(['Content-Type: application/json'], $headers);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CUSTOMREQUEST => $method,
        CURLOPT_HTTPHEADER => $requestHeaders,
        CURLOPT_TIMEOUT => 120,
    ]);

    if ($body !== null) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body, JSON_THROW_ON_ERROR));
    }

    $raw = curl_exec($ch);
    if ($raw === false) {
        $error = curl_error($ch);
        curl_close($ch);
        throw new RuntimeException('HTTP request failed: ' . $error);
    }

    $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    /** @var array $json */
    $json = json_decode($raw, true) ?? [];

    if ($status >= 400) {
        $message = is_string($json['message'] ?? null)
            ? $json['message']
            : (is_string($json['error']['message'] ?? null)
                ? $json['error']['message']
                : 'HTTP ' . $status);
        throw new RuntimeException($message);
    }

    return $json;
}
