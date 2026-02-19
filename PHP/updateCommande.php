<?php
header("Content-Type: application/json");
require_once "Database.php";

$data = json_decode(file_get_contents("php://input"), true);

$commandeId = $data["commandeId"];
$userId = $data["userId"];
$nb = $data["nbPersonnes"];
$date = $data["datePrestation"];
$heure = $data["heurePrestation"];
$adresse = $data["adresse"];   // correction : adresse
$cp = $data["cp"];
$ville = $data["ville"];
$distance = $data["distance"];

// 1. Récupérer la commande
$sql = "SELECT * FROM commandes WHERE id = ? AND userId = ?";
$stmt = $pdo->prepare($sql);
$stmt->execute([$commandeId, $userId]);
$cmd = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$cmd) {
    echo json_encode(["success" => false, "message" => "Commande introuvable"]);
    exit;
}

// 2. Récupérer le menu
$sqlMenu = "SELECT * FROM menus WHERE id = ?";
$stmtMenu = $pdo->prepare($sqlMenu);
$stmtMenu->execute([$cmd["menuId"]]);
$menu = $stmtMenu->fetch(PDO::FETCH_ASSOC);

if (!$menu) {
    echo json_encode(["success" => false, "message" => "Menu introuvable"]);
    exit;
}

// 3. Recalculé le prix
$prixBase = $menu["prix"];
$personnesMin = $menu["personnesMin"];

$total = $nb * ($prixBase / $personnesMin);

if ($nb >= $personnesMin + 5) {
    $total *= 0.9; // réduction 10%
}

$fraisLivraison = 5;
if (strtolower($ville) !== "bordeaux") {
    $fraisLivraison += $distance * 0.59;
}

$total += $fraisLivraison;

// 4. Mise à jour historique
$historique = json_decode($cmd["historique"] ?? "[]", true);
if (!is_array($historique)) {
    $historique = [];
}

$historique[] = [
    "date" => date("c"),
    "action" => "Commande modifiée par l'utilisateur"
];

// 5. Mise à jour SQL
$sqlUpdate = "UPDATE commandes SET 
    nbPersonnes = ?, 
    prixTotal = ?, 
    datePrestation = ?, 
    heurePrestation = ?, 
    adresse = ?,
    cp = ?, 
    ville = ?, 
    distance = ?, 
    historique = ?
    WHERE id = ? AND userId = ?";

$stmtUpdate = $pdo->prepare($sqlUpdate);
$stmtUpdate->execute([
    $nb,
    $total,
    $date,
    $heure,
    $adresse,
    $cp,
    $ville,
    $distance,
    json_encode($historique),
    $commandeId,
    $userId
]);

echo json_encode(["success" => true]);
