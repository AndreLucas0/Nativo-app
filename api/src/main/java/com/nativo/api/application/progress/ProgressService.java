package com.nativo.api.application.progress;

import com.nativo.api.domain.course.Course;
import com.nativo.api.domain.course.CourseRepository;
import com.nativo.api.domain.course.Lesson;
import com.nativo.api.domain.course.LessonRepository;
import com.nativo.api.domain.progress.LessonCompletion;
import com.nativo.api.domain.progress.LessonCompletionRepository;
import com.nativo.api.domain.progress.UserProgress;
import com.nativo.api.domain.progress.UserProgressRepository;
import com.nativo.api.domain.user.User;
import com.nativo.api.domain.user.UserRepository;
import com.nativo.api.infrastructure.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProgressService {

    private final UserProgressRepository userProgressRepository;
    private final LessonCompletionRepository lessonCompletionRepository;
    private final LessonRepository lessonRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;

    public List<ProgressSummaryResponse> getAllProgress(UUID userId) {
        return userProgressRepository.findByUserId(userId)
                .stream()
                .map(p -> {
                    int totalLessons = lessonRepository.countByCourseIdAndActiveTrue(p.getCourse().getId());
                    return toProgressSummaryResponse(p, totalLessons);
                })
                .toList();
    }

    public CourseProgressResponse getCourseProgress(UUID userId, UUID courseId) {
        var progress = userProgressRepository.findByUserIdAndCourseId(userId, courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Progresso não encontrado para este curso."));

        int totalLessons = lessonRepository.countByCourseIdAndActiveTrue(courseId);
        var completions = lessonCompletionRepository.findByUserIdAndCourseIdOrderByCompletedAtDesc(userId, courseId);

        var lessonItems = completions.stream()
                .map(c -> new CourseProgressResponse.LessonProgressItem(
                        c.getLesson().getId(),
                        c.getLesson().getTitle(),
                        c.getScore(),
                        c.getXpEarned(),
                        c.getCompletedAt()
                ))
                .toList();

        return new CourseProgressResponse(
                progress.getCourse().getId(),
                progress.getCourse().getSlug(),
                progress.getCourse().getTitle(),
                progress.getProgressPercentage(),
                progress.getCompletedLessonsCount(),
                totalLessons,
                progress.getTotalXpEarned(),
                progress.getStartedAt(),
                progress.getCompletedAt(),
                lessonItems
        );
    }

    public DashboardResponse getDashboard(UUID userId) {
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));

        var userStats = new DashboardResponse.UserStats(
                user.getTotalXp(),
                user.getCurrentLevel(),
                user.getCurrentStreak(),
                user.getLongestStreak(),
                user.getLastActivityDate()
        );

        var activeCourses = userProgressRepository.findByUserId(userId).stream()
                .filter(p -> p.getCompletedAt() == null)
                .map(p -> new DashboardResponse.CourseProgressSummary(
                        p.getCourse().getId(),
                        p.getCourse().getTitle(),
                        p.getCourse().getSlug(),
                        p.getCourse().getIconUrl(),
                        p.getProgressPercentage(),
                        p.getCompletedLessonsCount()
                ))
                .toList();

        var recentCompletions = lessonCompletionRepository.findByUserIdOrderByCompletedAtDesc(userId)
                .stream()
                .limit(5)
                .map(c -> new DashboardResponse.RecentCompletion(
                        c.getLesson().getId(),
                        c.getLesson().getTitle(),
                        c.getCourse().getId(),
                        c.getCourse().getTitle(),
                        c.getScore(),
                        c.getXpEarned(),
                        c.getCompletedAt()
                ))
                .toList();

        return new DashboardResponse(userStats, activeCourses, recentCompletions);
    }

    @Transactional
    public void updateProgress(UserProgress progress, UUID courseId, Lesson completedLesson) {
        UUID userId = progress.getUser().getId();
        int completedCount = lessonCompletionRepository.countByUserIdAndCourseId(userId, courseId);
        int totalLessons = lessonRepository.countByCourseIdAndActiveTrue(courseId);

        BigDecimal percentage = totalLessons > 0
                ? BigDecimal.valueOf(completedCount * 100.0 / totalLessons).setScale(2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        progress.setCompletedLessonsCount(completedCount);
        progress.setProgressPercentage(percentage);
        progress.setCurrentLesson(completedLesson);

        if (totalLessons > 0 && completedCount >= totalLessons) {
            progress.setCompletedAt(Instant.now());
        }
    }

    private ProgressSummaryResponse toProgressSummaryResponse(UserProgress p, int totalLessons) {
        Course course = p.getCourse();
        return new ProgressSummaryResponse(
                course.getId(),
                course.getSlug(),
                course.getTitle(),
                course.getIconUrl(),
                p.getProgressPercentage(),
                p.getCompletedLessonsCount(),
                totalLessons,
                p.getTotalXpEarned(),
                p.getStartedAt(),
                p.getCompletedAt()
        );
    }
}
