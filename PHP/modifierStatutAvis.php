<?php
header('Content-Type: application/json');
require_once 'Database.php';

$data = json_decode(file_get_contents("php://input"), true);
$id = $data['id'];
$action = $data['action']; // 'valider' ou 'supprimer'

try {
    if ($action === 'valider') {
        $stmt = $pdo->prepare("UPDATE avis SET statut = 'validé' WHERE id = ?");
        $stmt->execute([$id]);
    } else {
        $stmt = $pdo->prepare("DELETE FROM avis WHERE id = ?");
        $stmt->execute([$id]);
    }
    echo json_encode(["success" => true]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}