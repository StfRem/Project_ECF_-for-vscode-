<?php
require_once "Database.php";

header("Content-Type: application/json");

$sql = $pdo->query("SELECT * FROM users WHERE role = 'employe'");
$employes = $sql->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($employes);
