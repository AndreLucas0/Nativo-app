package com.nativo.app.domain.course;

import com.nativo.app.domain.common.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Represents a learning unit (lesson) within a module.
 *
 * Each lesson contains content and a set of exercises.
 * Ordering within a module is controlled by displayOrder.
 * The unique constraint on (moduleId, displayOrder) prevents
 * two lessons from occupying the same position in a module.
 *
 * Soft delete: deletedAt is set on "deletion"; @SQLRestriction ensures
 * deleted lessons are invisible in standard queries.
 */
@Entity
@Table(
    name = "lessons",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_lessons_module_order", columnNames = {"module_id", "display_order"})
    }
)
@SQLDelete(sql = "UPDATE lessons SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
public class Lesson extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @NotNull(message = "Module is required")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "module_id", nullable = false,
                foreignKey = @ForeignKey(name = "fk_lessons_module"))
    private Module module;

    @NotBlank(message = "Lesson name is required")
    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @NotBlank(message = "Lesson content is required")
    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    @Positive(message = "Display order must be positive")
    @Column(name = "display_order", nullable = false)
    private int displayOrder;

    @Min(value = 0, message = "XP reward cannot be negative")
    @Column(name = "xp_reward", nullable = false)
    private int xpReward = 10;

    /**
     * Minimum score (0–100) required to pass this lesson.
     * Validated at both Bean Validation and database CHECK constraint levels.
     */
    @Min(value = 0, message = "Minimum score cannot be less than 0")
    @Max(value = 100, message = "Minimum score cannot be greater than 100")
    @Column(name = "minimum_score", nullable = false)
    private int minimumScore = 70;

    @Column(name = "estimated_minutes")
    private Integer estimatedMinutes;

    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;

    /**
     * Soft delete timestamp. Null means the lesson is active.
     * Set automatically by @SQLDelete on repository.delete().
     */
    @Column(name = "deleted_at", columnDefinition = "TIMESTAMP(3) WITH TIME ZONE")
    private LocalDateTime deletedAt;

    public Lesson(Module module, String name, String content, int displayOrder) {
        this.module = module;
        this.name = name;
        this.content = content;
        this.displayOrder = displayOrder;
    }

    /** Convenience method: returns true if this lesson has been soft-deleted. */
    public boolean isDeleted() {
        return deletedAt != null;
    }
}
