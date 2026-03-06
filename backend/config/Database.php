<?php
class Database {
    private string $host    = 'localhost';
    private string $db_name = 'sgn_ipm';    // base de dados criada pelo 01_schema.sql
    private string $user    = 'root';
    private string $pass    = '';           // alterar se o MySQL tiver senha
    private ?mysqli $conn   = null;

    public function connect(): mysqli {
        $this->conn = new mysqli($this->host, $this->user, $this->pass, $this->db_name);

        if ($this->conn->connect_error) {
            http_response_code(500);
            echo json_encode(['error' => 'Erro de ligação à base de dados: ' . $this->conn->connect_error]);
            exit();
        }

        $this->conn->set_charset('utf8mb4');
        return $this->conn;
    }

    public function closeConnection(): void {
        if ($this->conn) {
            $this->conn->close();
        }
    }
}
?>
