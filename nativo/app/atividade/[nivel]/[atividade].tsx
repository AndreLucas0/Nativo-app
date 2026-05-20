import { useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { X, Heart, Check, XCircle } from 'lucide-react-native';
import { levels } from '../../../data/questions';

export default function AtividadeScreen() {
  const { nivel, atividade } = useLocalSearchParams<{ nivel: string; atividade: string }>();
  const insets = useSafeAreaInsets();

  const nivelIndex = parseInt(nivel ?? '1') - 1;
  const atividadeIndex = parseInt(atividade ?? '1') - 1;

  const levelData = levels[nivelIndex];
  const activityData = levelData?.activities[atividadeIndex];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [lives, setLives] = useState(5);
  const [correctCount, setCorrectCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const slideAnim = useRef(new Animated.Value(300)).current;

  if (!activityData) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <StatusBar barStyle="light-content" />
        <Text style={{ color: '#fff', fontSize: 16 }}>Atividade não encontrada.</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const questions = activityData.questions;
  const totalQuestions = questions.length;
  const question = questions[currentIndex];
  const progress = currentIndex / totalQuestions;
  const isCorrect = selectedOption !== null && selectedOption === question.correctIndex;

  const handleSelect = (optionIndex: number) => {
    if (hasAnswered) return;
    setSelectedOption(optionIndex);
    setHasAnswered(true);
    if (optionIndex !== question.correctIndex) {
      setLives((prev) => Math.max(0, prev - 1));
    } else {
      setCorrectCount((prev) => prev + 1);
    }
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 80,
      friction: 9,
    }).start();
  };

  const handleContinue = () => {
    Animated.timing(slideAnim, {
      toValue: 300,
      duration: 180,
      useNativeDriver: true,
    }).start(() => {
      if (currentIndex < totalQuestions - 1) {
        setCurrentIndex((prev) => prev + 1);
        setSelectedOption(null);
        setHasAnswered(false);
      } else {
        setIsFinished(true);
      }
    });
  };

  const getOptionStyle = (i: number) => {
    if (!hasAnswered) return styles.option;
    if (i === question.correctIndex) return styles.optionCorrect;
    if (i === selectedOption) return styles.optionWrong;
    return styles.option;
  };

  const getNumberBorderColor = (i: number) => {
    if (!hasAnswered) return '#333';
    if (i === question.correctIndex) return '#35f600';
    if (i === selectedOption) return '#FF4D6D';
    return '#333';
  };

  const getNumberBg = (i: number) => {
    if (!hasAnswered) return 'transparent';
    if (i === question.correctIndex) return '#0d2e00';
    if (i === selectedOption) return '#330018';
    return 'transparent';
  };

  const getNumberTextColor = (i: number) => {
    if (!hasAnswered) return '#888';
    if (i === question.correctIndex) return '#35f600';
    if (i === selectedOption) return '#FF4D6D';
    return '#888';
  };

  if (isFinished) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <StatusBar barStyle="light-content" />
        <View style={styles.completionContainer}>
          <Text style={styles.completionEmoji}>🎉</Text>
          <Text style={styles.completionTitle}>Atividade concluída!</Text>
          <Text style={styles.completionSubtitle}>
            {levelData.label} — Atividade {activityData.id}
          </Text>
          <Text style={styles.completionScore}>
            {correctCount}/{totalQuestions} corretas
          </Text>
          <TouchableOpacity style={styles.continueBtn} onPress={() => router.back()}>
            <Text style={styles.continueBtnText}>CONTINUAR</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn} hitSlop={12}>
          <X size={20} color="#888" strokeWidth={2.5} />
        </TouchableOpacity>

        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>

        <View style={styles.livesRow}>
          <Heart size={20} color="#FF4D6D" fill="#FF4D6D" />
          <Text style={styles.livesText}>{lives}</Text>
        </View>
      </View>

      {/* QUESTION */}
      <View style={styles.content}>
        <Text style={styles.questionText}>{question.text}</Text>

        <View style={styles.optionsContainer}>
          {question.options.map((option, i) => (
            <TouchableOpacity
              key={i}
              style={getOptionStyle(i)}
              onPress={() => handleSelect(i)}
              activeOpacity={hasAnswered ? 1 : 0.7}
            >
              <View
                style={[
                  styles.numberBox,
                  {
                    borderRightColor: getNumberBorderColor(i),
                    backgroundColor: getNumberBg(i),
                  },
                ]}
              >
                <Text style={[styles.numberText, { color: getNumberTextColor(i) }]}>
                  {i + 1}
                </Text>
              </View>
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* FEEDBACK PANEL */}
      <Animated.View
        style={[
          styles.feedbackPanel,
          isCorrect ? styles.feedbackCorrect : styles.feedbackWrong,
          { transform: [{ translateY: slideAnim }], paddingBottom: insets.bottom + 16 },
        ]}
      >
        <View style={styles.feedbackRow}>
          <View style={styles.feedbackLeft}>
            {isCorrect
              ? <Check size={30} color="#35f600" strokeWidth={3} />
              : <XCircle size={30} color="#FF4D6D" />
            }
            <View style={styles.feedbackTexts}>
              <Text style={[styles.feedbackTitle, { color: isCorrect ? '#35f600' : '#FF4D6D' }]}>
                {isCorrect ? 'Mandou bem!' : 'Resposta incorreta'}
              </Text>
              {!isCorrect && (
                <Text style={styles.feedbackCorrectLabel}>
                  Correta: {question.options[question.correctIndex]}
                </Text>
              )}
              <Text style={styles.feedbackExplanation}>{question.explanation}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.continueBtn} onPress={handleContinue}>
            <Text style={styles.continueBtnText}>CONTINUAR</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  closeBtn: {
    padding: 4,
  },
  progressBar: {
    flex: 1,
    height: 16,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#35f600',
    borderRadius: 8,
  },
  livesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  livesText: {
    color: '#FF4D6D',
    fontWeight: 'bold',
    fontSize: 16,
  },

  // Content
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 28,
  },
  questionText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    lineHeight: 30,
    marginBottom: 32,
  },
  optionsContainer: {
    gap: 12,
  },

  // Option base
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1c1c1e',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#333',
    overflow: 'hidden',
    minHeight: 56,
  },
  optionCorrect: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0a2200',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#35f600',
    overflow: 'hidden',
    minHeight: 56,
  },
  optionWrong: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#220011',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#FF4D6D',
    overflow: 'hidden',
    minHeight: 56,
  },

  // Number box inside option
  numberBox: {
    width: 48,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 2,
    borderRightColor: '#333',
  },
  numberText: {
    color: '#888',
    fontSize: 14,
    fontWeight: 'bold',
  },
  optionText: {
    color: '#fff',
    fontSize: 15,
    paddingHorizontal: 14,
    flex: 1,
    paddingVertical: 12,
  },

  // Feedback panel
  feedbackPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  feedbackCorrect: {
    backgroundColor: '#0a2200',
  },
  feedbackWrong: {
    backgroundColor: '#220011',
  },
  feedbackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  feedbackLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    flex: 1,
  },
  feedbackTexts: {
    flex: 1,
  },
  feedbackTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  feedbackCorrectLabel: {
    color: '#FF4D6D',
    fontSize: 12,
    marginBottom: 3,
  },
  feedbackExplanation: {
    color: '#9a9a9a',
    fontSize: 12,
    lineHeight: 17,
  },

  // Continue button
  continueBtn: {
    backgroundColor: '#35f600',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignSelf: 'center',
  },
  continueBtnText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
  },

  // Completion screen
  completionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 40,
  },
  completionEmoji: {
    fontSize: 72,
  },
  completionTitle: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  completionSubtitle: {
    color: '#888',
    fontSize: 15,
  },
  completionScore: {
    color: '#35f600',
    fontSize: 22,
    fontWeight: 'bold',
  },

  // Error screen
  backButton: {
    marginTop: 20,
    backgroundColor: '#35f600',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 28,
  },
  backButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
