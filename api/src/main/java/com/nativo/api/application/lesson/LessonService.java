package com.nativo.api.application.lesson;

import com.nativo.api.application.gamification.GamificationService;
import com.nativo.api.application.progress.ProgressService;
import com.nativo.api.domain.course.Exercise;
import com.nativo.api.domain.course.ExerciseRepository;
import com.nativo.api.domain.course.Lesson;
import com.nativo.api.domain.course.LessonRepository;
import com.nativo.api.domain.progress.ExerciseAttempt;
import com.nativo.api.domain.progress.ExerciseAttemptRepository;
import com.nativo.api.domain.progress.LessonCompletion;
import com.nativo.api.domain.progress.LessonCompletionRepository;
import com.nativo.api.domain.progress.UserProgressRepository;
import com.nativo.api.domain.user.UserRepository;
import com.nativo.api.infrastructure.exception.ConflictException;
import com.nativo.api.infrastructure.exception.ForbiddenException;
import com.nativo.api.infrastructure.exception.ResourceNotFoundException;
import com.nativo.api.infrastructure.exception.ValidationException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LessonService {

    private final LessonRepository lessonRepository;
    private final ExerciseRepository exerciseRepository;
    private final LessonCompletionRepository lessonCompletionRepository;
    private final ExerciseAttemptRepository exerciseAttemptRepository;
    private final UserProgressRepository userProgressRepository;
    private final UserRepository userRepository;
    private final ProgressService progressService;
    private final GamificationService gamificationService;

    public LessonContentResponse getLessonContent(UUID lessonId, UUID userId) {
        var lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lição não encontrada."));

        if (!userProgressRepository.existsByUserIdAndCourseId(userId, lesson.getCourse().getId())) {
            throw new ForbiddenException("Você não está matriculado neste curso.");
        }

        checkLessonAccess(lesson, userId);

        var exercises = exerciseRepository.findByLessonIdOrderByDisplayOrderAsc(lessonId)
                .stream()
                .map(e -> new LessonContentResponse.ExerciseResponse(
                        e.getId(),
                        e.getQuestion(),
                        e.getExerciseType().name(),
                        e.getOptions(),
                        e.getDisplayOrder()
                ))
                .toList();

        boolean alreadyCompleted = lessonCompletionRepository.existsByUserIdAndLessonId(userId, lessonId);

        return new LessonContentResponse(
                lesson.getId(),
                lesson.getTitle(),
                lesson.getDescription(),
                lesson.getContent(),
                lesson.getXpReward(),
                lesson.getMinimumScore(),
                alreadyCompleted,
                exercises
        );
    }

    @Transactional
    public LessonCompleteResponse completeLesson(UUID lessonId, UUID userId) {
        var lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lição não encontrada."));

        var progress = userProgressRepository.findByUserIdAndCourseId(userId, lesson.getCourse().getId())
                .orElseThrow(() -> new ForbiddenException("Você não está matriculado neste curso."));

        if (lessonCompletionRepository.existsByUserIdAndLessonId(userId, lessonId)) {
            throw new ConflictException("Lição já concluída.");
        }

        var exercises = exerciseRepository.findByLessonIdOrderByDisplayOrderAsc(lessonId);

        int score;
        List<LessonCompleteResponse.ExerciseFeedback> feedbacks;

        if (exercises.isEmpty()) {
            score = 100;
            feedbacks = List.of();
        } else {
            var allAttempts = exerciseAttemptRepository.findByUserAndLesson(userId, lessonId);

            Map<UUID, ExerciseAttempt> latestByExercise = allAttempts.stream()
                    .collect(Collectors.toMap(
                            a -> a.getExercise().getId(),
                            a -> a,
                            (existing, replacement) -> replacement
                    ));

            Set<UUID> exerciseIds = exercises.stream()
                    .map(Exercise::getId)
                    .collect(Collectors.toSet());

            if (!latestByExercise.keySet().containsAll(exerciseIds)) {
                throw new ValidationException("Nem todos os exercícios foram respondidos.");
            }

            long correctCount = exercises.stream()
                    .filter(e -> latestByExercise.get(e.getId()).isCorrect())
                    .count();
            score = (int) Math.round(correctCount * 100.0 / exercises.size());

            feedbacks = exercises.stream()
                    .map(e -> {
                        var attempt = latestByExercise.get(e.getId());
                        return new LessonCompleteResponse.ExerciseFeedback(
                                e.getId(),
                                attempt.isCorrect(),
                                e.getExplanation()
                        );
                    })
                    .toList();
        }

        boolean passed = score >= lesson.getMinimumScore();
        int xpEarned = passed ? lesson.getXpReward() : 0;

        var user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));

        var completion = LessonCompletion.builder()
                .user(user)
                .lesson(lesson)
                .course(lesson.getCourse())
                .score(score)
                .xpEarned(xpEarned)
                .completedAt(Instant.now())
                .build();
        lessonCompletionRepository.save(completion);

        if (passed) {
            progressService.updateProgress(progress, lesson.getCourse().getId(), lesson);
            gamificationService.processXpAndStreak(user, progress, xpEarned);
            userRepository.save(user);
        }

        return new LessonCompleteResponse(
                passed,
                score,
                xpEarned,
                user.getTotalXp(),
                user.getCurrentLevel(),
                user.getCurrentStreak(),
                user.getLongestStreak(),
                progress.getProgressPercentage(),
                feedbacks
        );
    }

    private void checkLessonAccess(Lesson lesson, UUID userId) {
        var moduleLessons = lessonRepository
                .findByModuleIdAndActiveTrueOrderByDisplayOrderAsc(lesson.getModule().getId());

        int position = -1;
        for (int i = 0; i < moduleLessons.size(); i++) {
            if (moduleLessons.get(i).getId().equals(lesson.getId())) {
                position = i;
                break;
            }
        }

        if (position <= 0) return;

        Lesson previousLesson = moduleLessons.get(position - 1);
        if (!lessonCompletionRepository.existsByUserIdAndLessonId(userId, previousLesson.getId())) {
            throw new ForbiddenException("Conclua a lição anterior antes de prosseguir.");
        }
    }
}
