// ARQUIVO: app/atividade/[id].tsx
// Tela de exercícios de uma lição. Recebe o ID da lição pela rota dinâmica.
// Fluxo: carrega a lição → exibe exercícios um por um → usuário seleciona resposta
// → API valida → feedback animado → próximo exercício → tela de conclusão.

import { useState, useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, StatusBar, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { X, Heart, Check, XCircle, Lock } from 'lucide-react-native';
import { api, ApiError, LessonContentResponse, ExerciseSubmitResponse, LessonCompleteResponse } from '../../services/api';
import { useLives } from '../../context/LivesContext';

// Tipos auxiliares extraídos dos tipos da API
type Exercise = LessonContentResponse['exercises'][number];
type FeedbackState = { correct: boolean; explanation: string } | null;

export default function AtividadeScreen() {
  // Lê o parâmetro dinâmico [id] da URL (ID da lição)
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets(); // margem segura para notch/home bar

  // Estado da lição carregada da API
  const [lesson, setLesson]       = useState<LessonContentResponse | null>(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [errorIs403, setErrorIs403] = useState(false); // 403 = lição bloqueada

  const { lives, decrementLives } = useLives();

  // Estado do progresso do exercício atual
  const [currentIndex, setCurrentIndex]       = useState(0);      // índice do exercício atual
  const [selectedOption, setSelectedOption]   = useState<number | null>(null); // opção escolhida
  const [feedback, setFeedback]               = useState<FeedbackState>(null); // resultado da submissão
  const [correctCount, setCorrectCount]       = useState(0);      // total de acertos
  const [isFinished, setIsFinished]           = useState(false);  // true quando todos os exercícios foram feitos
  const [completionResult, setCompletionResult] = useState<LessonCompleteResponse | null>(null);
  const [submitting, setSubmitting]           = useState(false);  // evita duplo envio
  const [networkError, setNetworkError]       = useState<string | null>(null); // erro temporário de rede
  const [isReplay, setIsReplay]               = useState(false);  // true se a lição já foi concluída antes

  // Valor animado para o painel de feedback (desliza de baixo para cima)
  const slideAnim = useRef(new Animated.Value(300)).current;

  // Carrega a lição sempre que o ID mudar (inclui reset de todos os estados)
  useEffect(() => {
    if (!id) return;

    // Reseta todos os estados para uma nova tentativa
    setLesson(null);
    setLoading(true);
    setError('');
    setErrorIs403(false);
    setCurrentIndex(0);
    setSelectedOption(null);
    setFeedback(null);
    setCorrectCount(0);
    setIsFinished(false);
    setCompletionResult(null);
    setSubmitting(false);
    setNetworkError(null);
    setIsReplay(false);

    api.get<LessonContentResponse>(`/api/lessons/${id}`)
      .then((data) => {
        setLesson(data);
        if (data.alreadyCompleted) setIsReplay(true); // sinaliza revisão (sem XP adicional)
      })
      .catch((err) => {
        if (err instanceof ApiError && err.status === 403) {
          setErrorIs403(true);
          setError('Conclua a lição anterior para desbloquear esta.'); // lição bloqueada
        } else {
          setError(err?.message ?? 'Erro ao carregar a lição.');
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  // ── Telas de estado: carregando, erro, sem exercícios ────────────────────────

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <StatusBar barStyle="light-content" />
        <ActivityIndicator color="#35f600" size="large" />
      </View>
    );
  }

  if (error || !lesson) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 24 }]}>
        <StatusBar barStyle="light-content" />
        {errorIs403 && <Lock size={52} color="#555" style={{ marginBottom: 16 }} />}
        <Text style={{ color: errorIs403 ? '#888' : '#FF4D6D', fontSize: 16, textAlign: 'center', marginBottom: 20 }}>
          {error || 'Lição não encontrada.'}
        </Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Ordena os exercícios pela ordem de exibição definida no backend
  const exercises      = (lesson.exercises ?? []).sort((a, b) => a.displayOrder - b.displayOrder);
  const totalExercises = exercises.length;
  const exercise: Exercise | undefined = exercises[currentIndex];
  const progress = totalExercises > 0 ? currentIndex / totalExercises : 0; // 0.0 a 1.0

  if (totalExercises === 0) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 24 }]}>
        <StatusBar barStyle="light-content" />
        <Text style={{ color: '#888', fontSize: 16, textAlign: 'center', marginBottom: 20 }}>
          Esta lição ainda não tem exercícios disponíveis.
        </Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Submissão de resposta ────────────────────────────────────────────────────
  // Chamado ao tocar em uma opção. Envia para a API e recebe o feedback.
  const handleSelect = async (optionIndex: number) => {
    if (feedback || submitting) return; // ignora toque enquanto já há feedback ou envio em curso
    setSelectedOption(optionIndex);
    setSubmitting(true);

    try {
      const result = await api.post<ExerciseSubmitResponse>(
        `/api/exercises/${exercise.id}/submit`,
        { answer: exercise.options[optionIndex] }, // envia o texto da opção escolhida
      );

      setFeedback({ correct: result.correct, explanation: result.explanation });
      if (result.correct) {
        setCorrectCount((prev) => prev + 1); // incrementa acertos
      } else {
        decrementLives(); // consome 1 vida ao errar
      }
    } catch {
      // Falha de rede: não penaliza o usuário, permite tentar novamente
      setSelectedOption(null);
      setSubmitting(false);
      setNetworkError('Sem conexão. Tente novamente.');
      setTimeout(() => setNetworkError(null), 3000);
      return;
    } finally {
      setSubmitting(false);
    }

    // Anima o painel de feedback deslizando de baixo para cima
    Animated.spring(slideAnim, {
      toValue: 0, useNativeDriver: true, tension: 80, friction: 9,
    }).start();
  };

  // ── Avançar para o próximo exercício (ou concluir a lição) ───────────────────
  const handleContinue = () => {
    // Primeiro desliza o painel para baixo (animação de saída)
    Animated.timing(slideAnim, {
      toValue: 300, duration: 180, useNativeDriver: true,
    }).start(async () => {
      if (currentIndex < totalExercises - 1) {
        // Ainda há exercícios → avança para o próximo
        setCurrentIndex((prev) => prev + 1);
        setSelectedOption(null);
        setFeedback(null);
      } else {
        // Último exercício → notifica o backend que a lição foi concluída
        try {
          const result = await api.post<LessonCompleteResponse>(`/api/lessons/${lesson.id}/complete`);
          setCompletionResult(result); // guarda XP ganho, aprovação etc.
        } catch {
          // Ignora erro (ex: lição já concluída anteriormente)
        }
        setIsFinished(true); // exibe a tela de conclusão
      }
    });
  };

  // ── Funções de estilo dinâmico das opções ────────────────────────────────────
  // Retorna o estilo da opção (normal, correta ou errada) com base no feedback

  const getOptionStyle = (i: number) => {
    if (!feedback) return styles.option;
    if (feedback.correct && i === selectedOption) return styles.optionCorrect;
    if (!feedback.correct && i === selectedOption) return styles.optionWrong;
    return styles.option;
  };

  // Cor da borda direita do número da opção
  const getNumberBorderColor = (i: number) => {
    if (!feedback) return '#333';
    if (feedback.correct && i === selectedOption) return '#35f600';
    if (!feedback.correct && i === selectedOption) return '#FF4D6D';
    return '#333';
  };

  // Cor de fundo do número da opção
  const getNumberBg = (i: number) => {
    if (!feedback) return 'transparent';
    if (feedback.correct && i === selectedOption) return '#0d2e00';
    if (!feedback.correct && i === selectedOption) return '#330018';
    return 'transparent';
  };

  // Cor do texto do número da opção
  const getNumberTextColor = (i: number) => {
    if (!feedback) return '#888';
    if (feedback.correct && i === selectedOption) return '#35f600';
    if (!feedback.correct && i === selectedOption) return '#FF4D6D';
    return '#888';
  };

  // ── Tela de conclusão da lição ───────────────────────────────────────────────
  if (isFinished) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <StatusBar barStyle="light-content" />
        <View style={styles.completionContainer}>
          {/* Emoji de comemoração ou derrota */}
          <Text style={styles.completionEmoji}>{completionResult?.passed !== false ? '🎉' : '😓'}</Text>
          <Text style={styles.completionTitle}>
            {completionResult?.passed !== false ? 'Atividade concluída!' : 'Não foi dessa vez...'}
          </Text>
          <Text style={styles.completionSubtitle}>{lesson.title}</Text>
          {/* Placar de acertos */}
          <Text style={styles.completionScore}>{correctCount}/{totalExercises} corretas</Text>
          {/* Badge de XP ganho (só aparece se ganhou XP) */}
          {completionResult && completionResult.xpEarned > 0 && (
            <View style={styles.xpBadge}>
              <Text style={styles.xpBadgeText}>+{completionResult.xpEarned} XP</Text>
            </View>
          )}
          {/* Badge de revisão (sem XP adicional) */}
          {isReplay && !completionResult && (
            <View style={styles.replayBadge}>
              <Text style={styles.replayBadgeText}>Lição já concluída · Sem XP adicional</Text>
            </View>
          )}
          {/* Botão para voltar à trilha */}
          <TouchableOpacity style={styles.continueBtn} onPress={() => router.back()}>
            <Text style={styles.continueBtnText}>CONTINUAR</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ── Tela principal do exercício ──────────────────────────────────────────────
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" />

      {/* HEADER: botão fechar + barra de progresso + contador de vidas */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn} hitSlop={12}>
          <X size={20} color="#888" strokeWidth={2.5} />
        </TouchableOpacity>
        {/* Barra de progresso: largura proporcional ao índice atual */}
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
        <View style={styles.livesRow}>
          <Heart size={20} color="#FF4D6D" fill="#FF4D6D" />
          <Text style={styles.livesText}>{lives}</Text>
        </View>
      </View>

      {/* BANNER DE REVISÃO: aparece quando a lição já foi concluída antes */}
      {isReplay && (
        <View style={styles.replayBanner}>
          <Text style={styles.replayBannerText}>Revisando lição já concluída · Sem XP adicional</Text>
        </View>
      )}

      {/* BANNER DE ERRO DE REDE: aparece por 3 segundos quando a submissão falha */}
      {networkError && (
        <View style={styles.networkErrorBanner}>
          <Text style={styles.networkErrorText}>{networkError}</Text>
        </View>
      )}

      {/* PERGUNTA E OPÇÕES DE RESPOSTA */}
      <View style={styles.content}>
        <Text style={styles.questionText}>{exercise.question}</Text>
        <View style={styles.optionsContainer}>
          {exercise.options.map((option, i) => (
            <TouchableOpacity
              key={i}
              style={getOptionStyle(i)}
              onPress={() => handleSelect(i)}
              activeOpacity={feedback || submitting ? 1 : 0.7} // desativa feedback visual durante submissão
            >
              {/* Número da opção (1, 2, 3...) com cor dinâmica */}
              <View
                style={[
                  styles.numberBox,
                  { borderRightColor: getNumberBorderColor(i), backgroundColor: getNumberBg(i) },
                ]}
              >
                <Text style={[styles.numberText, { color: getNumberTextColor(i) }]}>{i + 1}</Text>
              </View>
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* PAINEL DE FEEDBACK: aparece animado após o usuário responder */}
      {feedback && (
        <Animated.View
          style={[
            styles.feedbackPanel,
            feedback.correct ? styles.feedbackCorrect : styles.feedbackWrong,
            { transform: [{ translateY: slideAnim }], paddingBottom: insets.bottom + 16 },
          ]}
        >
          <View style={styles.feedbackRow}>
            <View style={styles.feedbackLeft}>
              {/* Ícone de check (acerto) ou X (erro) */}
              {feedback.correct
                ? <Check size={30} color="#35f600" strokeWidth={3} />
                : <XCircle size={30} color="#FF4D6D" />
              }
              <View style={styles.feedbackTexts}>
                <Text style={[styles.feedbackTitle, { color: feedback.correct ? '#35f600' : '#FF4D6D' }]}>
                  {feedback.correct ? 'Mandou bem!' : 'Resposta incorreta'}
                </Text>
                {/* Explicação da resposta correta vinda do backend */}
                <Text style={styles.feedbackExplanation}>{feedback.explanation}</Text>
              </View>
            </View>
            {/* Botão para avançar ao próximo exercício */}
            <TouchableOpacity style={styles.continueBtn} onPress={handleContinue}>
              <Text style={styles.continueBtnText}>CONTINUAR</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111' },

  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 14, gap: 12,
  },
  closeBtn:     { padding: 4 },
  progressBar:  { flex: 1, height: 16, backgroundColor: '#2a2a2a', borderRadius: 8, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#35f600', borderRadius: 8 },
  livesRow:     { flexDirection: 'row', alignItems: 'center', gap: 4 },
  livesText:    { color: '#FF4D6D', fontWeight: 'bold', fontSize: 16 },

  replayBanner: {
    backgroundColor: '#1a1a00', borderBottomWidth: 1, borderBottomColor: '#3a3a00',
    paddingHorizontal: 16, paddingVertical: 8, alignItems: 'center',
  },
  replayBannerText: { color: '#888800', fontSize: 12, fontWeight: '600' },

  networkErrorBanner: {
    backgroundColor: '#2a0000', borderBottomWidth: 1, borderBottomColor: '#550000',
    paddingHorizontal: 16, paddingVertical: 8, alignItems: 'center',
  },
  networkErrorText: { color: '#FF4D6D', fontSize: 13, fontWeight: '600' },

  content:          { flex: 1, paddingHorizontal: 20, paddingTop: 28 },
  questionText:     { color: '#fff', fontSize: 22, fontWeight: 'bold', lineHeight: 30, marginBottom: 32 },
  optionsContainer: { gap: 12 },

  option: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#1c1c1e',
    borderRadius: 14, borderWidth: 2, borderColor: '#333', overflow: 'hidden', minHeight: 56,
  },
  optionCorrect: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#0a2200',
    borderRadius: 14, borderWidth: 2, borderColor: '#35f600', overflow: 'hidden', minHeight: 56,
  },
  optionWrong: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#220011',
    borderRadius: 14, borderWidth: 2, borderColor: '#FF4D6D', overflow: 'hidden', minHeight: 56,
  },

  numberBox: {
    width: 48, alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center',
    borderRightWidth: 2, borderRightColor: '#333',
  },
  numberText: { color: '#888', fontSize: 14, fontWeight: 'bold' },
  optionText: { color: '#fff', fontSize: 15, paddingHorizontal: 14, flex: 1, paddingVertical: 12 },

  feedbackPanel: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 20, paddingHorizontal: 20,
  },
  feedbackCorrect:     { backgroundColor: '#0a2200' },
  feedbackWrong:       { backgroundColor: '#220011' },
  feedbackRow:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  feedbackLeft:        { flexDirection: 'row', alignItems: 'flex-start', gap: 10, flex: 1 },
  feedbackTexts:       { flex: 1 },
  feedbackTitle:       { fontSize: 17, fontWeight: 'bold', marginBottom: 3 },
  feedbackExplanation: { color: '#9a9a9a', fontSize: 12, lineHeight: 17 },

  continueBtn:     { backgroundColor: '#35f600', borderRadius: 12, paddingVertical: 14, paddingHorizontal: 18, alignSelf: 'center' },
  continueBtnText: { color: '#000', fontWeight: 'bold', fontSize: 14 },

  completionContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16, paddingHorizontal: 40 },
  completionEmoji:     { fontSize: 72 },
  completionTitle:     { color: '#fff', fontSize: 26, fontWeight: 'bold', textAlign: 'center' },
  completionSubtitle:  { color: '#888', fontSize: 15, textAlign: 'center' },
  completionScore:     { color: '#35f600', fontSize: 22, fontWeight: 'bold' },
  xpBadge: {
    backgroundColor: '#1a3a00', borderRadius: 20, paddingHorizontal: 20, paddingVertical: 8,
    borderWidth: 1, borderColor: '#35f600',
  },
  xpBadgeText:  { color: '#35f600', fontSize: 18, fontWeight: 'bold' },
  replayBadge: {
    backgroundColor: '#1a1a1a', borderRadius: 20, paddingHorizontal: 20, paddingVertical: 8,
    borderWidth: 1, borderColor: '#444',
  },
  replayBadgeText: { color: '#888', fontSize: 14, fontWeight: '600' },

  backButton:     { backgroundColor: '#35f600', borderRadius: 12, paddingVertical: 12, paddingHorizontal: 28 },
  backButtonText: { color: '#000', fontWeight: 'bold', fontSize: 15 },
});
