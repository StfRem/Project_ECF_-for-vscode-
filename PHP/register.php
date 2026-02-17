<?php
header('Content-Type: application/json');
require_once 'Database.php';

$db = new Database();
$pdo = $db->getConnection();

// 1. Récupération du JSON envoyé
$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (!$data) {
    echo json_encode(['status' => 'error', 'message' => 'Données JSON invalides']);
    exit;
}

try {
    // 2. Sécurité : hachage du mot de passe
    $passwordHache = password_hash($data['password'], PASSWORD_DEFAULT);

    // 3. Gestion ID et rôle
    $id = !empty($data['id']) ? $data['id'] : 'USR-' . uniqid();
    $role = !empty($data['role']) ? $data['role'] : 'utilisateur';

    // 4. Préparation SQL
    $sql = "INSERT INTO users (id, fullname, gsm, email, address, cp, password, role)
            VALUES (:id, :fullname, :gsm, :email, :address, :cp, :password, :role)";

    $stmt = $pdo->prepare($sql);

    // 5. Exécution
    $stmt->execute([
        ':id'       => $id,
        ':fullname' => $data['fullname'] ?? null,
        ':gsm'      => $data['gsm'] ?? null,
        ':email'    => $data['email'],
        ':address'  => $data['address'] ?? null,
        ':cp'       => $data['cp'] ?? null,
        ':password' => $passwordHache,
        ':role'     => $role
    ]);

    echo json_encode([
        'status' => 'success',
        'message' => 'Utilisateur enregistré avec succès'
    ]);

} catch (PDOException $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Erreur SQL : ' . $e->getMessage()
    ]);
}
?>