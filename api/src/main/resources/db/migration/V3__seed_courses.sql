-- ============================================================
-- V3: Dados iniciais — Cursos Expo e AWS
-- ============================================================

INSERT INTO courses (id, slug, title, description, is_active, display_order, total_xp_reward, estimated_hours, difficulty, created_at, updated_at)
VALUES
    ('a0000000-0000-0000-0000-000000000001',
     'expo-react-native',
     'Expo & React Native',
     'Aprenda a criar apps mobile modernos do zero ao deploy com Expo e React Native.',
     true, 1, 500, 20, 'BEGINNER',
     now(), now()),
    ('a0000000-0000-0000-0000-000000000002',
     'aws-cloud',
     'AWS Cloud',
     'Domine os principais serviços AWS para desenvolvimento e infraestrutura em nuvem.',
     true, 2, 600, 25, 'BEGINNER',
     now(), now());

-- Módulos do curso Expo
INSERT INTO modules (id, course_id, title, description, display_order, is_active, created_at, updated_at)
VALUES
    ('b0000000-0000-0000-0000-000000000001',
     'a0000000-0000-0000-0000-000000000001',
     'Fundamentos', 'Introdução ao Expo e React Native', 1, true, now(), now()),
    ('b0000000-0000-0000-0000-000000000002',
     'a0000000-0000-0000-0000-000000000001',
     'Componentes', 'Componentes visuais e layout com StyleSheet', 2, true, now(), now()),
    ('b0000000-0000-0000-0000-000000000003',
     'a0000000-0000-0000-0000-000000000001',
     'Navegação', 'Roteamento e navegação entre telas com Expo Router', 3, true, now(), now());

-- Módulos do curso AWS
INSERT INTO modules (id, course_id, title, description, display_order, is_active, created_at, updated_at)
VALUES
    ('b0000000-0000-0000-0000-000000000004',
     'a0000000-0000-0000-0000-000000000002',
     'Cloud Fundamentals', 'Conceitos essenciais de computação em nuvem', 1, true, now(), now()),
    ('b0000000-0000-0000-0000-000000000005',
     'a0000000-0000-0000-0000-000000000002',
     'IAM & Security', 'Gerenciamento de identidade e acesso', 2, true, now(), now()),
    ('b0000000-0000-0000-0000-000000000006',
     'a0000000-0000-0000-0000-000000000002',
     'Core Services', 'S3, EC2 e serviços fundamentais da AWS', 3, true, now(), now());

-- Lições do Módulo 1 — Expo Fundamentos
INSERT INTO lessons (id, module_id, course_id, title, description, content, display_order, xp_reward, minimum_score, is_active, created_at, updated_at)
VALUES
    ('c0000000-0000-0000-0000-000000000001',
     'b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001',
     'O que é Expo?', 'Conheça a plataforma Expo e seus diferenciais',
     'Expo é uma plataforma open-source que facilita o desenvolvimento de apps React Native. Com o Expo, você pode criar apps para iOS, Android e Web a partir de um único código JavaScript/TypeScript.',
     1, 10, 70, true, now(), now()),
    ('c0000000-0000-0000-0000-000000000002',
     'b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001',
     'Configurando o ambiente', 'Instalação do Expo CLI e criação do primeiro projeto',
     'Para começar, instale o Node.js e o Expo CLI: npm install -g expo-cli. Depois crie um projeto: npx create-expo-app meu-app.',
     2, 10, 70, true, now(), now()),
    ('c0000000-0000-0000-0000-000000000003',
     'b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001',
     'Estrutura de um projeto Expo', 'Entendendo os arquivos e pastas do projeto',
     'Um projeto Expo contém: app.json (configurações), App.tsx (componente raiz), package.json (dependências) e a pasta assets (imagens e fontes).',
     3, 15, 70, true, now(), now());

-- Exercícios da Lição 1 (O que é Expo?)
INSERT INTO exercises (id, lesson_id, question, exercise_type, options, correct_answer, explanation, display_order, created_at, updated_at)
VALUES
    ('d0000000-0000-0000-0000-000000000001',
     'c0000000-0000-0000-0000-000000000001',
     'O que é o Expo?',
     'MULTIPLE_CHOICE',
     '["Uma IDE exclusiva para Android", "Uma plataforma open-source para criar apps React Native", "Um framework CSS para mobile", "Um banco de dados mobile"]'::jsonb,
     'Uma plataforma open-source para criar apps React Native',
     'Expo é uma plataforma open-source que facilita o desenvolvimento de apps React Native com ferramentas e serviços prontos para uso.',
     1, now(), now()),
    ('d0000000-0000-0000-0000-000000000002',
     'c0000000-0000-0000-0000-000000000001',
     'Em quais plataformas o Expo permite criar apps?',
     'MULTIPLE_CHOICE',
     '["Apenas Android", "Apenas iOS e Android", "iOS, Android e Web", "Apenas Web"]'::jsonb,
     'iOS, Android e Web',
     'Uma das principais vantagens do Expo é permitir criar apps para iOS, Android e Web a partir de um único código.',
     2, now(), now()),
    ('d0000000-0000-0000-0000-000000000003',
     'c0000000-0000-0000-0000-000000000001',
     'Expo é construído sobre o framework React Native.',
     'TRUE_FALSE',
     '["Verdadeiro", "Falso"]'::jsonb,
     'Verdadeiro',
     'Expo é construído sobre React Native, o framework JavaScript da Meta para desenvolvimento mobile.',
     3, now(), now());
