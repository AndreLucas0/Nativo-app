package com.nativo.app.domain.progress;

import com.nativo.app.domain.course.Course;
import com.nativo.app.domain.course.Lesson;
import com.nativo.app.domain.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Records a single completion of a lesson by a user.
 *
 * Multiple records per (userId, lessonId) are allowed — each attempt
 * at a lesson creates a new record with an incremented attemptNumber.
 * This history supports analytics and the intelligent review feature (Fase 2).
 *
 * No soft delete — completion records are immutable historical facts.
 * No updatedAt — once created, this record never changes.
 */
@Entity
@Table(name = "lesson_completions")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
public class LessonCompletion {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    /** The user who completed the lesson. CASCADE: deleted when user is deleted. */
    @NotNull(message = "User is required")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false,
                foreignKey = @ForeignKey(name = "fk_lesson_completions_user"))
    private User user;

    /** The lesson that was completed. RESTRICT: lesson cannot be deleted while completions exist. */
    @NotNull(message = "Lesson is required")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "lesson_id", nullable = false,
                foreignKey = @ForeignKey(name = "fk_lesson_completions_lesson"))
    private Lesson lesson;

    /** Denormalized for efficient course-level progress queries without joining through modules. */
    @NotNull(message = "Course is required")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "course_id", nullable = false,
                foreignKey = @ForeignKey(name = "fk_lesson_completions_course"))
    private Course course;

    /** Score achieved (0–100). */
    @Min(value = 0, message = "Score cannot be less than 0")
    @Max(value = 100, message = "Score cannot be greater than 100")
    @Column(name = "score", nullable = false)
    private int score;

    /** XP awarded for this completion (0 if repeated on the same day). */
    @Min(value = 0, message = "XP earned cannot be negative")
    @Column(name = "xp_earned", nullable = false)
    private int xpEarned;

    /** When the lesson was completed. */
    @NotNull(message = "Completed at is required")
    @Column(name = "completed_at", nullable = false,
            columnDefinition = "TIMESTAMP(3) WITH TIME ZONE")
    private LocalDateTime completedAt;

    /** Time the user spent on this lesson attempt, in seconds. Nullable — analytics use. */
    @Column(name = "time_spent_seconds")
    private Integer timeSpentSeconds;

    /**
     * Attempt number for this lesson (1 = first attempt, 2 = second, etc.).
     * Incremented by the service layer based on existing completion count.
     */
    @Min(value = 1, message = "Attempt number must be at least 1")
    @Column(name = "attempt_number", nullable = false)
    private int attemptNumber = 1;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false,
            columnDefinition = "TIMESTAMP(3) WITH TIME ZONE")
    private LocalDateTime createdAt;

    public LessonCompletion(User user, Lesson lesson, Course course,
                            int score, int xpEarned, LocalDateTime completedAt,
                            int attemptNumber) {
        this.user = user;
        this.lesson = lesson;
        this.course = course;
        this.score = score;
        this.xpEarned = xpEarned;
        this.completedAt = completedAt;
        this.attemptNumber = attemptNumber;
    }

    /** Returns true if the user passed this lesson (score >= lesson's minimumScore). */
    public boolean passed(int minimumScore) {
        return this.score >= minimumScore;
    }
}
