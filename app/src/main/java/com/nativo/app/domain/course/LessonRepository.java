package com.nativo.app.domain.course;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Repository for Lesson entity.
 * @SQLRestriction on Lesson ensures soft-deleted lessons are never returned.
 */
@Repository
public interface LessonRepository extends JpaRepository<Lesson, UUID> {

    /**
     * Returns all active lessons for a module, ordered by displayOrder.
     * Used when building course detail and lesson navigation responses.
     */
    List<Lesson> findByModuleIdOrderByDisplayOrder(UUID moduleId);

    /**
     * Counts active lessons in a module.
     * Used for progress percentage calculation.
     */
    long countByModuleId(UUID moduleId);
}
