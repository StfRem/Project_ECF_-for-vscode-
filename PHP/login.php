<?php
header('Content-Type: application/json');
require_once 'Database.php';

$json = file_get_contents('php://input');
$data = json_decode($json, true);

if ($data) {
    try {
        $email = $data['email'];
        $password = $data['password'];

        // cherche l'utilisateur par son email
        $sql = "SELECT * FROM users WHERE email = :email";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':email' => $email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        // Si l'utilisateur existe
        if ($user) {
            // On utilise UNIQUEMENT password_verify()
            // Cette fonction compare le mot de passe saisi avec le hash stocké
            if (password_verify($password, $user['password'])) {
                
                // On supprime le hash du tableau avant l'envoi pour la sécurité
                unset($user['password']);
                
                echo json_encode([
                    'status' => 'success',
                    'user' => $user
                ]);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Mot de passe incorrect.']);
            }
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Email non trouvé.']);
        }
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'Erreur SQL : ' . $e->getMessage()]);
    }
}
?>