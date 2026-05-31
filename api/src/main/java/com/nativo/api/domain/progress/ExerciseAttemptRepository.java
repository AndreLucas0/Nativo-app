package com.nativo.api.domain.progress;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface ExerciseAttemptRepository extends JpaRepository<ExerciseAttempt, UUID> {

    @Query("SELECT ea FROM ExerciseAttempt ea WHERE ea.user.id = :userId AND ea.exercise.lesson.id = :lessonId ORDER BY ea.attemptedAt ASC")
    List<ExerciseAttempt> findByUserAndLesson(@Param("userId") UUID userId, @Param("lessonId") UUID lessonId);
}
