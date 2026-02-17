<?php
header("Content-Type: application/json");
require_once "Database.php";

$data = json_decode(file_get_contents("php://input"), true);

$id = $data["id"];
$fullname = $data["fullname"];
$gsm = $data["gsm"];
$address = $data["address"];

$sql = "UPDATE users SET fullname = ?, gsm = ?, address = ? WHERE id = ?";
$stmt = $pdo->prepare($sql);
$stmt->execute([$fullname, $gsm, $address, $id]);

echo json_encode(["success" => true]);