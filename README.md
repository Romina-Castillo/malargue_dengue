1ª npm install
2ª npm run dev
te sale redirigite a esa direccion es donde esta corriendo la app
primero tenes que iniciar sesion o registrarte, y de ahi recien te muestra la lista de pacientes 

BASE DE DATOS
CREATE DATABASE crudmalargue;

USE crudmalargue;

CREATE TABLE Musuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre_usuario VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    contraseña VARCHAR(255) NOT NULL
);


CREATE TABLE Mdireccion (
	id_direccion INT(10) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	barrio VARCHAR(50) NOT NULL,
	calle VARCHAR(100) NOT NULL,
	numero INT(10) NOT NULL
	);
	
CREATE TABLE Mpacientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    apellido VARCHAR(255) NOT NULL,
    tipo_caso ENUM('Grupo A', 'Grupo B', 'Grupo C') NOT NULL,
    id_direccion INT,
    FOREIGN KEY (id_direccion) REFERENCES Mdireccion(id_direccion)
);
