<?php
header('Content-Type: application/json');
require_once 'Database.php';

$db = new Database();
$pdo = $db->getConnection();

$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (!$data) {
    echo json_encode(['status' => 'error', 'message' => 'Données JSON invalides']);
    exit;
}

try {
    // 1. Hachage du mot de passe
    $passwordHache = password_hash($data['password'], PASSWORD_DEFAULT);

    // 2. Gestion du rôle (ID est géré par MySQL AUTO_INCREMENT) c'est ma derniere modification
    $role = !empty($data['role']) ? $data['role'] : 'utilisateur';

    // 3. SQL : On ne mentionne PAS la colonne 'id'
    $sql = "INSERT INTO users (fullname, gsm, email, adresse, cp, ville, password, role)
            VALUES (:fullname, :gsm, :email, :adresse, :cp, :ville, :password, :role)";

    $stmt = $pdo->prepare($sql);

    // 4. Exécution sans la clé ':id'
    $stmt->execute([
        ':fullname' => $data['fullname'] ?? null,
        ':gsm'      => $data['gsm'] ?? null,
        ':email'    => $data['email'],
        ':adresse'  => $data['adresse'] ?? null,
        ':cp'       => $data['cp'] ?? null,
        ':ville'    => $data['ville'] ?? null,
        ':password' => $passwordHache,
        ':role'     => $role
    ]);

    // 5. RÉCUPÉRATION DE L'ID : Très important pour ton register.js
    $newId = $pdo->lastInsertId();

    echo json_encode([
        'status' => 'success',
        'message' => 'Utilisateur enregistré avec succès',
        'id' => $newId // Le JS récupèrera ce chiffre (1, 2, 3...)
    ]);

} catch (PDOException $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Erreur SQL : ' . $e->getMessage()
    ]);
}
?>