<?php
require_once '../../config/Headers.php';
require_once '../../config/Database.php';

$db = new Database();
$conn = $db->connect();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $result = $conn->query("SELECT * FROM cursos ORDER BY nome ASC");
    
    if ($result) {
        $cursos = [];
        while ($row = $result->fetch_assoc()) {
            $cursos[] = $row;
        }
        http_response_code(200);
        echo json_encode(['success' => true, 'cursos' => $cursos]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch cursos']);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}

$db->closeConnection();
?>
