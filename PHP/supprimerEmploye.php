<?php
// Inclusion de votre connexion existante
require_once "Database.php";

header("Content-Type: application/json");

// 1. Récupération des données envoyées par le JavaScript (fetch POST)
$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (isset($data['id'])) {
    $id = $data['id'];

    try {
        // 2. Préparation de la requête de suppression
        // On sécurise avec des paramètres nommés pour éviter les injections SQL
        $stmt = $pdo->prepare("DELETE FROM users WHERE id = :id AND role = 'employe'");
        $stmt->execute(['id' => $id]);

        // 3. Vérification si une ligne a bien été supprimée
        if ($stmt->rowCount() > 0) {
            echo json_encode(["success" => true, "message" => "Employé supprimé avec succès."]);
        } else {
            echo json_encode(["success" => false, "message" => "Employé non trouvé ou déjà supprimé."]);
        }
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => "Erreur lors de la suppression : " . $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "message" => "ID de l'employé manquant."]);
}
?>