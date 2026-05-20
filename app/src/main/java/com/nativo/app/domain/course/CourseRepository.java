package com.nativo.app.domain.course;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository for Course entity.
 * @SQLRestriction on Course ensures soft-deleted courses are never returned.
 */
@Repository
public interface CourseRepository extends JpaRepository<Course, UUID> {

    /**
     * Returns all active courses ordered by displayOrder.
     * Used for the course listing endpoint.
     */
    List<Course> findAllByIsActiveTrueOrderByDisplayOrder();

    /**
     * Finds a course by its URL slug.
     * Used for slug-based routing and uniqueness validation.
     */
    Optional<Course> findBySlug(String slug);
}
