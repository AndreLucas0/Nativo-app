-- ============================================================
-- V5: Lições e exercícios para os Módulos 2 e 3 do curso Expo
-- ============================================================

-- ── Lições do Módulo 2 — Componentes ────────────────────────────────────────

INSERT INTO lessons (id, module_id, course_id, title, description, content, display_order, xp_reward, minimum_score, is_active, created_at, updated_at)
VALUES
    ('c0000000-0000-0000-0000-000000000004',
     'b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001',
     'View e Text',
     'Os dois componentes mais fundamentais do React Native',
     'View é o componente container mais básico do React Native, equivalente à <div> do HTML. Text é usado para exibir textos na tela. Toda string deve obrigatoriamente estar dentro de um componente Text — colocar texto diretamente em um View gera um erro de renderização.',
     1, 10, 70, true, now(), now()),

    ('c0000000-0000-0000-0000-000000000005',
     'b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001',
     'StyleSheet e Flexbox',
     'Estilizando componentes com JavaScript e organizando o layout',
     'No React Native os estilos são definidos com JavaScript usando StyleSheet.create(). O layout é feito com Flexbox — ao contrário do CSS web, o eixo principal padrão é vertical (flexDirection: ''column''). Use justifyContent para alinhar no eixo principal e alignItems no eixo cruzado.',
     2, 10, 70, true, now(), now()),

    ('c0000000-0000-0000-0000-000000000006',
     'b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001',
     'TouchableOpacity e Pressable',
     'Adicionando interatividade e feedback de toque',
     'TouchableOpacity reduz a opacidade do componente ao ser pressionado, fornecendo feedback visual ao usuário. Pressable é a alternativa mais moderna: aceita uma função no prop style, permitindo customizar a aparência para cada estado (pressed, hovered, focused). Para a maioria dos casos, Pressable é o componente preferido.',
     3, 15, 70, true, now(), now());

-- ── Exercícios — Lição 4 (View e Text) ──────────────────────────────────────

INSERT INTO exercises (id, lesson_id, question, exercise_type, options, correct_answer, explanation, display_order, created_at, updated_at)
VALUES
    ('d0000000-0000-0000-0000-000000000010',
     'c0000000-0000-0000-0000-000000000004',
     'Qual componente do React Native é equivalente à <div> do HTML?',
     'MULTIPLE_CHOICE',
     '["Container", "Box", "View", "Section"]'::jsonb,
     'View',
     'View é o bloco de construção fundamental para layout no React Native, cumprindo o mesmo papel de agrupamento e posicionamento que a <div> no HTML.',
     1, now(), now()),

    ('d0000000-0000-0000-0000-000000000011',
     'c0000000-0000-0000-0000-000000000004',
     'É possível colocar texto diretamente dentro de um View sem usar o componente Text.',
     'TRUE_FALSE',
     '["Verdadeiro", "Falso"]'::jsonb,
     'Falso',
     'Todo texto precisa estar dentro de um componente <Text>. Colocar uma string diretamente em <View> gera um erro de renderização no React Native.',
     2, now(), now()),

    ('d0000000-0000-0000-0000-000000000012',
     'c0000000-0000-0000-0000-000000000004',
     'Qual componente você usa para exibir um texto na tela no React Native?',
     'MULTIPLE_CHOICE',
     '["Label", "Span", "Paragraph", "Text"]'::jsonb,
     'Text',
     'O componente Text é o único responsável por renderizar strings no React Native. Diferente do HTML, não existe <p>, <span> ou <h1> — tudo passa pelo <Text>.',
     3, now(), now());

-- ── Exercícios — Lição 5 (StyleSheet e Flexbox) ─────────────────────────────

INSERT INTO exercises (id, lesson_id, question, exercise_type, options, correct_answer, explanation, display_order, created_at, updated_at)
VALUES
    ('d0000000-0000-0000-0000-000000000013',
     'c0000000-0000-0000-0000-000000000005',
     'Como os estilos são definidos no React Native?',
     'MULTIPLE_CHOICE',
     '["Arquivos CSS externos", "Classes Tailwind", "Sass/SCSS", "Objetos JavaScript via StyleSheet.create()"]'::jsonb,
     'Objetos JavaScript via StyleSheet.create()',
     'O React Native não usa CSS. Os estilos são objetos JavaScript passados para StyleSheet.create(), que valida as propriedades e aplica otimizações de performance.',
     1, now(), now()),

    ('d0000000-0000-0000-0000-000000000014',
     'c0000000-0000-0000-0000-000000000005',
     'Qual é o valor padrão de flexDirection no React Native?',
     'MULTIPLE_CHOICE',
     '["row", "row-reverse", "column-reverse", "column"]'::jsonb,
     'column',
     'Diferente do CSS web (que usa row por padrão), o React Native usa flexDirection: ''column'' por padrão, empilhando os filhos verticalmente.',
     2, now(), now()),

    ('d0000000-0000-0000-0000-000000000015',
     'c0000000-0000-0000-0000-000000000005',
     'StyleSheet.create() melhora a performance em relação a objetos de estilo definidos inline.',
     'TRUE_FALSE',
     '["Verdadeiro", "Falso"]'::jsonb,
     'Verdadeiro',
     'StyleSheet.create() serializa os estilos uma única vez e os envia ao bridge nativo como IDs numéricos, evitando serialização repetida a cada re-render.',
     3, now(), now());

