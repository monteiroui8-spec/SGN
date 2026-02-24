-- Instituto Politécnico do Maiombe Database Schema
-- Two Programs: Contabilidade and Informática

-- Create database
CREATE DATABASE IF NOT EXISTS ipm_maiombe;
USE ipm_maiombe;

-- Anos Lectivos (Academic Years)
CREATE TABLE IF NOT EXISTS anos_lectivos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(50) NOT NULL UNIQUE,
  inicio DATE NOT NULL,
  fim DATE NOT NULL,
  estado ENUM('Pendente', 'Activo', 'Encerrado') DEFAULT 'Pendente',
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_academic_year (nome)
);

-- Trimestres (Periods)
CREATE TABLE IF NOT EXISTS trimestres (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(50) NOT NULL,
  ano_lectivo_id INT NOT NULL,
  inicio DATE NOT NULL,
  fim DATE NOT NULL,
  estado ENUM('Pendente', 'Activo', 'Encerrado') DEFAULT 'Pendente',
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ano_lectivo_id) REFERENCES anos_lectivos(id) ON DELETE CASCADE,
  UNIQUE KEY unique_trimestre (nome, ano_lectivo_id)
);

-- Cursos (Courses)
CREATE TABLE IF NOT EXISTS cursos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL UNIQUE,
  sigla VARCHAR(10) NOT NULL UNIQUE,
  descricao TEXT,
  duracao_anos INT DEFAULT 3,
  estado ENUM('Activo', 'Inactivo') DEFAULT 'Activo',
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert the two main courses
INSERT INTO cursos (nome, sigla, descricao, duracao_anos) VALUES
('Contabilidade', 'CONT', 'Curso de Contabilidade', 3),
('Informática de Gestão', 'IG', 'Curso de Informática de Gestão', 3);

-- Anos do Curso (Years within Courses)
CREATE TABLE IF NOT EXISTS anos_curso (
  id INT AUTO_INCREMENT PRIMARY KEY,
  curso_id INT NOT NULL,
  ano INT NOT NULL CHECK (ano BETWEEN 1 AND 3),
  nome VARCHAR(50),
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (curso_id) REFERENCES cursos(id) ON DELETE CASCADE,
  UNIQUE KEY unique_curso_ano (curso_id, ano)
);

-- Disciplinas (Subjects)
CREATE TABLE IF NOT EXISTS disciplinas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  sigla VARCHAR(20),
  descricao TEXT,
  carga_horaria INT DEFAULT 60,
  ano_curso_id INT NOT NULL,
  estado ENUM('Activo', 'Inactivo') DEFAULT 'Activo',
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ano_curso_id) REFERENCES anos_curso(id) ON DELETE CASCADE
);

-- Departamentos (Departments)
CREATE TABLE IF NOT EXISTS departamentos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL UNIQUE,
  coordenador VARCHAR(100),
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Utilizadores (Users/Accounts)
CREATE TABLE IF NOT EXISTS utilizadores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  tipo ENUM('aluno', 'professor', 'admin') NOT NULL,
  nome VARCHAR(100) NOT NULL,
  telefone VARCHAR(20),
  foto VARCHAR(255),
  estado ENUM('Activo', 'Inactivo') DEFAULT 'Activo',
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_tipo (tipo),
  INDEX idx_email (email)
);

-- Alunos (Students)
CREATE TABLE IF NOT EXISTS alunos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  utilizador_id INT NOT NULL UNIQUE,
  numero_aluno VARCHAR(20) NOT NULL UNIQUE,
  curso_id INT NOT NULL,
  ano INT NOT NULL CHECK (ano BETWEEN 1 AND 3),
  turma VARCHAR(20),
  data_nascimento DATE,
  genero ENUM('Masculino', 'Feminino', 'Outro'),
  endereco TEXT,
  data_matricula DATE NOT NULL,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (utilizador_id) REFERENCES utilizadores(id) ON DELETE CASCADE,
  FOREIGN KEY (curso_id) REFERENCES cursos(id),
  INDEX idx_curso (curso_id),
  INDEX idx_ano (ano),
  INDEX idx_numero_aluno (numero_aluno)
);

-- Encarregados (Parents/Guardians)
CREATE TABLE IF NOT EXISTS encarregados (
  id INT AUTO_INCREMENT PRIMARY KEY,
  utilizador_id INT NOT NULL UNIQUE,
  aluno_id INT NOT NULL,
  parentesco VARCHAR(50),
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (utilizador_id) REFERENCES utilizadores(id) ON DELETE CASCADE,
  FOREIGN KEY (aluno_id) REFERENCES alunos(id) ON DELETE CASCADE
);

-- Professores (Teachers)
CREATE TABLE IF NOT EXISTS professores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  utilizador_id INT NOT NULL UNIQUE,
  departamento_id INT NOT NULL,
  formacao TEXT,
  data_contratacao DATE NOT NULL,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (utilizador_id) REFERENCES utilizadores(id) ON DELETE CASCADE,
  FOREIGN KEY (departamento_id) REFERENCES departamentos(id),
  INDEX idx_departamento (departamento_id)
);

