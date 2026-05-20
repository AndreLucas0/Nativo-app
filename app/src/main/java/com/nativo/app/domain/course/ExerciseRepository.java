package com.nativo.app.domain.course;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Repository for Exercise entity.
 * @SQLRestriction on Exercise ensures soft-deleted exercises are never returned.
 */
@Repository
public interface ExerciseRepository extends JpaRepository<Exercise, UUID> {

    /**
     * Returns all active exercises for a lesson, ordered by displayOrder.
     * Used when building lesson responses and validating completion attempts.
     */
    List<Exercise> findByLessonIdOrderByDisplayOrder(UUID lessonId);

    /**
     * Counts active exercises in a lesson.
     * Used for score calculation validation (all exercises must be attempted).
     */
    long countByLessonId(UUID lessonId);
}
