package com.nativo.app.domain.progress;

import com.nativo.app.domain.course.Exercise;
import com.nativo.app.domain.course.Lesson;
import com.nativo.app.domain.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Records a single attempt at an exercise by a user.
 *
 * Multiple records per (userId, exerciseId) are allowed — each submission
 * creates a new record. This history enables error pattern analysis and
 * the intelligent review feature (Fase 2).
 *
 * attemptedAt uses millisecond precision (TIMESTAMP(3)) as required by REQ-8.
 *
 * No soft delete — attempt records are immutable historical facts.
 * No updatedAt — once created, this record never changes.
 */
@Entity
@Table(name = "exercise_attempts")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
public class ExerciseAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    /** The user who attempted the exercise. CASCADE: deleted when user is deleted. */
    @NotNull(message = "User is required")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false,
                foreignKey = @ForeignKey(name = "fk_exercise_attempts_user"))
    private User user;

    /** The exercise that was attempted. RESTRICT: exercise cannot be deleted while attempts exist. */
    @NotNull(message = "Exercise is required")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "exercise_id", nullable = false,
                foreignKey = @ForeignKey(name = "fk_exercise_attempts_exercise"))
    private Exercise exercise;

    /**
     * Denormalized for efficient lesson-level attempt queries
     * without joining through exercises.
     */
    @NotNull(message = "Lesson is required")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "lesson_id", nullable = false,
                foreignKey = @ForeignKey(name = "fk_exercise_attempts_lesson"))
    private Lesson lesson;

    /** The answer submitted by the user. Stored for error pattern analysis. */
    @NotBlank(message = "User answer is required")
    @Column(name = "user_answer", nullable = false, columnDefinition = "TEXT")
    private String userAnswer;

    /** Whether the submitted answer was correct. */
    @NotNull(message = "isCorrect is required")
    @Column(name = "is_correct", nullable = false)
    private Boolean isCorrect;

    /**
     * When the attempt was made. Millisecond precision required by REQ-8.
     * Set explicitly by the service layer (not via @CreatedDate) to allow
     * precise control over the timestamp value.
     */
    @NotNull(message = "Attempted at is required")
    @Column(name = "attempted_at", nullable = false,
            columnDefinition = "TIMESTAMP(3) WITH TIME ZONE")
    private LocalDateTime attemptedAt;

    /** Time the user spent on this exercise, in seconds. Nullable — engagement metrics use. */
    @Column(name = "time_spent_seconds")
    private Integer timeSpentSeconds;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false,
            columnDefinition = "TIMESTAMP(3) WITH TIME ZONE")
    private LocalDateTime createdAt;

    public ExerciseAttempt(User user, Exercise exercise, Lesson lesson,
                           String userAnswer, boolean isCorrect,
                           LocalDateTime attemptedAt) {
        this.user = user;
        this.exercise = exercise;
        this.lesson = lesson;
        this.userAnswer = userAnswer;
        this.isCorrect = isCorrect;
        this.attemptedAt = attemptedAt;
    }
}
