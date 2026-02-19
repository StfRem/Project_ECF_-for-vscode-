CREATE DATABASE vite_et_gourmand;
USE vite_et_gourmand;

-- TABLE MENUS

CREATE TABLE menus (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(100),
    description TEXT,
    theme VARCHAR(50),
    regime VARCHAR(50),
    personnesMin INT,
    prix DECIMAL(6,2),
    conditions TEXT,
    stock INT
);

INSERT INTO menus (titre, description, theme, regime, personnesMin, prix, conditions, stock) VALUES
('Noël Traditionnel', 'Un menu festif aux saveurs authentiques pour vos repas de fin d’année.', 'Noël', 'Classique', 4, 70.00, 'À commander 2 jours avant. Conserver au frais.', 20),
('Menu Vegan Fraîcheur', 'Un menu 100% végétal, équilibré et savoureux.', 'Vegan', 'Vegan', 2, 55.00, 'À commander 24h avant.', 15),
('Menu Événements', 'Un menu conçu pour vos fêtes et grands rassemblements.', 'Événements', 'Classique', 6, 90.00, 'À commander 3 jours avant.', 10);


-- TABLE ENTREES

CREATE TABLE entrees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    menu_id INT,
    nom VARCHAR(100),
    allergenes VARCHAR(255)
);

INSERT INTO entrees (menu_id, nom, allergenes) VALUES
(1, 'Veloute de potimarron', '(Lactose)'),
(1, 'Saumon fume sur blinis', '(Gluten, Poisson, Oeufs)'),
(2, 'Salade fraicheur', ''),
(2, 'Houmous et crudites', '(Sesame)'),
(3, 'Mini wraps varies', '(Gluten)'),
(3, 'Verrines saumon avocat', '(Poisson)');

-- TABLE PLATS

CREATE TABLE plats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    menu_id INT,
    nom VARCHAR(100),
    allergenes VARCHAR(255)
);

INSERT INTO plats (menu_id, nom, allergenes) VALUES
(1, 'Dinde farcie aux marrons', '(Lactose)'),
(1, 'Filet de cabillaud sauce citron', '(Poisson)'),
(2, 'Curry de legumes', ''),
(2, 'Pates completes', '(Gluten)'),
(3, 'Buffet froid varie', '(Gluten, Lactose)'),
(3, 'Plateau charcuterie', '');

-- TABLE DESSERTS

CREATE TABLE desserts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    menu_id INT,
    nom VARCHAR(100),
    allergenes VARCHAR(255)
);

INSERT INTO desserts (menu_id, nom, allergenes) VALUES
(1, 'Buche chocolat praline', '(Lactose, Gluten, Oeufs)'),
(1, 'Tarte aux pommes caramelisees', '(Gluten, Oeufs)'),
(2, 'Mousse chocolat vegan', ''),
(2, 'Tartelette fruits rouges', '(Gluten)'),
(3, 'Assortiment de mini desserts', '(Gluten, Oeufs, Lactose)');
-- TABLE IMAGES

CREATE TABLE images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    menu_id INT,
    url VARCHAR(255)
);

INSERT INTO images (menu_id, url) VALUES
(1, '/assets/images/entree_noel.jpg'),
(1, '/assets/images/repasnoel.jpg'),
(1, '/assets/images/repasnoel1.jpg'),
(2, '/assets/images/Vegan1.jpg'),
(2, '/assets/images/Vegan2.jpg'),
(2, '/assets/images/Vegan3.jpg'),
(3, '/assets/images/event1.jpg'),
(3, '/assets/images/event2.jpg'),
(3, '/assets/images/event3.jpg');



-- TABLE COMMANDES

CREATE TABLE commandes (
    id VARCHAR(50) NOT NULL PRIMARY KEY,
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
    statut VARCHAR(30) DEFAULT 'en attente',
    historique JSON,
    avis JSON
);

-- TABLE USERS

CREATE TABLE users (
    id VARCHAR(50) NOT NULL,
    fullname VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    password VARCHAR(255) NOT NULL,
    gsm VARCHAR(20),
    address TEXT,
    cp VARCHAR(10),
    ville VARCHAR(255) NOT NULL,
    role ENUM('admin','employe','utilisateur') DEFAULT 'utilisateur',
    suspendu TINYINT(1) DEFAULT 0,
    PRIMARY KEY (id),
    UNIQUE (email)
);

INSERT INTO users (id, fullname, email, password, gsm, address, cp, ville, role, suspendu) VALUES
('USR-1770864050506', 'José', 'admin@site.com', '$2y$10$XlrqFb3xv0OoaiINPewVpOgarsWuI8HaLcsL0HyiHoojmYfcx3cKS', '0612234578', 'Bordeaux', '48000', 'Bordeaux', 'admin', 0),
('USR-1770916210947', 'Remiatte Stéphane', 'stephaneremiatt54@gmail.com', '$2y$10$KSQ.9x0qYywzGurADa3EzeHam28rsf2V97to8GHkHdhaxEvt/DNRq', '0645788978', '62 Aven foch', '75000', 'Paris', 'utilisateur', 0),
('EMP-1770934147611', 'marie ma', 'julie@site.com', '$2y$10$dBq2t2tNgG3xVJB9pxZHH.124.myInF6iC83R070ATP22LWE729vm', NULL, NULL, NULL, 'Nancy', 'employe', 0);

-- TABLE HORAIRES

CREATE TABLE horaires (
    id VARCHAR(50) NOT NULL,
    jour VARCHAR(20) NOT NULL,
    ouverture VARCHAR(10) NOT NULL,
    fermeture VARCHAR(10) NOT NULL,
    PRIMARY KEY (id)
);

-- TABLE AVIS

CREATE TABLE avis (
    id VARCHAR(50) NOT NULL,
    commande_id VARCHAR(50),
    user_id VARCHAR(50),
    nom_client VARCHAR(100),
    note INT,
    commentaire TEXT,
    date_creation DATETIME,
    statut VARCHAR(50) DEFAULT 'en attente',
    PRIMARY KEY (id)
);
