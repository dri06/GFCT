<?php

$servername = "localhost";
$username = "root";
$password = "mysql";
$dbname = "ifmtpasseiociclistico";
$conn = new mysqli(hostname: $servername, username: $username, password: $password, database: $dbname);

if($conn->connect_error) {
    die("Conexão falhou: " . $conn->connect_error);
}

if($_SERVER["REQUEST_METHOD"] == "POST"){ 
$descricao = $_POST['descricao'];
$data = $_POST['data'];
$valor = $_POST['valor'];
$tipo = $_POST['tipo'];
$categoria = $_POST['categoria'];
$responsavel = $_POST['responsavel'];
$comprovante = $_POST['comprovante'];
$visivel = $_POST[visivel];

$sql = "INSERT INTO transacoes (descricao, data, valor, tipo, categoria, responsavel, comprovante, visivel)
VALUES ("$descricao", "$data", "$valor", "$tipo", "$categoria", "$responsavel", "$comprovante", TRUE)";

if($conn->query(query: $sql) == TRUE){
    echo "Transação realizada com sucesso!";
} else{
    echo "Erro: " . $sql . "<br>" . $conn->error;
}
}
$conn->close();
?>