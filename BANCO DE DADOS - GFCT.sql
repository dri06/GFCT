DROP DATABASE IF EXISTS caixa_turma;
CREATE DATABASE caixa_turma;
USE caixa_turma;

CREATE TABLE Transacoes (
IDTransacoes INT PRIMARY KEY,
Descricao VARCHAR (100),
Data DATE,
Valor DOUBLE,
Tipo VARCHAR (100),
Categoria INT,
Responsavel VARCHAR (100),
Comprovante VARCHAR (100),
Visivel BOOlEAN
);

CREATE TABLE Administradores (
IDAdministradores INT PRIMARY KEY,
Nome VARCHAR (100),
Senha INT
);

CREATE TABLE Categoria (
IDCategoria INT PRIMARY KEY,
Nome VARCHAR (100)
);