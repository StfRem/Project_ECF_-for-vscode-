<?php
header("Content-Type: application/json");
require_once "Database.php"; // fichier de connexion PDO

if (!isset($_GET["id"])) {
    echo json_encode([]);
    exit;
}

$userId = $_GET["id"];

// Récupération des commandes de l'utilisateur
$sql = "SELECT * FROM commandes WHERE userId = ?";
$stmt = $pdo->prepare($sql);
$stmt->execute([$userId]);
$commandes = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Décodage JSON des champs historique et avis
foreach ($commandes as &$cmd) {
    $cmd["historique"] = json_decode($cmd["historique"], true);
    $cmd["avis"] = json_decode($cmd["avis"], true);
}

echo json_encode($commandes);