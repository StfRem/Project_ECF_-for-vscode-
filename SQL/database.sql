-- Active: 1771340105837@@127.0.0.1@3306@vite_et_gourmand
CREATE DATABASE Vite_et_gourmand;
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

CREATE TABLE images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    menu_id INT,
    url VARCHAR(255),
    FOREIGN KEY (menu_id) REFERENCES menus(id)
);

CREATE TABLE entrees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    menu_id INT,
    nom VARCHAR(100),
    allergenes VARCHAR(255),
    FOREIGN KEY (menu_id) REFERENCES menus(id)
);

CREATE TABLE plats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    menu_id INT,
    nom VARCHAR(100),
    allergenes VARCHAR(255),
    FOREIGN KEY (menu_id) REFERENCES menus(id)
);

CREATE TABLE desserts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    menu_id INT,
    nom VARCHAR(100),
    allergenes VARCHAR(255),
    FOREIGN KEY (menu_id) REFERENCES menus(id)
);

INSERT INTO menus (id, titre, description, theme, regime, personnesMin, prix, conditions, stock) VALUES
(1, 'Noël Traditionnel', 'Un menu festif aux saveurs authentiques pour vos repas de fin d’année.', 'Noël', 'Classique', 4, 70, 'À commander 2 jours avant. Conserver au frais.', 20),
(2, 'Menu Vegan Fraîcheur', 'Un menu 100% végétal, équilibré et savoureux.', 'Vegan', 'Vegan', 2, 55, 'À commander 24h avant.', 15),
(3, 'Menu Événements', 'Un menu conçu pour vos fêtes et grands rassemblements.', 'Événements', 'Classique', 6, 90, 'À commander 3 jours avant.', 10);

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


INSERT INTO entrees (menu_id, nom, allergenes) VALUES
(1, 'Veloute de potimarron', '(Lactose)'),
(1, 'Saumon fume sur blinis', '(Gluten, Poisson, Oeufs)'),
(2, 'Salade fraicheur', ''),
(2, 'Houmous et crudites', '(Sesame)'),
(3, 'Mini wraps varies', '(Gluten)'),
(3, 'Verrines saumon avocat', '(Poisson)');

INSERT INTO plats (menu_id, nom, allergenes) VALUES
(1, 'Dinde farcie aux marrons', '(Lactose)'),
(1, 'Filet de cabillaud sauce citron', '(Poisson)'),
(2, 'Curry de legumes', ''),
(2, 'Pates completes', '(Gluten)'),
(3, 'Buffet froid varie', '(Gluten, Lactose)'),
(3, 'Plateau charcuterie', '');

INSERT INTO desserts (menu_id, nom, allergenes) VALUES
(1, 'Buche chocolat praline', '(Lactose, Gluten, Oeufs)'),
(1, 'Tarte aux pommes caramelisees', '(Gluten, Oeufs)'),
(2, 'Mousse chocolat vegan', ''),
(2, 'Tartelette fruits rouges', '(Gluten)'),
(3, 'Assortiment de mini desserts', '(Gluten, Oeufs, Lactose)');