<?php
header('Content-Type: application/json');
require_once 'Database.php';

$data = json_decode(file_get_contents("php://input"), true);

$id = $data["id"];
$jour = $data["jour"];
$ouverture = $data["ouverture"];
$fermeture = $data["fermeture"];

try {
    $stmt = $pdo->prepare("UPDATE horaires SET jour = ?, ouverture = ?, fermeture = ? WHERE id = ?");
    $ok = $stmt->execute([$jour, $ouverture, $fermeture, $id]);

    echo json_encode(["success" => $ok]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}