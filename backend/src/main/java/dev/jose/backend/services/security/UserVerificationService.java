package dev.jose.backend.services.security;

import dev.jose.backend.presistence.entities.UserEntity;
import dev.jose.backend.presistence.entities.VerificationTokenEntity;
import reactor.core.publisher.Mono;

public interface UserVerificationService {

  /**
   * Creates a new verification token for the specified user.
   *
   * @param userId The ID of the user for which to create a verification token.
   * @return The generated verification token.
   */
  Mono<VerificationTokenEntity> createAndSendVerificationToken(UserEntity userEntity);

  /**
   * Validates the given verification token for the specified user.
   *
   * @param token The verification token to validate.
   * @param userId The ID of the user associated with the token.
   * @return {@code true} if the token is valid, {@code false} otherwise.
   */
  Mono<Boolean> validateToken(String token, Long userId);
}
