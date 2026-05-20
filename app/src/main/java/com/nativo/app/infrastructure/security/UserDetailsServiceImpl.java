package com.nativo.app.infrastructure.security;

import com.nativo.app.domain.user.User;
import com.nativo.app.domain.user.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Loads user details by email for Spring Security authentication.
 *
 * Implements UserDetailsService so Spring Security can verify credentials
 * during login. Also used by JwtAuthenticationFilter to validate tokens.
 *
 * The principal name is set to the user's UUID string (not email) so that
 * downstream services can extract userId directly from the SecurityContext
 * without an extra database lookup.
 */
@Service
@Transactional(readOnly = true)
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Loads a user by email address.
     *
     * @param email the user's email (used as username in this system)
     * @throws UsernameNotFoundException if no active user exists with the given email
     */
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "User not found with email: " + email));

        // @SQLRestriction on User already filters deleted users,
        // but we double-check here for explicit clarity
        if (user.isDeleted()) {
            throw new UsernameNotFoundException("User account has been deactivated: " + email);
        }

        return new org.springframework.security.core.userdetails.User(
                user.getId().toString(),   // principal name = userId (UUID string)
                user.getPasswordHash(),
                List.of(new SimpleGrantedAuthority("ROLE_USER"))
        );
    }
}
