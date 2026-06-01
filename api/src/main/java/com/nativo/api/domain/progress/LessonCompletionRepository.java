package com.nativo.api.domain.progress;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface LessonCompletionRepository extends JpaRepository<LessonCompletion, UUID> {
    boolean existsByUserIdAndLessonId(UUID userId, UUID lessonId);
    int countByUserIdAndCourseId(UUID userId, UUID courseId);
    List<LessonCompletion> findByUserIdAndCourseIdOrderByCompletedAtDesc(UUID userId, UUID courseId);
    List<LessonCompletion> findByUserIdOrderByCompletedAtDesc(UUID userId);

    @Query("SELECT DISTINCT lc.lesson.id FROM LessonCompletion lc WHERE lc.user.id = :userId AND lc.score >= lc.lesson.minimumScore")
    List<UUID> findPassedLessonIdsByUserId(@Param("userId") UUID userId);

    @Query("SELECT COUNT(lc) > 0 FROM LessonCompletion lc WHERE lc.user.id = :userId AND lc.lesson.id = :lessonId AND lc.score >= lc.lesson.minimumScore")
    boolean existsPassedByUserIdAndLessonId(@Param("userId") UUID userId, @Param("lessonId") UUID lessonId);
}
