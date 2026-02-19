<?php
header('Content-Type: application/json');
require_once 'Database.php';

$data = json_decode(file_get_contents("php://input"), true);

$id = $data["id"];

try {
    $stmt = $pdo->prepare("DELETE FROM horaires WHERE id = ?");
    $ok = $stmt->execute([$id]);

    echo json_encode(["success" => $ok]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}