package com.nativo.app.domain.progress;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Repository for LessonCompletion entity.
 */
@Repository
public interface LessonCompletionRepository extends JpaRepository<LessonCompletion, UUID> {

    /**
     * Returns all completions for a user within a specific course.
     * Used for course progress detail and dashboard responses.
     */
    List<LessonCompletion> findAllByUserIdAndCourseId(UUID userId, UUID courseId);

    /**
     * Counts how many times a user has completed a specific lesson.
     * Used to determine the attemptNumber for the next completion record.
     */
    long countByUserIdAndLessonId(UUID userId, UUID lessonId);

    /**
     * Checks whether a user has already completed a lesson on a given day.
     * Used by XpAndLevelService to enforce the "XP only on first completion per day" rule.
     *
     * @param userId   the user's ID
     * @param lessonId the lesson's ID
     * @param start    start of the day (inclusive), e.g. today at 00:00:00
     * @param end      end of the day (exclusive), e.g. tomorrow at 00:00:00
     */
    boolean existsByUserIdAndLessonIdAndCompletedAtBetween(
            UUID userId, UUID lessonId,
            LocalDateTime start, LocalDateTime end);
}
