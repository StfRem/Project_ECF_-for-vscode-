<?php
class Database {
    private $host = "127.0.0.1";
    private $dbname = "vite_et_gourmand";
    private $username = "root";
    private $password = "";

    public function getConnection() {
        try {
            $pdo = new PDO(
                "mysql:host=".$this->host.";dbname=".$this->dbname.";charset=utf8mb4",
                $this->username,
                $this->password,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
                ]
            );
            return $pdo;
        } catch (PDOException $e) {
            die("Erreur de connexion : " . $e->getMessage());
        }
    }
}

//Création automatique de $pdo pour tous les scripts
$db = new Database();
$pdo = $db->getConnection();

