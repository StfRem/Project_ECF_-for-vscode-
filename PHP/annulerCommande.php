<?php
header("Content-Type: application/json");
require_once "Database.php";

$data = json_decode(file_get_contents("php://input"), true);

$commandeId = $data["commandeId"];
$userId = $data["userId"];

// 1. Récupérer la commande
$sql = "SELECT * FROM commandes WHERE id = ? AND userId = ?";
$stmt = $pdo->prepare($sql);
$stmt->execute([$commandeId, $userId]);
$cmd = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$cmd) {
    echo json_encode(["success" => false, "message" => "Commande introuvable"]);
    exit;
}

// 2. Ajouter historique
$historique = json_decode($cmd["historique"], true);
$historique[] = [
    "date" => date("c"),
    "action" => "Commande annulée par l'utilisateur"
];

// 3. Mise à jour SQL
$sqlUpdate = "UPDATE commandes SET statut = 'annulée', historique = ? WHERE id = ? AND userId = ?";
$stmtUpdate = $pdo->prepare($sqlUpdate);
$stmtUpdate->execute([json_encode($historique), $commandeId, $userId]);

echo json_encode(["success" => true]);