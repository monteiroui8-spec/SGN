-- Populate IPM Database with Course Structure

USE ipm_maiombe;

-- Insert Academic Years
INSERT INTO anos_lectivos (nome, inicio, fim, estado) VALUES
('2024/2025', '2024-09-01', '2025-07-31', 'Activo'),
('2023/2024', '2023-09-01', '2024-07-31', 'Encerrado'),
('2025/2026', '2025-09-01', '2026-07-31', 'Pendente');

-- Insert Course Years
INSERT INTO anos_curso (curso_id, ano, nome) VALUES
(1, 1, '1º Ano - Contabilidade'),
(1, 2, '2º Ano - Contabilidade'),
(1, 3, '3º Ano - Contabilidade'),
(2, 1, '1º Ano - Informática de Gestão'),
(2, 2, '2º Ano - Informática de Gestão'),
(2, 3, '3º Ano - Informática de Gestão');

-- CONTABILIDADE - 10° Classe (Year 1)
INSERT INTO disciplinas (nome, sigla, ano_curso_id) VALUES
('Matemática', 'MAT', 1),
('Língua Portuguesa', 'LP', 1),
('Contabilidade Financeira', 'CF', 1),
('Economia', 'ECON', 1),
('Informática', 'INFO', 1),
('Educação Física', 'EF', 1),
('Língua Inglesa', 'ING', 1),
('Direito Laboral Comercial', 'DLC', 1),
('Organização e Gestão de Empresas', 'OGE', 1),
('Física Aplicada à Indústria', 'FAI', 1);

-- CONTABILIDADE - 11° Classe (Year 2)
INSERT INTO disciplinas (nome, sigla, ano_curso_id) VALUES
('Matemática', 'MAT', 2),
('Língua Portuguesa', 'LP', 2),
('Contabilidade Financeira', 'CF', 2),
('Informática', 'INFO', 2),
('Educação Física', 'EF', 2),
('Organização e Gestão de Empresas', 'OGE', 2),
('Noções de Direito', 'ND', 2),
('Língua Inglesa', 'ING', 2),
('Física Aplicada à Indústria', 'FAI', 2);

-- CONTABILIDADE - 12° Classe (Year 3)
INSERT INTO disciplinas (nome, sigla, ano_curso_id) VALUES
('Matemática', 'MAT', 3),
('Técnicas Contabilísticas Específicas', 'TCE', 3),
('Contabilidade Analítica', 'CA', 3),
('Direito Laboral Fiscal', 'DLF', 3),
('Gestão Orçamental', 'GO', 3),
('Organização e Gestão de Empresas', 'OGE', 3),
('Projeto Tecnológico', 'PT', 3),
('Auditoria, Estatística e Fiscalização', 'AEF', 3);

-- INFORMÁTICA - 10° Classe (Year 1)
INSERT INTO disciplinas (nome, sigla, ano_curso_id) VALUES
('Técnicas de Linguagem de Programação', 'TLP', 4),
('Tecnologias da Informação e Comunicação', 'TIC', 4),
('Sistemas, Estruturas e Análise de Computadores', 'SEAC', 4),
('Matemática', 'MAT', 4),
('Língua Portuguesa', 'LP', 4),
('Língua Inglesa', 'ING', 4),
('Física', 'FIS', 4),
('Desenho Técnico', 'DT', 4),
('Eletrotecnia', 'ELET', 4),
('Educação Física', 'EF', 4);

-- INFORMÁTICA - 11° Classe (Year 2)
INSERT INTO disciplinas (nome, sigla, ano_curso_id) VALUES
('Língua Portuguesa', 'LP', 5),
('Física', 'FIS', 5),
('Matemática', 'MAT', 5),
('Sistemas, Estruturas e Análise de Computadores', 'SEAC', 5),
('Física Aplicada à Indústria', 'FAI', 5),
('Técnicas de Linguagem de Programação', 'TLP', 5),
('Língua Inglesa', 'ING', 5),
('Química', 'QUIM', 5),
('Eletrotecnia', 'ELET', 5),
('Educação Física', 'EF', 5);

-- INFORMÁTICA - 12° Classe (Year 3)
INSERT INTO disciplinas (nome, sigla, ano_curso_id) VALUES
('Português', 'PT', 6),
('Técnicas de Linguagem de Programação', 'TLP', 6),
('Redes, Telecomunicações e Eletrónica Industrial', 'TREI', 6),
('Física Aplicada à Indústria', 'FAI', 6),
('Sistemas, Estruturas e Análise de Computadores', 'SEAC', 6),
('Matemática', 'MAT', 6),
('Química Orgânica', 'QO', 6),
('Empreendedorismo', 'EMP', 6),
('Organização e Gestão da Informática', 'OGI', 6);

-- Insert Departments
INSERT INTO departamentos (nome, coordenador) VALUES
('Ciências Comerciais e Gestão', 'Prof. Manuel Gomes'),
('Ciências e Tecnologia', 'Prof. Jamba Kalombo'),
('Ciências Exactas', 'Profª. Ana Costa'),
('Ciências Sociais e Humanas', 'Prof. David Sousa');

-- Insert Trimestres for 2024/2025
INSERT INTO trimestres (nome, ano_lectivo_id, inicio, fim, estado) VALUES
('1º Trimestre', 1, '2024-09-01', '2024-12-15', 'Encerrado'),
('2º Trimestre', 1, '2025-01-06', '2025-04-05', 'Activo'),
('3º Trimestre', 1, '2025-04-21', '2025-07-15', 'Pendente');
