<?php
header("Content-Type: application/json");
require_once "Database.php";

// Récupération des données envoyées par le JS
$data = json_decode(file_get_contents("php://input"), true);

// Debug
file_put_contents("debug_user.txt", print_r($data, true));

$id = $data["id"];
$fullname = $data["fullname"];
$gsm = $data["gsm"];
$adresse = $data["adresse"];
$cp = $data["cp"];
$ville = $data["ville"];

$sql = "UPDATE users 
        SET fullname = ?, gsm = ?, adresse = ?, cp = ?, ville = ?
        WHERE id = ?";

$stmt = $pdo->prepare($sql);
$ok = $stmt->execute([$fullname, $gsm, $adresse, $cp, $ville, $id]);

echo json_encode(["success" => $ok]);
