CREATE DATABASE peliculas;

USE peliculas;

CREATE TABLE genero (
    id INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE pelicula (
    id INT NOT NULL AUTO_INCREMENT,
    titulo VARCHAR(100) NOT NULL,
    duracion INT NOT NULL,
    director varchar(400) NOT NULL,
    anio INT NOT NULL,
    fecha_lanzamiento DATE NOT NULL,
    puntuacion INT,
    poster VARCHAR(300),
    trama VARCHAR(700),
    genero_id INT DEFAULT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (genero_id) REFERENCES genero (id) 
);