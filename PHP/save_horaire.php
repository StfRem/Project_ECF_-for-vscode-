<?php
header('Content-Type: application/json');
require_once 'Database.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['jour'], $data['ouverture'], $data['fermeture'])) {
    echo json_encode(["status" => "error", "message" => "Champs manquants"]);
    exit;
}

try {
    // Si ID existe → UPDATE
    if (!empty($data['id'])) {
        $query = $pdo->prepare("
            UPDATE horaires 
            SET jour = :jour, ouverture = :ouverture, fermeture = :fermeture
            WHERE id = :id
        ");
        $query->execute([
            'id' => $data['id'],
            'jour' => $data['jour'],
            'ouverture' => $data['ouverture'],
            'fermeture' => $data['fermeture']
        ]);
    } 
    // Sinon → INSERT
    else {
        $query = $pdo->prepare("
            INSERT INTO horaires (jour, ouverture, fermeture)
            VALUES (:jour, :ouverture, :fermeture)
        ");
        $query->execute([
            'jour' => $data['jour'],
            'ouverture' => $data['ouverture'],
            'fermeture' => $data['fermeture']
        ]);
    }

    echo json_encode(["status" => "success"]);

} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
