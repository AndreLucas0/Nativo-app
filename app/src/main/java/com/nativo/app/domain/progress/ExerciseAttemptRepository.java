package com.nativo.app.domain.progress;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Repository for ExerciseAttempt entity.
 */
@Repository
public interface ExerciseAttemptRepository extends JpaRepository<ExerciseAttempt, UUID> {

    /**
     * Returns all attempts by a user for a specific exercise.
     * Used for error pattern analysis and attempt history.
     */
    List<ExerciseAttempt> findByUserIdAndExerciseId(UUID userId, UUID exerciseId);

    /**
     * Returns all attempts by a user within a specific lesson.
     * Used when processing lesson completion to retrieve submitted answers.
     */
    List<ExerciseAttempt> findByUserIdAndLessonId(UUID userId, UUID lessonId);
}
