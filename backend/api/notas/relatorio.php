<?php
require_once '../../config/Headers.php';
require_once '../../config/Database.php';
require_once '../../config/Auth.php';

$auth = Auth::requireRole('admin');

$db = new Database();
$conn = $db->connect();

// Resumo por disciplina
$stmtDisc = $conn->query("
    SELECT d.nome AS disciplina,
           COUNT(n.id) AS total,
           ROUND(AVG(n.media), 1) AS media,
           SUM(CASE WHEN n.media >= 10 THEN 1 ELSE 0 END) AS aprovados,
           ROUND(100 * SUM(CASE WHEN n.media >= 10 THEN 1 ELSE 0 END) / COUNT(n.id)) AS pct_aprovados
    FROM notas n
    JOIN disciplinas d ON n.disciplina_id = d.id
    WHERE n.estado = 'Aprovado' AND n.media IS NOT NULL
    GROUP BY d.id, d.nome
    ORDER BY media DESC
    LIMIT 10
");
$porDisciplina = $stmtDisc->fetch_all(MYSQLI_ASSOC);

// Resumo por trimestre
$stmtTri = $conn->query("
    SELECT t.nome AS trimestre,
           COUNT(n.id) AS total,
           ROUND(AVG(n.media), 1) AS media,
           SUM(CASE WHEN n.media >= 10 THEN 1 ELSE 0 END) AS aprovados
    FROM notas n
    JOIN trimestres t ON n.trimestre_id = t.id
    WHERE n.estado = 'Aprovado' AND n.media IS NOT NULL
    GROUP BY t.id, t.nome
    ORDER BY t.id
");
$porTrimestre = $stmtTri->fetch_all(MYSQLI_ASSOC);

// Totais gerais
$stmtTotal = $conn->query("
    SELECT
        COUNT(*) AS total_notas,
        SUM(CASE WHEN estado = 'Pendente'  THEN 1 ELSE 0 END) AS pendentes,
        SUM(CASE WHEN estado = 'Aprovado'  THEN 1 ELSE 0 END) AS aprovadas,
        SUM(CASE WHEN estado = 'Rejeitado' THEN 1 ELSE 0 END) AS rejeitadas,
        ROUND(AVG(CASE WHEN estado = 'Aprovado' THEN media END), 1) AS media_geral
    FROM notas
");
$totais = $stmtTotal->fetch_assoc();

echo json_encode([
    'success'        => true,
    'totais'         => $totais,
    'por_disciplina' => $porDisciplina,
    'por_trimestre'  => $porTrimestre,
]);
$db->closeConnection();
?>