-- ── Exercícios — Lição 6 (TouchableOpacity e Pressable) ─────────────────────

INSERT INTO exercises (id, lesson_id, question, exercise_type, options, correct_answer, explanation, display_order, created_at, updated_at)
VALUES
    ('d0000000-0000-0000-0000-000000000016',
     'c0000000-0000-0000-0000-000000000006',
     'O que acontece visualmente ao pressionar um TouchableOpacity?',
     'MULTIPLE_CHOICE',
     '["O componente some da tela", "A cor muda para vermelho", "A opacidade reduz, dando feedback visual", "O componente aumenta de tamanho"]'::jsonb,
     'A opacidade reduz, dando feedback visual',
     'TouchableOpacity diminui temporariamente a opacidade do componente filho ao ser pressionado, sinalizando ao usuário que o toque foi reconhecido.',
     1, now(), now()),

    ('d0000000-0000-0000-0000-000000000017',
     'c0000000-0000-0000-0000-000000000006',
     'Qual componente é mais moderno e permite customizar o estilo por estado (pressionado, focado)?',
     'MULTIPLE_CHOICE',
     '["Button", "TouchableHighlight", "TouchableOpacity", "Pressable"]'::jsonb,
     'Pressable',
     'Pressable aceita uma função no prop style, que recebe o estado atual ({ pressed, hovered, focused }) e retorna o objeto de estilo correspondente, oferecendo controle total sobre o feedback visual.',
     2, now(), now()),

    ('d0000000-0000-0000-0000-000000000018',
     'c0000000-0000-0000-0000-000000000006',
     'O componente Button nativo do React Native é altamente customizável visualmente.',
     'TRUE_FALSE',
     '["Verdadeiro", "Falso"]'::jsonb,
     'Falso',
     'O Button nativo tem aparência controlada pelo sistema operacional e oferece pouca flexibilidade visual. Para botões customizados, use TouchableOpacity ou Pressable.',
     3, now(), now());

-- ── Lições do Módulo 3 — Navegação ──────────────────────────────────────────

INSERT INTO lessons (id, module_id, course_id, title, description, content, display_order, xp_reward, minimum_score, is_active, created_at, updated_at)
VALUES
    ('c0000000-0000-0000-0000-000000000007',
     'b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001',
     'Introdução ao Expo Router',
     'Navegação baseada em arquivos inspirada no Next.js',
     'Expo Router usa roteamento baseado em arquivos: cada arquivo dentro da pasta app/ vira automaticamente uma rota. O arquivo app/index.tsx é a rota raiz (/). O arquivo _layout.tsx define a estrutura compartilhada entre as rotas de uma pasta — como o header ou a barra de abas.',
     1, 10, 70, true, now(), now()),

    ('c0000000-0000-0000-0000-000000000008',
     'b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001',
     'Rotas Dinâmicas',
     'Criando rotas com parâmetros usando colchetes',
     'Rotas dinâmicas usam colchetes no nome do arquivo: [id].tsx. Uma URL como /produto/42 renderiza o arquivo app/produto/[id].tsx passando id = ''42'' como parâmetro. O valor é acessado com o hook useLocalSearchParams() importado de expo-router.',
     2, 10, 70, true, now(), now()),

    ('c0000000-0000-0000-0000-000000000009',
     'b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001',
     'Layouts e Tab Navigation',
     'Criando barras de abas e layouts aninhados',
     'Um _layout.tsx com o componente <Tabs> cria automaticamente uma barra de abas inferior. Cada arquivo dentro da mesma pasta vira uma aba. Use <Tabs.Screen name="..." options={{ title, tabBarIcon }} /> para configurar título e ícone. Múltiplos _layout.tsx em pastas diferentes criam layouts aninhados.',
     3, 15, 70, true, now(), now());

-- ── Exercícios — Lição 7 (Introdução ao Expo Router) ────────────────────────

