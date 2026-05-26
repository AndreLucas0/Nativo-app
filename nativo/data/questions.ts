export type Question = {
  id: number;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type Activity = {
  id: number;
  questions: Question[];
};

export type Level = {
  id: number;
  name: string;
  label: string;
  activities: Activity[];
};

export const levels: Level[] = [
  {
    id: 1,
    name: 'Básico',
    label: 'Nível 1',
    activities: [
      {
        id: 1,
        questions: [
          {
            id: 1,
            text: 'O que é o Expo?',
            options: ['Um banco de dados', 'Um framework para React Native', 'Um sistema operacional', 'Uma linguagem de programação'],
            correctIndex: 1,
            explanation: 'Expo é um framework que facilita o desenvolvimento de apps com React Native.',
          },
          {
            id: 2,
            text: 'Qual comando cria um projeto Expo?',
            options: ['expo init app', 'npm create expo@latest', 'react-native new', 'expo create project --android-only'],
            correctIndex: 1,
            explanation: '"npm create expo@latest" é o comando oficial e atual para criar projetos Expo.',
          },
          {
            id: 3,
            text: 'O arquivo principal normalmente usado no Expo é:',
            options: ['server.js', 'index.html', 'App.js', 'main.py'],
            correctIndex: 2,
            explanation: 'No Expo, o ponto de entrada padrão é o App.js (ou App.tsx com TypeScript).',
          },
          {
            id: 4,
            text: 'O React Native usa qual linguagem?',
            options: ['Java', 'Python', 'JavaScript', 'C++'],
            correctIndex: 2,
            explanation: 'React Native usa JavaScript (ou TypeScript) como linguagem principal.',
          },
        ],
      },
      {
        id: 2,
        questions: [
          {
            id: 5,
            text: 'Qual componente é usado para exibir texto?',
            options: ['<Div>', '<Text>', '<Label>', '<Span>'],
            correctIndex: 1,
            explanation: 'Em React Native, todo texto precisa estar dentro de <Text>.',
          },
          {
            id: 6,
            text: 'Qual componente funciona como uma "div" no React Native?',
            options: ['<Container>', '<Section>', '<View>', '<Box>'],
            correctIndex: 2,
            explanation: '<View> é o equivalente à <div> do HTML no React Native.',
          },
          {
            id: 7,
            text: 'Para estilizar componentes no React Native usamos:',
            options: ['CSS puro', 'Tailwind obrigatório', 'StyleSheet', 'Bootstrap'],
            correctIndex: 2,
            explanation: 'StyleSheet.create() é a forma padrão de estilizar componentes no React Native.',
          },
          {
            id: 8,
            text: 'Qual hook é usado para criar estado?',
            options: ['useFetch()', 'useState()', 'useData()', 'createState()'],
            correctIndex: 1,
            explanation: 'useState() é o hook do React para criar e gerenciar estado em componentes funcionais.',
          },
        ],
      },
      {
        id: 3,
        questions: [
          {
            id: 9,
            text: 'Qual comando inicia o servidor Expo?',
            options: ['npm run mobile', 'expo run', 'npx expo start', 'react-native start-app'],
            correctIndex: 2,
            explanation: '"npx expo start" inicia o servidor de desenvolvimento do Expo.',
          },
          {
            id: 10,
            text: 'O que o componente <Image> faz?',
            options: ['Toca áudio', 'Mostra imagens', 'Cria animações', 'Faz requisições HTTP'],
            correctIndex: 1,
            explanation: '<Image> exibe imagens locais ou da internet no React Native.',
          },
          {
            id: 11,
            text: 'Qual extensão é mais comum em componentes React Native?',
            options: ['.exe', '.java', '.jsx', '.sql'],
            correctIndex: 2,
            explanation: '.jsx (ou .tsx para TypeScript) é a extensão padrão de componentes React.',
          },
          {
            id: 12,
            text: 'O comando npm install serve para:',
            options: ['Criar APK', 'Instalar dependências', 'Apagar bibliotecas', 'Criar componentes'],
            correctIndex: 1,
            explanation: '"npm install" instala todas as dependências listadas no package.json.',
          },
        ],
      },
    ],
  },
  {
    id: 2,
    name: 'Intermediário',
    label: 'Nível 2',
    activities: [
      {
        id: 1,
        questions: [
          {
            id: 13,
            text: 'O que o useEffect() faz?',
            options: ['Cria estilos', 'Executa efeitos colaterais', 'Cria rotas', 'Faz deploy automático'],
            correctIndex: 1,
            explanation: 'useEffect() executa efeitos colaterais como fetch de dados, subscriptions e timers.',
          },
          {
            id: 14,
            text: 'Qual biblioteca é muito usada para navegação?',
            options: ['Axios', 'Redux', 'React Navigation', 'Native Base'],
            correctIndex: 2,
            explanation: 'React Navigation é a biblioteca mais popular para navegação em React Native.',
          },
          {
            id: 15,
            text: 'O Flexbox no React Native é usado para:',
            options: ['Banco de dados', 'Layout e posicionamento', 'Navegação', 'Requisições HTTP'],
            correctIndex: 1,
            explanation: 'Flexbox define como os elementos são dispostos e posicionados na tela.',
          },
          {
            id: 16,
            text: 'Qual propriedade define direção horizontal?',
            options: ['justifyContent', 'alignItems', "flexDirection: 'row'", 'display: inline'],
            correctIndex: 2,
            explanation: "flexDirection: 'row' organiza os elementos filhos na direção horizontal.",
          },
        ],
      },
      {
        id: 2,
        questions: [
          {
            id: 17,
            text: 'Qual componente detecta toques do usuário?',
            options: ['<TouchableOpacity>', '<ScrollArea>', '<GestureBox>', '<ClickView>'],
            correctIndex: 0,
            explanation: '<TouchableOpacity> detecta toques e aplica feedback visual de opacidade.',
          },
          {
            id: 18,
            text: 'Qual biblioteca é comum para requisições HTTP?',
            options: ['Redux', 'Axios', 'Jest', 'Expo Router'],
            correctIndex: 1,
            explanation: 'Axios é a biblioteca HTTP mais popular em projetos React Native.',
          },
          {
            id: 19,
            text: 'O que o props faz?',
            options: ['Armazena banco de dados', 'Passa dados entre componentes', 'Cria APIs', 'Faz deploy do app'],
            correctIndex: 1,
            explanation: 'props permite passar dados de componentes pai para componentes filho.',
          },
          {
            id: 20,
            text: 'O Expo Go serve para:',
            options: ['Hospedar backend', 'Rodar apps Expo no celular', 'Compilar APK automaticamente', 'Editar código'],
            correctIndex: 1,
            explanation: 'Expo Go permite testar apps Expo diretamente no celular sem precisar compilar.',
          },
        ],
      },
      {
        id: 3,
        questions: [
          {
            id: 21,
            text: 'O ScrollView é usado quando:',
            options: ['Queremos criar animações', 'Precisamos de rolagem na tela', 'Precisamos acessar câmera', 'Queremos salvar dados localmente'],
            correctIndex: 1,
            explanation: 'ScrollView permite rolar conteúdo quando ele ultrapassa o tamanho da tela.',
          },
          {
            id: 22,
            text: 'O que o console.log() faz?',
            options: ['Cria variáveis', 'Exibe informações no console', 'Renderiza componentes', 'Faz navegação entre telas'],
            correctIndex: 1,
            explanation: 'console.log() exibe valores no terminal para auxiliar na depuração do código.',
          },
          {
            id: 23,
            text: 'O que o SafeAreaView ajuda a evitar?',
            options: ['Erros de rede', 'Sobreposição em notch/barra do sistema', 'Problemas de banco de dados', 'Falhas de animação'],
            correctIndex: 1,
            explanation: 'SafeAreaView evita que conteúdo fique atrás do notch ou barra de status do dispositivo.',
          },
          {
            id: 24,
            text: 'O que o map() geralmente faz no React Native?',
            options: ['Cria APIs', 'Percorre arrays renderizando elementos', 'Cria navegação', 'Instala dependências'],
            correctIndex: 1,
            explanation: 'map() percorre um array e retorna um novo array de elementos renderizados na tela.',
          },
        ],
      },
    ],
  },
  {
    id: 3,
    name: 'Avançado',
    label: 'Nível 3',
    activities: [
      {
        id: 1,
        questions: [
          {
            id: 25,
            text: 'O que é renderização no React Native?',
            options: ['Processo de compilar APK', 'Processo de exibir componentes na tela', 'Processo de instalar bibliotecas', 'Processo de criar APIs'],
            correctIndex: 1,
            explanation: 'Renderização é o processo de transformar componentes React em elementos visuais na tela.',
          },
          {
            id: 26,
            text: 'Qual hook evita recriações desnecessárias de funções?',
            options: ['useState', 'useEffect', 'useCallback', 'useRef'],
            correctIndex: 2,
            explanation: 'useCallback() memoriza funções para evitar que sejam recriadas a cada renderização.',
          },
          {
            id: 27,
            text: 'O useRef() pode ser usado para:',
            options: ['Navegação', 'Referenciar elementos sem rerender', 'Criar APIs REST', 'Estilizar componentes'],
            correctIndex: 1,
            explanation: 'useRef() referencia elementos nativos ou armazena valores sem disparar nova renderização.',
          },
          {
            id: 28,
            text: 'O que o async/await resolve?',
            options: ['Layout responsivo', 'Operações assíncronas', 'Estilização dinâmica', 'Navegação entre telas'],
            correctIndex: 1,
            explanation: 'async/await simplifica o tratamento de Promises e operações assíncronas.',
          },
        ],
      },
      {
        id: 2,
        questions: [
          {
            id: 29,
            text: 'Qual opção melhora performance em listas grandes?',
            options: ['ScrollView', 'View', 'FlatList', 'SafeAreaView'],
            correctIndex: 2,
            explanation: 'FlatList renderiza apenas os itens visíveis na tela, economizando memória e melhorando a performance.',
          },
          {
            id: 30,
            text: 'O que é estado global?',
            options: ['Estado compartilhado entre múltiplos componentes', 'Memória do celular', 'Banco de dados remoto', 'Sistema operacional'],
            correctIndex: 0,
            explanation: 'Estado global é acessível por múltiplos componentes sem precisar passar props manualmente.',
          },
          {
            id: 31,
            text: 'Qual ferramenta é muito usada para estado global?',
            options: ['Redux', 'Expo Camera', 'AsyncStorage', 'Axios'],
            correctIndex: 0,
            explanation: 'Redux é o gerenciador de estado global mais popular no ecossistema React.',
          },
          {
            id: 32,
            text: 'O AsyncStorage serve para:',
            options: ['Criar animações', 'Armazenar dados localmente', 'Criar APIs', 'Renderizar listas'],
            correctIndex: 1,
            explanation: 'AsyncStorage armazena dados no dispositivo de forma persistente e assíncrona.',
          },
        ],
      },
      {
        id: 3,
        questions: [
          {
            id: 33,
            text: 'O que significa componente reutilizável?',
            options: ['Um componente usado apenas uma vez', 'Um componente que pode ser reaproveitado', 'Um componente exclusivo do Expo', 'Um componente sem props'],
            correctIndex: 1,
            explanation: 'Componentes reutilizáveis podem ser usados em múltiplos lugares do app com diferentes props.',
          },
          {
            id: 34,
            text: 'Qual é a principal vantagem do Expo?',
            options: ['Não precisa programar', 'Facilita desenvolvimento mobile React Native', 'Funciona apenas no iPhone', 'Não usa JavaScript'],
            correctIndex: 1,
            explanation: 'Expo simplifica o setup e desenvolvimento de apps React Native com ferramentas integradas.',
          },
          {
            id: 35,
            text: 'O que o keyExtractor faz em uma FlatList?',
            options: ['Cria animações', 'Define chaves únicas para itens da lista', 'Faz chamadas HTTP', 'Cria componentes automaticamente'],
            correctIndex: 1,
            explanation: 'keyExtractor define a chave única de cada item para que o React identifique e otimize a lista.',
          },
          {
            id: 36,
            text: 'O que acontece quando um estado muda no React Native?',
            options: ['O aplicativo reinicia', 'O componente pode ser rerenderizado', 'O banco de dados é apagado', 'O Expo fecha automaticamente'],
            correctIndex: 1,
            explanation: 'Quando o estado muda, o React rerenderiza o componente com os novos dados.',
          },
        ],
      },
    ],
  },
];
