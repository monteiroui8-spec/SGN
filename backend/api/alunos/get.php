<?php
require_once '../../config/Headers.php';
require_once '../../config/Database.php';

$db = new Database();
$conn = $db->connect();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $cursoFilter = isset($_GET['curso']) ? $conn->real_escape_string($_GET['curso']) : null;
    
    $query = "SELECT id, numero, nome, email, curso, turma, ano, estado, media FROM alunos WHERE curso IN ('Informática de Gestão', 'Contabilidade')";
    
    if ($cursoFilter) {
        $query .= " AND curso = '$cursoFilter'";
    }
    
    $query .= " ORDER BY nome ASC";
    
    $result = $conn->query($query);
    
    if ($result) {
        $alunos = [];
        while ($row = $result->fetch_assoc()) {
            $alunos[] = $row;
        }
        http_response_code(200);
        echo json_encode(['success' => true, 'alunos' => $alunos]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch alunos']);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}

$db->closeConnection();
?>
