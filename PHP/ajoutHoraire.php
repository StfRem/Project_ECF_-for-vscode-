<?php
header('Content-Type: application/json');
require_once 'Database.php';

$data = json_decode(file_get_contents("php://input"), true);

$jour = $data["jour"];
$ouverture = $data["ouverture"];
$fermeture = $data["fermeture"];

try {
    $stmt = $pdo->prepare("INSERT INTO horaires (jour, ouverture, fermeture) VALUES (?, ?, ?)");
    $ok = $stmt->execute([$jour, $ouverture, $fermeture]);

    echo json_encode(["success" => $ok]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}