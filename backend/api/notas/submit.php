<?php
require_once '../../config/Headers.php';
require_once '../../config/Database.php';

$db = new Database();
$conn = $db->connect();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!isset($data->alunoId) || !isset($data->disciplinaId) || !isset($data->nota)) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing required fields']);
        exit();
    }
    
    $alunoId = $conn->real_escape_string($data->alunoId);
    $disciplinaId = $conn->real_escape_string($data->disciplinaId);
    $nota = floatval($data->nota);
    $estado = 'Pendente';
    $data_lancamento = date('Y-m-d H:i:s');
    
    $query = "INSERT INTO notas (aluno_id, disciplina_id, valor, estado, data_lancamento) 
              VALUES ('$alunoId', '$disciplinaId', $nota, '$estado', '$data_lancamento')
              ON DUPLICATE KEY UPDATE valor = $nota, estado = '$estado'";
    
    if ($conn->query($query)) {
        http_response_code(201);
        echo json_encode(['success' => true, 'message' => 'Note submitted successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to submit note: ' . $conn->error]);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}

$db->closeConnection();
?>
