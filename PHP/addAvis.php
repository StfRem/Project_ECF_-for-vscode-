<?php
header("Content-Type: application/json");
require_once "Database.php";

$data = json_decode(file_get_contents("php://input"), true);

$commandeId = $data["commandeId"];
$userId = $data["userId"];
$note = $data["note"];
$commentaire = $data["commentaire"];

// Vérifier la commande
$sql = "SELECT * FROM commandes WHERE id = ? AND userId = ?";
$stmt = $pdo->prepare($sql);
$stmt->execute([$commandeId, $userId]);
$cmd = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$cmd) {
    echo json_encode(["success" => false, "message" => "Commande introuvable"]);
    exit;
}

// Insérer l'avis dans la table avis
$sqlAvis = "
    INSERT INTO avis (commande_id, user_id, nom_client, note, commentaire, date_creation, statut)
    VALUES (:commande_id, :user_id, :nom_client, :note, :commentaire, NOW(), 'en attente')
";

$stmtAvis = $pdo->prepare($sqlAvis);
$stmtAvis->execute([
    "commande_id" => $commandeId,
    "user_id" => $userId,
    "nom_client" => $cmd["client_nom"], // ou le champ exact dans ta table commandes
    "note" => $note,
    "commentaire" => $commentaire
]);

echo json_encode(["success" => true]);
