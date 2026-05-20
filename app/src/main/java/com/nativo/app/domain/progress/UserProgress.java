package com.nativo.app.domain.progress;

import com.nativo.app.domain.course.Course;
import com.nativo.app.domain.course.Lesson;
import com.nativo.app.domain.course.Module;
import com.nativo.app.domain.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Tracks a user's overall progress within a specific course.
 *
 * One record per (user, course) pair — enforced by the unique constraint.
 * Stores counters, current position, and timestamps for dashboard and
 * progress percentage calculations.
 *
 * Does NOT extend BaseEntity because the audit fields here follow the
 * same pattern but this entity has no soft delete and has its own
 * startedAt / completedAt semantics alongside createdAt / updatedAt.
 */
@Entity
@Table(
    name = "user_progress",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_user_progress_user_course", columnNames = {"user_id", "course_id"})
    }
)
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
public class UserProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    /** The user this progress record belongs to. CASCADE: deleted when user is deleted. */
    @NotNull(message = "User is required")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false,
                foreignKey = @ForeignKey(name = "fk_user_progress_user"))
    private User user;

    /** The course being tracked. RESTRICT: course cannot be deleted while progress exists. */
    @NotNull(message = "Course is required")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "course_id", nullable = false,
                foreignKey = @ForeignKey(name = "fk_user_progress_course"))
    private Course course;

    /** Current module the user is working on. Nullable until the user starts a module. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "current_module_id",
                foreignKey = @ForeignKey(name = "fk_user_progress_module"))
    private Module currentModule;

    /** Current lesson the user is working on. Nullable until the user starts a lesson. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "current_lesson_id",
                foreignKey = @ForeignKey(name = "fk_user_progress_lesson"))
    private Lesson currentLesson;

    @Min(value = 0, message = "Total XP earned cannot be negative")
    @Column(name = "total_xp_earned", nullable = false)
    private int totalXpEarned = 0;

    @Min(value = 0, message = "Completed lessons count cannot be negative")
    @Column(name = "completed_lessons_count", nullable = false)
    private int completedLessonsCount = 0;

    /** Last time the user accessed this course. Updated on every lesson interaction. */
    @Column(name = "last_accessed_at", columnDefinition = "TIMESTAMP(3) WITH TIME ZONE")
    private LocalDateTime lastAccessedAt;

    /** When the user first started this course. Set once on record creation. */
    @Column(name = "started_at", nullable = false, updatable = false,
            columnDefinition = "TIMESTAMP(3) WITH TIME ZONE")
    private LocalDateTime startedAt;

    /** Set when completedLessonsCount reaches totalLessonsCount. */
    @Column(name = "completed_at", columnDefinition = "TIMESTAMP(3) WITH TIME ZONE")
    private LocalDateTime completedAt;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false,
            columnDefinition = "TIMESTAMP(3) WITH TIME ZONE")
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false,
            columnDefinition = "TIMESTAMP(3) WITH TIME ZONE")
    private LocalDateTime updatedAt;

    public UserProgress(User user, Course course) {
        this.user = user;
        this.course = course;
        this.startedAt = LocalDateTime.now();
    }

    /**
     * Calculates progress percentage based on completed vs total lessons.
     * Returns 0 if totalLessonsCount is 0 to avoid division by zero.
     *
     * @param totalLessonsCount total number of active lessons in the course
     * @return percentage (0–100)
     */
    public double calculateProgressPercentage(int totalLessonsCount) {
        if (totalLessonsCount == 0) return 0.0;
        return (completedLessonsCount * 100.0) / totalLessonsCount;
    }

    /** Returns true if the course has been fully completed. */
    public boolean isCompleted() {
        return completedAt != null;
    }
}
