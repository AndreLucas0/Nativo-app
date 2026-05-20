package com.nativo.app.domain.course;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Repository for Module entity.
 * @SQLRestriction on Module ensures soft-deleted modules are never returned.
 */
@Repository
public interface ModuleRepository extends JpaRepository<Module, UUID> {

    /**
     * Returns all active modules for a course, ordered by displayOrder.
     * Used when building course detail responses.
     */
    List<Module> findByCourseIdOrderByDisplayOrder(UUID courseId);
}
