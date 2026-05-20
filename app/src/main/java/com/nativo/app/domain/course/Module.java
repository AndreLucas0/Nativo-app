package com.nativo.app.domain.course;

import com.nativo.app.domain.common.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Represents a module (group of lessons) within a course.
 *
 * Ordering within a course is controlled by displayOrder.
 * The unique constraint on (courseId, displayOrder) prevents
 * two modules from occupying the same position in a course.
 *
 * Soft delete: deletedAt is set on "deletion"; @SQLRestriction ensures
 * deleted modules are invisible in standard queries.
 */
@Entity
@Table(
    name = "modules",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_modules_course_order", columnNames = {"course_id", "display_order"})
    }
)
@SQLDelete(sql = "UPDATE modules SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
public class Module extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @NotNull(message = "Course is required")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "course_id", nullable = false,
                foreignKey = @ForeignKey(name = "fk_modules_course"))
    private Course course;

    @NotBlank(message = "Module name is required")
    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @NotBlank(message = "Module description is required")
    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

    @Positive(message = "Display order must be positive")
    @Column(name = "display_order", nullable = false)
    private int displayOrder;

    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;

    /**
     * Soft delete timestamp. Null means the module is active.
     * Set automatically by @SQLDelete on repository.delete().
     */
    @Column(name = "deleted_at", columnDefinition = "TIMESTAMP(3) WITH TIME ZONE")
    private LocalDateTime deletedAt;

    public Module(Course course, String name, String description, int displayOrder) {
        this.course = course;
        this.name = name;
        this.description = description;
        this.displayOrder = displayOrder;
    }

    /** Convenience method: returns true if this module has been soft-deleted. */
    public boolean isDeleted() {
        return deletedAt != null;
    }
}
