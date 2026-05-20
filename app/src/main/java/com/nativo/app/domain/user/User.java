package com.nativo.app.domain.user;

import com.nativo.app.domain.common.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Represents a platform user.
 *
 * Soft delete: deletedAt is set on "deletion"; @SQLRestriction ensures
 * all standard queries automatically filter out deleted records.
 */
@Entity
@Table(
    name = "users",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_users_email", columnNames = "email")
    }
)
@SQLDelete(sql = "UPDATE users SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
public class User extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Email(message = "Email must be a valid RFC 5322 address")
    @NotBlank(message = "Email is required")
    @Column(name = "email", nullable = false, unique = true, length = 255)
    private String email;

    @NotBlank(message = "Password hash is required")
    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @NotBlank(message = "Name is required")
    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Column(name = "profile_image_url")
    private String profileImageUrl;

    @Column(name = "total_xp", nullable = false)
    private int totalXp = 0;

    @Column(name = "current_level", nullable = false)
    private int currentLevel = 1;

    @Column(name = "current_streak", nullable = false)
    private int currentStreak = 0;

    @Column(name = "longest_streak", nullable = false)
    private int longestStreak = 0;

    @Column(name = "last_activity_date")
    private LocalDate lastActivityDate;

    /**
     * Soft delete timestamp. Null means the user is active.
     * Set automatically by @SQLDelete on repository.delete().
     */
    @Column(name = "deleted_at", columnDefinition = "TIMESTAMP(3) WITH TIME ZONE")
    private LocalDateTime deletedAt;

    public User(String email, String passwordHash, String name) {
        this.email = email;
        this.passwordHash = passwordHash;
        this.name = name;
    }

    /** Convenience method: returns true if this user has been soft-deleted. */
    public boolean isDeleted() {
        return deletedAt != null;
    }
}
