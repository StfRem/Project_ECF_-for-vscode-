<?php
require_once "Database.php";

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

$fullname = $data["fullname"];
$email = $data["email"];
$password = password_hash($data["password"], PASSWORD_BCRYPT);
$id = "EMP-" . time();

try {
    $sql = $pdo->prepare("INSERT INTO users (id, fullname, email, password, role) VALUES (?, ?, ?, ?, 'employe')");
    $ok = $sql->execute([$id, $fullname, $email, $password]);

    echo json_encode(["success" => $ok]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
