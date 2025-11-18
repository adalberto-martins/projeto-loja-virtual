<?php
/* ============================================
   ARQUIVO DE CONEXÃO — LOJA CHIC
   Banco: loja_chic
   Preencha apenas os placeholders abaixo
============================================ */

$host = "localhost";        // normalmente: localhost
$usuario = "root";  // normalmente: root
$senha = "";      // normalmente: ""
$banco = "loja_chic";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$banco;charset=utf8", $usuario, $senha);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} 
catch (PDOException $e) {
    die("Erro na conexão com o banco: " . $e->getMessage());
}
?>
