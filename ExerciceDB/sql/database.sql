DROP DATABASE IF EXISTS bibliotheque;

CREATE DATABASE bibliotheque
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE bibliotheque;
CREATE TABLE categorie(
    id_categorie INT NOT NULL,
    nom VARCHAR(30) NOT NULL,
    CONSTRAINT pk_categorie PRIMARY KEY(id_categorie)
);

CREATE TABLE livre(
    isbn CHAR(13) NOT NULL,
    titre VARCHAR(50) NOT NULL,
    auteur VARCHAR(50) NOT NULL,
    editeur VARCHAR(50) NOT NULL,
    date_sortie DATE NOT NULL,
    description TINYTEXT NOT NULL,
    id_categorie INT NOT NULL,
    CONSTRAINT pk_livre PRIMARY KEY(isbn),
    CONSTRAINT fk_categorie FOREIGN KEY(id_categorie)
        REFERENCES categorie(id_categorie)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

INSERT INTO categorie(id_categorie, nom) VALUES(1, 'Policier');
INSERT INTO categorie(id_categorie, nom) VALUES(2, 'Romance');
INSERT INTO categorie(id_categorie, nom) VALUES(3, 'Fantastique');
INSERT INTO categorie(id_categorie, nom) VALUES(4, 'Science-Fiction');
INSERT INTO categorie(id_categorie, nom) VALUES(5, 'Horreur');
INSERT INTO categorie(id_categorie, nom) VALUES(6, 'Biographie');
INSERT INTO categorie(id_categorie, nom) VALUES(7, 'Cuisine');