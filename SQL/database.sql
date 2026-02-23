CREATE DATABASE vite_et_gourmand;
USE vite_et_gourmand;

-- TABLE MENUS
CREATE TABLE menus (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    theme VARCHAR(50) NOT NULL,
    regime VARCHAR(50) NOT NULL,
    personnesMin INT NOT NULL,
    prix DECIMAL(6,2) NOT NULL,
    conditions TEXT NOT NULL,
    stock INT NOT NULL
) ENGINE=InnoDB;

INSERT INTO menus VALUES
(1, 'Noël Traditionnel', 'Un menu festif aux saveurs authentiques pour vos repas de fin d’année.', 'Noël', 'Classique', 4, 70.00, 'À commander 2 jours avant. Conserver au frais.', 20),
(2, 'Menu Vegan Fraîcheur', 'Un menu 100% végétal, équilibré et savoureux.', 'Vegan', 'Vegan', 2, 55.00, 'À commander 24h avant.', 15),
(3, 'Menu Événements', 'Un menu conçu pour vos fêtes et grands rassemblements.', 'Événements', 'Classique', 6, 90.00, 'À commander 3 jours avant.', 10);

-- TABLE IMAGES
CREATE TABLE images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    menu_id INT NOT NULL,
    url VARCHAR(255) NOT NULL
) ENGINE=InnoDB;

INSERT INTO images VALUES
(1, 1, '/assets/images/entree_noel.jpg'),
(2, 1, '/assets/images/repasnoel.jpg'),
(3, 1, '/assets/images/repasnoel1.jpg'),
(4, 2, '/assets/images/Vegan1.jpg'),
(5, 2, '/assets/images/Vegan2.jpg'),
(6, 2, '/assets/images/Vegan3.jpg'),
(7, 3, '/assets/images/event1.jpg'),
(8, 3, '/assets/images/event2.jpg'),
(9, 3, '/assets/images/event3.jpg');

-- TABLE ENTREES
CREATE TABLE entrees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    menu_id INT NOT NULL,
    nom VARCHAR(100) NOT NULL,
    allergenes VARCHAR(255) NULL
) ENGINE=InnoDB;

INSERT INTO entrees VALUES
(1, 1, 'Veloute de potimarron', '(Lactose)'),
(2, 1, 'Saumon fume sur blinis', '(Gluten, Poisson, Oeufs)'),
(3, 2, 'Salade fraicheur', ''),
(4, 2, 'Houmous et crudites', '(Sesame)'),
(5, 3, 'Mini wraps varies', '(Gluten)'),
(6, 3, 'Verrines saumon avocat', '(Poisson)');

-- TABLE PLATS
CREATE TABLE plats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    menu_id INT NOT NULL,
    nom VARCHAR(100) NOT NULL,
    allergenes VARCHAR(255) NULL
) ENGINE=InnoDB;

INSERT INTO plats VALUES
(1, 1, 'Dinde farcie aux marrons', '(Lactose)'),
(2, 1, 'Filet de cabillaud sauce citron', '(Poisson)'),
(3, 2, 'Curry de legumes', ''),
(4, 2, 'Pates completes', '(Gluten)'),
(5, 3, 'Buffet froid varie', '(Gluten, Lactose)'),
(6, 3, 'Plateau charcuterie', '');

-- TABLE DESSERTS
CREATE TABLE desserts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    menu_id INT NOT NULL,
    nom VARCHAR(100) NOT NULL,
    allergenes VARCHAR(255) NULL
) ENGINE=InnoDB;

INSERT INTO desserts VALUES
(1, 1, 'Buche chocolat praline', '(Lactose, Gluten, Oeufs)'),
(2, 1, 'Tarte aux pommes caramelisees', '(Gluten, Oeufs)'),
(3, 2, 'Mousse chocolat vegan', ''),
(4, 2, 'Tartelette fruits rouges', '(Gluten)'),
(5, 3, 'Assortiment de mini desserts', '(Gluten, Oeufs, Lactose)');

-- TABLE USERS
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY, -- On passe en INT et on ajoute l'auto-incrément
    fullname VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    gsm VARCHAR(20),
    adresse TEXT,
    cp VARCHAR(10),
    ville VARCHAR(255),
    role ENUM('admin','employe','utilisateur') NOT NULL DEFAULT 'utilisateur',
    suspendu TINYINT(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB;

INSERT INTO users (fullname, email, password, gsm, adresse, cp, ville, role, suspendu)
VALUES 
('José', 'admin@site.com', '$2y$10$XlrqFb3xv0OoaiINPewVpOgarsWuI8HaLcsL0HyiHoojmYfcx3cKS', '0612234578', 'Bordeaux', '48000', 'Bordeaux', 'admin', 0);


-- TABLE COMMANDES
CREATE TABLE commandes (
    id VARCHAR(50) PRIMARY KEY,
    userId VARCHAR(50) NOT NULL,
    menuId INT NOT NULL,
    menuTitre VARCHAR(150) NOT NULL,
    nbPersonnes INT NOT NULL,
    adresse VARCHAR(255),
    prixTotal DECIMAL(10,2) NOT NULL,
    reduction TINYINT(1) DEFAULT 0,
    materiel TINYINT(1) DEFAULT 0,
    ville VARCHAR(100),
    cp VARCHAR(10),
    distance INT,
    datePrestation DATE,
    heurePrestation TIME,
    gsm VARCHAR(20),
    statut VARCHAR(100) DEFAULT 'en attente',
    historique JSON,
    avis JSON
) ENGINE=InnoDB;



-- TABLE AVIS
CREATE TABLE avis (
    id INT AUTO_INCREMENT PRIMARY KEY,
    commande_id VARCHAR(50),
    user_id VARCHAR(50),
    nom_client VARCHAR(100),
    note INT,
    commentaire TEXT NOT NULL,
    date_creation DATETIME NOT NULL,
    statut VARCHAR(50) DEFAULT 'en attente'
) ENGINE=InnoDB;


-- TABLE HORAIRES
CREATE TABLE horaires (
    id INT AUTO_INCREMENT PRIMARY KEY,
    jour VARCHAR(20) NOT NULL,
    ouverture VARCHAR(10) NOT NULL,
    fermeture VARCHAR(10) NOT NULL
) ENGINE=InnoDB;