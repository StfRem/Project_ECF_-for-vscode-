<?php
header('Content-Type: application/json');
require_once 'Database.php';

try {
    $query = $pdo->query("
        SELECT c.*, u.fullname AS client_nom, u.email AS client_email
        FROM commandes c
        LEFT JOIN users u ON c.userId = u.id
        ORDER BY c.id DESC
    ");

    $commandes = $query->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => "success",
        "data" => $commandes
    ]);
} catch (PDOException $e) {
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}
