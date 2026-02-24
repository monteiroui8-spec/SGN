-- Database for IPM Maiombe System

-- Cursos
CREATE TABLE IF NOT EXISTS cursos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL UNIQUE,
    sigla VARCHAR(10) NOT NULL UNIQUE,
    descricao TEXT,
    duracao INT,
    estado VARCHAR(20) DEFAULT 'Activo',
    coordenador VARCHAR(100),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Disciplinas por Curso
CREATE TABLE IF NOT EXISTS disciplinas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    curso VARCHAR(50) NOT NULL,
    ano INT,
    professor_id INT,
    descricao TEXT,
    creditos INT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Utilizadores Admin
CREATE TABLE IF NOT EXISTS admin (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    tipo_admin VARCHAR(50),
    estado VARCHAR(20) DEFAULT 'Activo',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Professores
CREATE TABLE IF NOT EXISTS professores (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    departamento VARCHAR(100),
    telefone VARCHAR(20),
    estado VARCHAR(20) DEFAULT 'Activo',
    foto VARCHAR(255),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Alunos
CREATE TABLE IF NOT EXISTS alunos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    numero VARCHAR(20) NOT NULL UNIQUE,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    curso VARCHAR(50) NOT NULL,
    turma VARCHAR(10),
    ano INT,
    estado VARCHAR(20) DEFAULT 'Activo',
    media DECIMAL(4,2),
    foto VARCHAR(255),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notas
CREATE TABLE IF NOT EXISTS notas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    aluno_id INT NOT NULL,
    disciplina_id INT NOT NULL,
    valor DECIMAL(4,2),
    estado VARCHAR(20) DEFAULT 'Pendente',
    data_lancamento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_validacao TIMESTAMP NULL,
    validado_por INT,
    FOREIGN KEY (aluno_id) REFERENCES alunos(id) ON DELETE CASCADE,
    FOREIGN KEY (disciplina_id) REFERENCES disciplinas(id) ON DELETE CASCADE,
    UNIQUE KEY unique_nota (aluno_id, disciplina_id)
);

-- Turmas
CREATE TABLE IF NOT EXISTS turmas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(20) NOT NULL UNIQUE,
    ano INT NOT NULL,
    curso VARCHAR(50) NOT NULL,
    professor_id INT,
    total_alunos INT DEFAULT 0,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (professor_id) REFERENCES professores(id)
);

-- Boletins
CREATE TABLE IF NOT EXISTS boletins (
    id INT PRIMARY KEY AUTO_INCREMENT,
    aluno_id INT NOT NULL,
    trimestre INT,
    ano_lectivo VARCHAR(10),
    media DECIMAL(4,2),
    observacoes TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (aluno_id) REFERENCES alunos(id) ON DELETE CASCADE
);

-- Avisos
CREATE TABLE IF NOT EXISTS avisos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(200) NOT NULL,
    descricao TEXT,
    tipo VARCHAR(50),
    destinatarios VARCHAR(50),
    data TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    criado_por INT
);

-- Encarregados de Educação
CREATE TABLE IF NOT EXISTS encarregados (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    aluno_id INT NOT NULL,
    parentesco VARCHAR(30),
    estado VARCHAR(20) DEFAULT 'Activo',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (aluno_id) REFERENCES alunos(id) ON DELETE CASCADE
);

-- Exames e Provas
CREATE TABLE IF NOT EXISTS exames (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tipo ENUM('Teste','Exame','Trabalho Prático') NOT NULL,
    disciplina_id INT NOT NULL,
    turma_id INT NOT NULL,
    professor_id INT NOT NULL,
    trimestre VARCHAR(30) NOT NULL,
    data DATE NOT NULL,
    hora TIME NOT NULL,
    duracao INT NOT NULL COMMENT 'duração em minutos',
    sala VARCHAR(50),
    estado ENUM('Programado','Realizado','Cancelado') DEFAULT 'Programado',
    media_resultado DECIMAL(4,2),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (disciplina_id) REFERENCES disciplinas(id),
    FOREIGN KEY (turma_id) REFERENCES turmas(id),
    FOREIGN KEY (professor_id) REFERENCES professores(id)
);

