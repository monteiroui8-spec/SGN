<?php
class Database {
    private $host = 'localhost';
    private $db_name = 'ipm_maiombe';
    private $user = 'root';
    private $pass = '';
    private $conn;

    public function connect() {
        $this->conn = new mysqli($this->host, $this->user, $this->pass, $this->db_name);
        
        if ($this->conn->connect_error) {
            die('Connection Error: ' . $this->conn->connect_error);
        }
        
        return $this->conn;
    }

    public function closeConnection() {
        $this->conn->close();
    }
}
?>
