package com.nativo.app.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * JPA configuration.
 * Enables JPA Auditing so @CreatedDate and @LastModifiedDate
 * are automatically populated on entity persist/update.
 */
@Configuration
@EnableJpaAuditing
public class JpaConfig {
    // Spring Data JPA auditing is activated by @EnableJpaAuditing.
    // Entities using @EntityListeners(AuditingEntityListener.class)
    // will have their createdAt / updatedAt fields managed automatically.
}