-- Resultados de Exames (por aluno)
CREATE TABLE IF NOT EXISTS exame_resultados (
    id INT PRIMARY KEY AUTO_INCREMENT,
    exame_id INT NOT NULL,
    aluno_id INT NOT NULL,
    nota DECIMAL(4,2),
    estado ENUM('Aprovado','Reprovado') DEFAULT 'Aprovado',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (exame_id) REFERENCES exames(id) ON DELETE CASCADE,
    FOREIGN KEY (aluno_id) REFERENCES alunos(id) ON DELETE CASCADE,
    UNIQUE KEY unique_resultado (exame_id, aluno_id)
);

-- Propinas (prestações mensais)
CREATE TABLE IF NOT EXISTS propinas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    aluno_id INT NOT NULL,
    ano_lectivo VARCHAR(10) NOT NULL,
    mes INT NOT NULL COMMENT '1=Janeiro...12=Dezembro',
    valor_mensal DECIMAL(10,2) NOT NULL DEFAULT 15000,
    estado ENUM('pago','pendente','atrasado') DEFAULT 'pendente',
    data_vencimento DATE,
    data_pagamento DATE,
    referencia VARCHAR(50),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (aluno_id) REFERENCES alunos(id) ON DELETE CASCADE,
    UNIQUE KEY unique_propina (aluno_id, ano_lectivo, mes)
);

-- Pagamentos (registos de caixa)
CREATE TABLE IF NOT EXISTS pagamentos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    propina_id INT NOT NULL,
    aluno_id INT NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    metodo_pagamento ENUM('Numerário','Transferência','Multicaixa') DEFAULT 'Numerário',
    referencia VARCHAR(50),
    recibo VARCHAR(30) UNIQUE,
    caixeiro VARCHAR(100),
    data_pagamento DATE NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (propina_id) REFERENCES propinas(id),
    FOREIGN KEY (aluno_id) REFERENCES alunos(id)
);

-- Anos Lectivos
CREATE TABLE IF NOT EXISTS anos_lectivos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(10) NOT NULL UNIQUE COMMENT 'Ex: 2024/2025',
    inicio DATE NOT NULL,
    fim DATE NOT NULL,
    estado ENUM('Activo','Encerrado','Pendente') DEFAULT 'Activo',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notas detalhadas (P1, P2, Trabalho, Exame por trimestre)
CREATE TABLE IF NOT EXISTS notas_detalhe (
    id INT PRIMARY KEY AUTO_INCREMENT,
    aluno_id INT NOT NULL,
    disciplina_id INT NOT NULL,
    professor_id INT NOT NULL,
    trimestre VARCHAR(30) NOT NULL,
    p1 DECIMAL(4,2),
    p2 DECIMAL(4,2),
    trabalho DECIMAL(4,2),
    exame DECIMAL(4,2),
    media DECIMAL(4,2),
    estado ENUM('Rascunho','Pendente','Aprovado','Rejeitado') DEFAULT 'Pendente',
    data_lancamento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_validacao TIMESTAMP NULL,
    validado_por INT,
    observacoes TEXT,
    FOREIGN KEY (aluno_id) REFERENCES alunos(id) ON DELETE CASCADE,
    FOREIGN KEY (disciplina_id) REFERENCES disciplinas(id) ON DELETE CASCADE,
    FOREIGN KEY (professor_id) REFERENCES professores(id),
    UNIQUE KEY unique_nota_trimestre (aluno_id, disciplina_id, trimestre)
);

-- Índices para melhor performance
CREATE INDEX idx_alunos_curso ON alunos(curso);
CREATE INDEX idx_alunos_turma ON alunos(turma);
CREATE INDEX idx_notas_aluno ON notas(aluno_id);
CREATE INDEX idx_notas_estado ON notas(estado);
CREATE INDEX idx_turmas_ano ON turmas(ano);
CREATE INDEX idx_turmas_curso ON turmas(curso);
CREATE INDEX idx_propinas_aluno ON propinas(aluno_id);
CREATE INDEX idx_propinas_estado ON propinas(estado);
CREATE INDEX idx_exames_turma ON exames(turma_id);
CREATE INDEX idx_exames_professor ON exames(professor_id);
CREATE INDEX idx_exames_data ON exames(data);
CREATE INDEX idx_pagamentos_aluno ON pagamentos(aluno_id);
CREATE INDEX idx_encarregados_aluno ON encarregados(aluno_id);
