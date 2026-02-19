<?php
header("Content-Type: application/json");
require_once "Database.php";

file_put_contents("debug_user.txt", print_r($data, true)); // Debug: log the received data

$data = json_decode(file_get_contents("php://input"), true);

$id = $data["id"];
$fullname = $data["fullname"];
$gsm = $data["gsm"];
$address = $data["address"];
$cp = $data["cp"];
$ville = $data["ville"];

$sql = "UPDATE users 
        SET fullname = ?, gsm = ?, address = ?, cp = ?, ville = ?
        WHERE id = ?";

$stmt = $pdo->prepare($sql);
$ok = $stmt->execute([$fullname, $gsm, $address, $cp, $ville, $id]);

echo json_encode(["success" => $ok]);
