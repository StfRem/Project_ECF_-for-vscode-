<?php
header('Content-Type: application/json');
require_once 'Database.php';

$db = new Database();
$pdo = $db->getConnection();

// Récupération JSON
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["status" => "error", "message" => "Données vides"]);
    exit;
}

try {
    $sql = "INSERT INTO commandes (
                id, userId, menuId, menuTitre,
                nbPersonnes, prixTotal, reduction, materiel,
                adresse, ville, cp, distance,
                datePrestation, heurePrestation,
                gsm, statut,
                historique, avis
            ) VALUES (
                :id, :userId, :menuId, :menuTitre,
                :nbPersonnes, :prixTotal, :reduction, :materiel,
                :adresse, :ville, :cp, :distance,
                :datePrestation, :heurePrestation,
                :gsm, :statut,
                :historique, :avis
            )";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ':id'              => $data['id'],
        ':userId'          => $data['userId'],
        ':menuId'          => $data['menuId'],
        ':menuTitre'       => $data['menuTitre'],

        ':nbPersonnes'     => $data['nbPersonnes'],
        ':prixTotal'       => $data['prixTotal'],
        ':reduction'       => $data['reduction'] ? 1 : 0,
        ':materiel'        => $data['materiel'] ? 1 : 0,

        ':adresse'         => $data['adresse'],
        ':ville'           => $data['ville'],
        ':cp'              => $data['cp'],
        ':distance'        => $data['distance'],

        ':datePrestation'  => $data['datePrestation'],
        ':heurePrestation' => $data['heurePrestation'],

        ':gsm'             => $data['gsm'],

        ':statut'          => $data['statut'],

        ':historique'      => json_encode($data['historique']),
        ':avis'            => json_encode($data['avis'])
    ]);

    echo json_encode(["status" => "success", "message" => "Commande enregistrée"]);

} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
