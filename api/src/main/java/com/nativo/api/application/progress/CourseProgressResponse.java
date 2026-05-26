package com.nativo.api.application.progress;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record CourseProgressResponse(
        UUID courseId,
        String courseSlug,
        String courseTitle,
        BigDecimal progressPercentage,
        int completedLessons,
        int totalLessons,
        int totalXpEarned,
        Instant startedAt,
        Instant completedAt,
        List<LessonProgressItem> completedLessonsList
) {
    public record LessonProgressItem(
            UUID lessonId,
            String lessonTitle,
            int score,
            int xpEarned,
            Instant completedAt
    ) {}
}
