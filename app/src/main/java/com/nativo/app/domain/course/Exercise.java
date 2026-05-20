package com.nativo.app.domain.course;

import com.nativo.app.domain.common.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Represents an interactive exercise within a lesson.
 *
 * Supports multiple exercise types (MULTIPLE_CHOICE, TRUE_FALSE, FILL_CODE,
 * MATCH, ORDER_STEPS) via the {@link ExerciseType} enum.
 *
 * The {@code options} field is stored as JSONB in PostgreSQL, allowing
 * flexible structure per exercise type without schema changes.
 *
 * Soft delete: deletedAt is set on "deletion"; @SQLRestriction ensures
 * deleted exercises are invisible in standard queries.
 */
@Entity
@Table(
    name = "exercises",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_exercises_lesson_order", columnNames = {"lesson_id", "display_order"})
    }
)
@SQLDelete(sql = "UPDATE exercises SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
public class Exercise extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @NotNull(message = "Lesson is required")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "lesson_id", nullable = false,
                foreignKey = @ForeignKey(name = "fk_exercises_lesson"))
    private Lesson lesson;

    @NotNull(message = "Exercise type is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, length = 20)
    private ExerciseType type;

    @NotBlank(message = "Question is required")
    @Column(name = "question", nullable = false, columnDefinition = "TEXT")
    private String question;

    /**
     * JSON array/object with answer options.
     * Required for MULTIPLE_CHOICE and MATCH types; nullable for others.
     * Stored as JSONB in PostgreSQL for efficient querying.
     * Mapped as String — deserialization to specific types is handled in the service layer.
     */
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "options", columnDefinition = "jsonb")
    private String options;

    @NotBlank(message = "Correct answer is required")
    @Column(name = "correct_answer", nullable = false, columnDefinition = "TEXT")
    private String correctAnswer;

    @Column(name = "explanation", columnDefinition = "TEXT")
    private String explanation;

    @Positive(message = "Display order must be positive")
    @Column(name = "display_order", nullable = false)
    private int displayOrder;

    @Min(value = 0, message = "Points cannot be negative")
    @Column(name = "points", nullable = false)
    private int points = 10;

    /**
     * Optional difficulty level for adaptive learning (Fase 2 preparation).
     * Nullable — not all exercises need a difficulty classification initially.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "difficulty_level", length = 10)
    private DifficultyLevel difficultyLevel;

    /**
     * Soft delete timestamp. Null means the exercise is active.
     * Set automatically by @SQLDelete on repository.delete().
     */
    @Column(name = "deleted_at", columnDefinition = "TIMESTAMP(3) WITH TIME ZONE")
    private LocalDateTime deletedAt;

    public Exercise(Lesson lesson, ExerciseType type, String question,
                    String correctAnswer, int displayOrder) {
        this.lesson = lesson;
        this.type = type;
        this.question = question;
        this.correctAnswer = correctAnswer;
        this.displayOrder = displayOrder;
    }

    /** Convenience method: returns true if this exercise has been soft-deleted. */
    public boolean isDeleted() {
        return deletedAt != null;
    }
}