INSERT INTO exercises (id, lesson_id, question, exercise_type, options, correct_answer, explanation, display_order, created_at, updated_at)
VALUES
    ('d0000000-0000-0000-0000-000000000019',
     'c0000000-0000-0000-0000-000000000007',
     'Como o Expo Router define as rotas da aplicação?',
     'MULTIPLE_CHOICE',
     '["Configuração manual em um arquivo routes.json", "Registro em App.tsx via React Navigation", "Baseado na estrutura de arquivos dentro de app/", "Declaração em um array de objetos"]'::jsonb,
     'Baseado na estrutura de arquivos dentro de app/',
     'O Expo Router adota file-based routing: a estrutura de pastas e arquivos dentro de app/ determina automaticamente as rotas disponíveis, sem nenhuma configuração manual.',
     1, now(), now()),

    ('d0000000-0000-0000-0000-000000000020',
     'c0000000-0000-0000-0000-000000000007',
     'Qual arquivo define o layout compartilhado entre rotas de uma pasta no Expo Router?',
     'MULTIPLE_CHOICE',
     '["index.tsx", "routes.tsx", "layout.tsx", "_layout.tsx"]'::jsonb,
     '_layout.tsx',
     'O _layout.tsx é o arquivo especial do Expo Router que envolve todas as rotas de uma pasta. Nele você define Stack, Tabs ou qualquer estrutura de navegação compartilhada.',
     2, now(), now()),

    ('d0000000-0000-0000-0000-000000000021',
     'c0000000-0000-0000-0000-000000000007',
     'O Expo Router é inspirado no sistema de roteamento do Next.js.',
     'TRUE_FALSE',
     '["Verdadeiro", "Falso"]'::jsonb,
     'Verdadeiro',
     'O Expo Router traz o conceito de file-based routing, popularizado pelo Next.js no mundo web, para o desenvolvimento de apps mobile com React Native.',
     3, now(), now());

-- ── Exercícios — Lição 8 (Rotas Dinâmicas) ──────────────────────────────────

INSERT INTO exercises (id, lesson_id, question, exercise_type, options, correct_answer, explanation, display_order, created_at, updated_at)
VALUES
    ('d0000000-0000-0000-0000-000000000022',
     'c0000000-0000-0000-0000-000000000008',
     'Como nomear um arquivo para criar uma rota dinâmica no Expo Router?',
     'MULTIPLE_CHOICE',
     '[":id.tsx", "{id}.tsx", "id.tsx", "[id].tsx"]'::jsonb,
     '[id].tsx',
     'Colchetes no nome do arquivo indicam um segmento dinâmico. [id].tsx captura qualquer valor naquele segmento da URL e o disponibiliza como parâmetro id.',
     1, now(), now()),

    ('d0000000-0000-0000-0000-000000000023',
     'c0000000-0000-0000-0000-000000000008',
     'Qual hook lê os parâmetros de uma rota dinâmica no Expo Router?',
     'MULTIPLE_CHOICE',
     '["useParams()", "useRoute()", "useNavigation()", "useLocalSearchParams()"]'::jsonb,
     'useLocalSearchParams()',
     'useLocalSearchParams() retorna um objeto com todos os parâmetros da URL atual. Em uma rota [id].tsx, const { id } = useLocalSearchParams() entrega o valor do segmento dinâmico.',
     2, now(), now()),

    ('d0000000-0000-0000-0000-000000000024',
     'c0000000-0000-0000-0000-000000000008',
     'A URL /produto/123 é atendida pelo arquivo app/produto/[id].tsx com id = "123".',
     'TRUE_FALSE',
     '["Verdadeiro", "Falso"]'::jsonb,
     'Verdadeiro',
     'O Expo Router mapeia o segmento 123 da URL para o parâmetro id definido pelos colchetes no nome do arquivo, acessível via useLocalSearchParams().',
     3, now(), now());

-- ── Exercícios — Lição 9 (Layouts e Tab Navigation) ─────────────────────────

INSERT INTO exercises (id, lesson_id, question, exercise_type, options, correct_answer, explanation, display_order, created_at, updated_at)
VALUES
    ('d0000000-0000-0000-0000-000000000025',
     'c0000000-0000-0000-0000-000000000009',
     'Qual componente do Expo Router cria uma barra de abas (tab bar) na parte inferior?',
     'MULTIPLE_CHOICE',
     '["<Stack>", "<Drawer>", "<Modal>", "<Tabs>"]'::jsonb,
     '<Tabs>',
     'O componente <Tabs> do Expo Router gera automaticamente uma tab bar inferior. Cada arquivo na mesma pasta vira uma aba gerenciada por ele.',
     1, now(), now()),

    ('d0000000-0000-0000-0000-000000000026',
     'c0000000-0000-0000-0000-000000000009',
     'Em que arquivo você configura o ícone e o título de cada aba no Expo Router?',
     'MULTIPLE_CHOICE',
     '["index.tsx", "tabs.tsx", "navigation.tsx", "_layout.tsx"]'::jsonb,
     '_layout.tsx',
     'O _layout.tsx com <Tabs> é onde você usa <Tabs.Screen name="..." options={{ title, tabBarIcon }} /> para configurar cada aba individualmente.',
     2, now(), now()),

    ('d0000000-0000-0000-0000-000000000027',
     'c0000000-0000-0000-0000-000000000009',
     'É possível ter múltiplos _layout.tsx em diferentes pastas dentro de app/, criando layouts aninhados.',
     'TRUE_FALSE',
     '["Verdadeiro", "Falso"]'::jsonb,
     'Verdadeiro',
     'O Expo Router suporta layouts aninhados: cada subpasta pode ter seu próprio _layout.tsx. Por exemplo, uma aba pode ter sua própria Stack de telas com cabeçalho próprio.',
     3, now(), now());
