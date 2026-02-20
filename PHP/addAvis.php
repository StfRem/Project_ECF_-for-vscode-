<?php
// On s'assure qu'aucune erreur de texte ne s'affiche avant le JSON
ini_set('display_errors', 0);
header("Content-Type: application/json; charset=utf-8");
require_once "Database.php";

try {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data["commandeId"], $data["userId"], $data["note"], $data["commentaire"])) {
        echo json_encode(["success" => false, "message" => "Données incomplètes"]);
        exit;
    }

    $commandeId = $data["commandeId"];
    $userId = $data["userId"];
    $note = $data["note"];
    $commentaire = $data["commentaire"];

    // 1. On récupère le nom réel du client depuis la table 'users'
    $stmtUser = $pdo->prepare("SELECT fullname FROM users WHERE id = ?");
    $stmtUser->execute([$userId]);
    $userRow = $stmtUser->fetch();
    $nomClient = $userRow ? $userRow['fullname'] : "Client Inconnu";

    // 2. On génère un ID unique car ta table utilise un VARCHAR(50) pour 'id'
    $uniqueAvisId = "AV-" . bin2hex(random_bytes(8));

    // 3. Insertion avec l'ID généré et le nom récupéré
    $sqlAvis = "
        INSERT INTO avis (id, commande_id, user_id, nom_client, note, commentaire, date_creation, statut)
        VALUES (:id, :commande_id, :user_id, :nom_client, :note, :commentaire, NOW(), 'en attente')
    ";

    $stmtAvis = $pdo->prepare($sqlAvis);
    $success = $stmtAvis->execute([
        "id" => $uniqueAvisId,
        "commande_id" => $commandeId,
        "user_id" => $userId,
        "nom_client" => $nomClient,
        "note" => $note,
        "commentaire" => $commentaire
    ]);

    echo json_encode(["success" => true]);

} catch (Exception $e) {
    // Si ça plante, on renvoie l'erreur proprement en JSON
    echo json_encode([
        "success" => false, 
        "message" => "Erreur technique : " . $e->getMessage()
    ]);
}