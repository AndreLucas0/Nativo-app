package com.nativo.api.application.exercise;

import com.nativo.api.domain.course.ExerciseRepository;
import com.nativo.api.domain.progress.ExerciseAttempt;
import com.nativo.api.domain.progress.ExerciseAttemptRepository;
import com.nativo.api.domain.progress.UserProgressRepository;
import com.nativo.api.domain.user.UserRepository;
import com.nativo.api.infrastructure.exception.ForbiddenException;
import com.nativo.api.infrastructure.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ExerciseService {

    private final ExerciseRepository exerciseRepository;
    private final ExerciseAttemptRepository exerciseAttemptRepository;
    private final UserProgressRepository userProgressRepository;
    private final UserRepository userRepository;

    @Transactional
    public ExerciseSubmitResponse submitAnswer(UUID exerciseId, UUID userId, ExerciseSubmitRequest request) {
        var exercise = exerciseRepository.findById(exerciseId)
                .orElseThrow(() -> new ResourceNotFoundException("Exercício não encontrado."));

        if (!userProgressRepository.existsByUserIdAndCourseId(userId, exercise.getLesson().getCourse().getId())) {
            throw new ForbiddenException("Você não está matriculado neste curso.");
        }

        var user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));

        boolean correct = exercise.getCorrectAnswer().trim()
                .equalsIgnoreCase(request.answer().trim());

        var attempt = ExerciseAttempt.builder()
                .user(user)
                .exercise(exercise)
                .givenAnswer(request.answer())
                .correct(correct)
                .attemptedAt(Instant.now())
                .build();

        var saved = exerciseAttemptRepository.save(attempt);

        return new ExerciseSubmitResponse(saved.getId(), correct, exercise.getExplanation());
    }
}
