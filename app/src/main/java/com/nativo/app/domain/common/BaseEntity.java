package com.nativo.app.domain.common;

import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * Base class for all JPA entities.
 *
 * Provides automatic audit timestamps:
 * - createdAt: set once on first persist, never updated
 * - updatedAt: updated on every merge/save
 *
 * Both fields are stored as UTC LocalDateTime with column-level
 * precision of 3 (milliseconds). The UTC contract is enforced by
 * configuring the JVM/datasource timezone to UTC — not by this class.
 *
 * Requires @EnableJpaAuditing to be active (see JpaConfig).
 */
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class BaseEntity {

    /**
     * Timestamp of entity creation. Set automatically on persist.
     * Maps to created_at column (TIMESTAMP WITH TIME ZONE in PostgreSQL).
     */
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false, columnDefinition = "TIMESTAMP(3) WITH TIME ZONE")
    private LocalDateTime createdAt;

    /**
     * Timestamp of last update. Set automatically on persist and every merge.
     * Maps to updated_at column (TIMESTAMP WITH TIME ZONE in PostgreSQL).
     */
    @LastModifiedDate
    @Column(name = "updated_at", nullable = false, columnDefinition = "TIMESTAMP(3) WITH TIME ZONE")
    private LocalDateTime updatedAt;

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
