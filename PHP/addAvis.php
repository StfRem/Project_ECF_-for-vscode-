<?php
header("Content-Type: application/json; charset=utf-8");
require_once "Database.php";

// On empêche les warnings de polluer le retour JSON
error_reporting(0);
ini_set('display_errors', 0);

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data["commandeId"], $data["userId"])) {
    echo json_encode(["success" => false, "message" => "Données incomplètes"]);
    exit;
}

$commandeId = $data["commandeId"];
$userId = $data["userId"];
$note = $data["note"];
$commentaire = $data["commentaire"];

try {
    // 1. On récupère le nom du client dans la table USERS
    $stmtUser = $pdo->prepare("SELECT fullname FROM users WHERE id = ?");
    $stmtUser->execute([$userId]);
    $userRow = $stmtUser->fetch();
    
    $nomClient = $userRow ? $userRow['fullname'] : "Client inconnu";

    // 2. On insère l'avis (l'id est auto-incrémenté par MySQL)
    $sqlAvis = "INSERT INTO avis (commande_id, user_id, nom_client, note, commentaire, date_creation, statut)
                VALUES (:cid, :uid, :nom, :note, :comm, NOW(), 'en attente')";
    
    $stmtAvis = $pdo->prepare($sqlAvis);
    $stmtAvis->execute([
        "cid"  => $commandeId,
        "uid"  => $userId,
        "nom"  => $nomClient,
        "note" => $note,
        "comm" => $commentaire
    ]);

    echo json_encode(["success" => true]);

} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Erreur SQL : " . $e->getMessage()]);
}

// 3. Une fois l'avis ajouté le bouton disparait
    $stmtUpdate = $pdo->prepare("UPDATE commandes SET avis = ? WHERE id = ?");
    $stmtUpdate->execute([
        json_encode(["note" => $note, "commentaire" => $commentaire, "date" => date("c")]),
        $commandeId
    ]);