-- Turmas (Classes)
CREATE TABLE IF NOT EXISTS turmas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(20) NOT NULL,
  curso_id INT NOT NULL,
  ano INT NOT NULL CHECK (ano BETWEEN 1 AND 3),
  professores_orientadores VARCHAR(255),
  ano_lectivo_id INT NOT NULL,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (curso_id) REFERENCES cursos(id),
  FOREIGN KEY (ano_lectivo_id) REFERENCES anos_lectivos(id),
  UNIQUE KEY unique_turma (nome, ano_lectivo_id)
);

-- Atribuição Professor-Disciplina-Turma
CREATE TABLE IF NOT EXISTS aulas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  professor_id INT NOT NULL,
  disciplina_id INT NOT NULL,
  turma_id INT NOT NULL,
  data_inicio DATE,
  data_fim DATE,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (professor_id) REFERENCES professores(id),
  FOREIGN KEY (disciplina_id) REFERENCES disciplinas(id),
  FOREIGN KEY (turma_id) REFERENCES turmas(id),
  UNIQUE KEY unique_aula (professor_id, disciplina_id, turma_id)
);

-- Notas (Grades)
CREATE TABLE IF NOT EXISTS notas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  aluno_id INT NOT NULL,
  aula_id INT NOT NULL,
  trimestre_id INT NOT NULL,
  nota DECIMAL(4,2) CHECK (nota BETWEEN 0 AND 20),
  estado ENUM('Pendente', 'Lançada', 'Validada', 'Rejeitada') DEFAULT 'Pendente',
  justificacao_rejeicao TEXT,
  data_lancamento DATETIME,
  data_validacao DATETIME,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (aluno_id) REFERENCES alunos(id) ON DELETE CASCADE,
  FOREIGN KEY (aula_id) REFERENCES aulas(id),
  FOREIGN KEY (trimestre_id) REFERENCES trimestres(id),
  INDEX idx_aluno (aluno_id),
  INDEX idx_estado (estado),
  UNIQUE KEY unique_nota (aluno_id, aula_id, trimestre_id)
);

-- Boletins (Report Cards)
CREATE TABLE IF NOT EXISTS boletins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  aluno_id INT NOT NULL,
  ano_lectivo_id INT NOT NULL,
  trimestre_id INT NOT NULL,
  media_geral DECIMAL(4,2),
  total_disciplinas INT,
  disciplinas_aprovadas INT,
  estado ENUM('Pendente', 'Gerado', 'Impresso') DEFAULT 'Pendente',
  data_geracao DATETIME,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (aluno_id) REFERENCES alunos(id) ON DELETE CASCADE,
  FOREIGN KEY (ano_lectivo_id) REFERENCES anos_lectivos(id),
  FOREIGN KEY (trimestre_id) REFERENCES trimestres(id),
  UNIQUE KEY unique_boletim (aluno_id, ano_lectivo_id, trimestre_id)
);

-- Mensagens (Messages)
CREATE TABLE IF NOT EXISTS mensagens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  remetente_id INT NOT NULL,
  destinatario_id INT NOT NULL,
  assunto VARCHAR(200),
  conteudo TEXT NOT NULL,
  lida BOOLEAN DEFAULT FALSE,
  data_leitura DATETIME,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (remetente_id) REFERENCES utilizadores(id),
  FOREIGN KEY (destinatario_id) REFERENCES utilizadores(id),
  INDEX idx_destinatario (destinatario_id),
  INDEX idx_lida (lida)
);

-- Avisos (Announcements)
CREATE TABLE IF NOT EXISTS avisos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(200) NOT NULL,
  descricao TEXT NOT NULL,
  tipo ENUM('info', 'importante', 'evento') DEFAULT 'info',
  destinatarios ENUM('todos', 'alunos', 'professores', 'admin') DEFAULT 'todos',
  data_inicio DATETIME,
  data_fim DATETIME,
  estado ENUM('Activo', 'Inactivo') DEFAULT 'Activo',
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_destinatarios (destinatarios),
  INDEX idx_estado (estado)
);

-- Horários (Schedules)
CREATE TABLE IF NOT EXISTS horarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  turma_id INT NOT NULL,
  dia VARCHAR(20),
  hora_inicio TIME,
  hora_fim TIME,
  disciplina_id INT,
  sala VARCHAR(20),
  professor_id INT,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (turma_id) REFERENCES turmas(id) ON DELETE CASCADE,
  FOREIGN KEY (disciplina_id) REFERENCES disciplinas(id),
  FOREIGN KEY (professor_id) REFERENCES professores(id)
);

-- Create indices for performance
CREATE INDEX idx_alunos_turma ON alunos(turma);
CREATE INDEX idx_notas_aluno ON notas(aluno_id);
CREATE INDEX idx_aulas_professor ON aulas(professor_id);
CREATE INDEX idx_turma_ano_curso ON turmas(ano, curso_id);
