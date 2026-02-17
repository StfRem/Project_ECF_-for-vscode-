<?php
require_once "Database.php";

$db = new Database();
$conn = $db->getConnection();

// 1. Menus
$menus = $conn->query("SELECT * FROM menus")->fetchAll(PDO::FETCH_ASSOC);

// 2. Images
$images = $conn->query("SELECT * FROM images")->fetchAll(PDO::FETCH_ASSOC);

// 3. Entrées
$entrees = $conn->query("SELECT * FROM entrees")->fetchAll(PDO::FETCH_ASSOC);

// 4. Plats
$plats = $conn->query("SELECT * FROM plats")->fetchAll(PDO::FETCH_ASSOC);

// 5. Desserts
$desserts = $conn->query("SELECT * FROM desserts")->fetchAll(PDO::FETCH_ASSOC);

// Assemblage final
foreach ($menus as &$menu) {

    $id = $menu["id"];

    // IMAGES
    $menu["images"] = array_column(
        array_filter($images, fn($i) => $i["menu_id"] == $id),
        "url"
    );

    // ENTREES
    $menu["entrees"] = array_values(array_map(
    fn($e) => [
        "nom" => $e["nom"],
        "allergenes" => $e["allergenes"] ? explode(",", $e["allergenes"]) : []
    ],
    array_filter($entrees, fn($e) => $e["menu_id"] == $id)
));

    // PLATS
    $menu["plats"] = array_values(array_map(
    fn($p) => [
        "nom" => $p["nom"],
        "allergenes" => $p["allergenes"] ? explode(",", $p["allergenes"]) : []
    ],
    array_filter($plats, fn($p) => $p["menu_id"] == $id)
));

    // DESSERTS
    $menu["desserts"] = array_values(array_map(
    fn($d) => [
        "nom" => $d["nom"],
        "allergenes" => $d["allergenes"] ? explode(",", $d["allergenes"]) : []
    ],
    array_filter($desserts, fn($d) => $d["menu_id"] == $id)
));
}

echo json_encode($menus);
