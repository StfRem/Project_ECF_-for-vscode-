<?php
require_once "Database.php";

header("Content-Type: application/json");

// Récupération des données JSON
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data["id"])) {
    echo json_encode(["success" => false, "message" => "ID manquant"]);
    exit;
}

$id = $data["id"];

try {
    // On récupère l'état actuel
    $stmt = $pdo->prepare("SELECT suspendu FROM users WHERE id = ?");
    $stmt->execute([$id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        echo json_encode(["success" => false, "message" => "Employé introuvable"]);
        exit;
    }

    // On inverse le statut
    $nouvelEtat = $user["suspendu"] ? 0 : 1;

    $update = $pdo->prepare("UPDATE users SET suspendu = ? WHERE id = ?");
    $ok = $update->execute([$nouvelEtat, $id]);

    echo json_encode(["success" => $ok, "suspendu" => $nouvelEtat]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
