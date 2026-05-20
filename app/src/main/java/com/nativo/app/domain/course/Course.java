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
 * Represents a technology course (e.g. Expo, AWS).
 *
 * Soft delete: deletedAt is set on "deletion"; @SQLRestriction ensures
 * all standard queries automatically filter out deleted records.
 * This allows user progress to remain intact even when a course is retired.
 */
@Entity
@Table(
    name = "courses",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_courses_slug", columnNames = "slug")
    }
)
@SQLDelete(sql = "UPDATE courses SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
public class Course extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @NotBlank(message = "Course name is required")
    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @NotBlank(message = "Course description is required")
    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

    @NotBlank(message = "Course slug is required")
    @Column(name = "slug", nullable = false, unique = true, length = 255)
    private String slug;

    @Column(name = "image_url", columnDefinition = "TEXT")
    private String imageUrl;

    @NotNull(message = "Difficulty is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "difficulty", nullable = false, length = 20)
    private Difficulty difficulty;

    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;

    @Positive(message = "Display order must be positive")
    @Column(name = "display_order", nullable = false)
    private int displayOrder;

    @Column(name = "estimated_hours")
    private Integer estimatedHours;

    /**
     * Soft delete timestamp. Null means the course is active.
     * Set automatically by @SQLDelete on repository.delete().
     */
    @Column(name = "deleted_at", columnDefinition = "TIMESTAMP(3) WITH TIME ZONE")
    private LocalDateTime deletedAt;

    public Course(String name, String description, String slug, Difficulty difficulty, int displayOrder) {
        this.name = name;
        this.description = description;
        this.slug = slug;
        this.difficulty = difficulty;
        this.displayOrder = displayOrder;
    }

    /** Convenience method: returns true if this course has been soft-deleted. */
    public boolean isDeleted() {
        return deletedAt != null;
    }
}
