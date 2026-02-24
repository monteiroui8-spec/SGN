<?php
require_once '../../config/Headers.php';
require_once '../../config/Database.php';

$db = new Database();
$conn = $db->connect();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!isset($data->email) || !isset($data->password) || !isset($data->type)) {
        http_response_code(400);
        echo json_encode(['error' => 'Email, password, and type are required']);
        exit();
    }
    
    $email = $conn->real_escape_string($data->email);
    $password = $data->password;
    $type = $conn->real_escape_string($data->type);
    
    $table = '';
    if ($type === 'aluno') $table = 'alunos';
    elseif ($type === 'professor') $table = 'professores';
    elseif ($type === 'admin') $table = 'admin';
    else {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid user type']);
        exit();
    }
    
    $result = $conn->query("SELECT * FROM $table WHERE email = '$email'");
    
    if ($result && $result->num_rows > 0) {
        $user = $result->fetch_assoc();
        
        if (password_verify($password, $user['password'])) {
            unset($user['password']);
            http_response_code(200);
            echo json_encode(['success' => true, 'user' => $user]);
        } else {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid password']);
        }
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'User not found']);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}

$db->closeConnection();
?>
