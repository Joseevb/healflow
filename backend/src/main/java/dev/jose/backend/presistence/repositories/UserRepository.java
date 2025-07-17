package dev.jose.backend.presistence.repositories;

import dev.jose.backend.enumerations.UserRole;
import dev.jose.backend.presistence.entities.UserEntity;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface UserRepository extends R2dbcRepository<UserEntity, Long> {

  /**
   * Finds a user by email.
   *
   * @param email The email to search for.
   * @return A {@link Mono} containing the UserEntity if found, or {@link Mono#empty()} if no such
   *     user exists.
   */
  Mono<UserEntity> findByEmail(String email);

  /**
   * Finds a user by email, excluding the user with the given ID. Useful for checking uniqueness
   * when updating an existing user's email.
   *
   * @param email The email to search for.
   * @param id The ID of the user to exclude from the search (i.e., the user currently being
   *     updated).
   * @return A {@link Mono} containing the UserEntity if a different user with the same email is
   *     found, or {@link Mono#empty()} if no such user exists.
   */
  Mono<UserEntity> findByEmailAndIdNot(String email, Long id);

  /**
   * Finds all users with the given role.
   *
   * @param role The role to filter users by.
   * @return A {@link Flux} of UserEntities.
   */
  Flux<UserEntity> findAllByRole(UserRole role);
}
