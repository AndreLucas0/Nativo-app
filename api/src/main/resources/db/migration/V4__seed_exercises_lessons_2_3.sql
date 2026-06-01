-- ============================================================
-- V4: Exercícios para as lições 2 e 3 do curso Expo
-- ============================================================

-- Exercícios da Lição 2 (Configurando o ambiente)
INSERT INTO exercises (id, lesson_id, question, exercise_type, options, correct_answer, explanation, display_order, created_at, updated_at)
VALUES
    ('d0000000-0000-0000-0000-000000000004',
     'c0000000-0000-0000-0000-000000000002',
     'Qual comando instala o Expo CLI globalmente?',
     'MULTIPLE_CHOICE',
     '["npm install expo-cli", "npm install -g expo-cli", "npx expo install", "yarn add expo"]'::jsonb,
     'npm install -g expo-cli',
     'A flag -g instala o pacote de forma global, disponibilizando o comando expo em qualquer diretório do sistema.',
     1, now(), now()),

    ('d0000000-0000-0000-0000-000000000005',
     'c0000000-0000-0000-0000-000000000002',
     'Qual comando cria um novo projeto Expo chamado "meu-app"?',
     'MULTIPLE_CHOICE',
     '["expo new meu-app", "npx create-expo-app meu-app", "npm init expo meu-app", "expo create meu-app"]'::jsonb,
     'npx create-expo-app meu-app',
     'O comando oficial para criar projetos Expo é npx create-expo-app, que baixa e executa o gerador sem precisar de instalação global.',
     2, now(), now()),

    ('d0000000-0000-0000-0000-000000000006',
     'c0000000-0000-0000-0000-000000000002',
     'O Node.js é um pré-requisito obrigatório para usar o Expo CLI.',
     'TRUE_FALSE',
     '["Verdadeiro", "Falso"]'::jsonb,
     'Verdadeiro',
     'O Expo CLI é executado sobre Node.js, portanto o Node.js precisa estar instalado antes de qualquer comando npm ou npx.',
     3, now(), now());

-- Exercícios da Lição 3 (Estrutura de um projeto Expo)
INSERT INTO exercises (id, lesson_id, question, exercise_type, options, correct_answer, explanation, display_order, created_at, updated_at)
VALUES
    ('d0000000-0000-0000-0000-000000000007',
     'c0000000-0000-0000-0000-000000000003',
     'Qual arquivo contém as configurações gerais de um projeto Expo (nome, ícone, orientação)?',
     'MULTIPLE_CHOICE',
     '["package.json", "tsconfig.json", "app.json", "metro.config.js"]'::jsonb,
     'app.json',
     'O app.json (ou app.config.js para configuração dinâmica) centraliza todas as configurações do projeto Expo como nome, slug, ícone e permissões.',
     1, now(), now()),

    ('d0000000-0000-0000-0000-000000000008',
     'c0000000-0000-0000-0000-000000000003',
     'Onde ficam armazenadas as imagens e fontes de um projeto Expo por convenção?',
     'MULTIPLE_CHOICE',
     '["src/", "public/", "assets/", "static/"]'::jsonb,
     'assets/',
     'A pasta assets/ é a convenção do Expo para guardar recursos estáticos como imagens, ícones, splash screens e fontes.',
     2, now(), now()),

    ('d0000000-0000-0000-0000-000000000009',
     'c0000000-0000-0000-0000-000000000003',
     'O arquivo package.json lista as dependências e scripts do projeto.',
     'TRUE_FALSE',
     '["Verdadeiro", "Falso"]'::jsonb,
     'Verdadeiro',
     'O package.json é o manifesto Node.js do projeto: define nome, versão, scripts (start, build, test) e todas as dependências npm.',
     3, now(), now());
