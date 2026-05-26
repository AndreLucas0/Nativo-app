package com.nativo.api.domain.progress;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface LessonCompletionRepository extends JpaRepository<LessonCompletion, UUID> {
    boolean existsByUserIdAndLessonId(UUID userId, UUID lessonId);
    int countByUserIdAndCourseId(UUID userId, UUID courseId);
    List<LessonCompletion> findByUserIdAndCourseIdOrderByCompletedAtDesc(UUID userId, UUID courseId);
    List<LessonCompletion> findByUserIdOrderByCompletedAtDesc(UUID userId);
}
