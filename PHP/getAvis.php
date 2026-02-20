<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'Database.php';

try {
    // Récupère uniquement les avis en attente de modération
    $query = $pdo->query("SELECT * FROM avis WHERE statut = 'en attente' ORDER BY date_creation DESC");
    $avis = $query->fetchAll();

    echo json_encode(["status" => "success", "data" => $avis]);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}