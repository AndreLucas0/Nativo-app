package com.nativo.api.application.progress;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record DashboardResponse(
        UserStats userStats,
        List<CourseProgressSummary> activeCourses,
        List<RecentCompletion> recentCompletions,
        List<UUID> passedLessonIds
) {
    public record UserStats(
            int totalXp,
            int currentLevel,
            int currentStreak,
            int longestStreak,
            LocalDate lastActivityDate
    ) {}

    public record CourseProgressSummary(
            UUID courseId,
            String courseTitle,
            String slug,
            String iconUrl,
            BigDecimal progressPercentage,
            int completedLessons
    ) {}

    public record RecentCompletion(
            UUID lessonId,
            String lessonTitle,
            UUID courseId,
            String courseTitle,
            int score,
            boolean passed,
            int xpEarned,
            Instant completedAt
    ) {}
}
