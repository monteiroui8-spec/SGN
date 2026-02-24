<?php
require_once '../../config/Headers.php';
require_once '../../config/Database.php';

$db = new Database();
$conn = $db->connect();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $cursoId = isset($_GET['cursoId']) ? $conn->real_escape_string($_GET['cursoId']) : null;
    
    if ($cursoId) {
        $result = $conn->query("SELECT * FROM disciplinas WHERE curso_id = '$cursoId' ORDER BY nome ASC");
    } else {
        $result = $conn->query("SELECT * FROM disciplinas WHERE curso IN ('Informática de Gestão', 'Contabilidade') ORDER BY nome ASC");
    }
    
    if ($result) {
        $disciplinas = [];
        while ($row = $result->fetch_assoc()) {
            $disciplinas[] = $row;
        }
        http_response_code(200);
        echo json_encode(['success' => true, 'disciplinas' => $disciplinas]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch disciplinas']);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}

$db->closeConnection();
?>
