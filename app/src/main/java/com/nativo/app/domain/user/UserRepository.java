package com.nativo.app.domain.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * Repository for User entity.
 * @SQLRestriction on User ensures deleted users are never returned.
 */
@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    /**
     * Finds an active user by email.
     * Used for authentication and duplicate email validation.
     */
    Optional<User> findByEmail(String email);

    /**
     * Finds an active user by ID, explicitly excluding soft-deleted records.
     * Redundant with @SQLRestriction but makes the intent explicit in service code.
     */
    Optional<User> findByIdAndDeletedAtIsNull(UUID id);
}
