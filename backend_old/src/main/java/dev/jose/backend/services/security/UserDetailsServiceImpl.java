package dev.jose.backend.services.security;

import dev.jose.backend.presistence.repositories.UserRepository;
import dev.jose.backend.security.AuthUser;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    /**
     * Loads user details by username or email. Required by Spring Security for authentication.
     *
     * @param username The username (or email) of the user to load.
     * @return A UserDetails object representing the user.
     * @throws UsernameNotFoundException if the user is not found.
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository
                .findByEmail(username)
                .map(AuthUser::new)
                .orElseThrow(
                        () -> new UsernameNotFoundException("User name not found: " + username));
    }
}
