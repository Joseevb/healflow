package dev.jose.backend.services.security;

import dev.jose.backend.presistence.entities.UserEntity;
import dev.jose.backend.presistence.repositories.UserRepository;
import dev.jose.backend.security.AuthUser;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements ReactiveUserDetailsService {

  private final UserRepository userRepository;

  /**
   * Finds an user details by username or email. Required by Spring Security for authentication.
   *
   * @param username The username (or email) of the user to load.
   * @return A UserDetails object representing the user.
   * @throws UsernameNotFoundException if the user is not found.
   */
  @Override
  public Mono<UserDetails> findByUsername(String username) {
    return userRepository
        .findByEmail(username)
        .map(this::mapToUserDetails)
        .switchIfEmpty(
            Mono.error(new UsernameNotFoundException("User name not found: " + username)));
  }

  /**
   * Explicitly maps {@link UserEntity} to a {@link UserDetails} instance. This method is required
   * as generic wrapper classes cannot use have a class that is implementing the defined in the
   * generic. This is a workaround to keep the code cleaner in the main class
   *
   * @param userEntity the user entity to map
   * @return a {@link UserDetails} instance
   */
  private UserDetails mapToUserDetails(UserEntity userEntity) {
    return (UserDetails) new AuthUser(userEntity);
  }
}
