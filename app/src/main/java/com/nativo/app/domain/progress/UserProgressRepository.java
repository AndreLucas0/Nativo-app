package com.nativo.app.domain.progress;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository for UserProgress entity.
 */
@Repository
public interface UserProgressRepository extends JpaRepository<UserProgress, UUID> {

    /**
     * Finds a user's progress record for a specific course.
     * Used for progress updates, conflict detection (409), and dashboard.
     */
    Optional<UserProgress> findByUserIdAndCourseId(UUID userId, UUID courseId);

    /**
     * Returns all progress records for a user across all courses.
     * Used for the progress listing and dashboard endpoints.
     */
    List<UserProgress> findAllByUserId(UUID userId);
}
