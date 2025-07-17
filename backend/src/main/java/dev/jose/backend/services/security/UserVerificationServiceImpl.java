package dev.jose.backend.services.security;

import dev.jose.backend.presistence.entities.UserEntity;
import dev.jose.backend.presistence.entities.VerificationTokenEntity;
import dev.jose.backend.presistence.repositories.VerificationTokenRepository;
import dev.jose.backend.services.EmailService;
import jakarta.mail.MessagingException;
import java.time.Instant;
import java.util.Map;
import java.util.Random;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class UserVerificationServiceImpl implements UserVerificationService {

  private final EmailService emailService;
  private final VerificationTokenRepository repository;

  @Value("${app.token.expiration-seconds.verification}")
  private int verificationTokenExpirationSeconds;

  @Override
  @Transactional
  public Mono<VerificationTokenEntity> createAndSendVerificationToken(UserEntity userEntity) {
    var token = generateSixDigitNumber();
    return repository
        .deleteByUser(userEntity)
        .then(
            repository.save(
                VerificationTokenEntity.builder()
                    .user(userEntity)
                    .expiresAt(Instant.now().plusSeconds(verificationTokenExpirationSeconds))
                    .token(token)
                    .build()))
        .flatMap(
            savedTokenEntity -> {
              Map<String, Object> emailVariables =
                  Map.of(
                      "subject",
                      "Verify your account",
                      "header",
                      "Please verify your account",
                      "userName",
                      userEntity.getFirstName(),
                      "code",
                      savedTokenEntity.getToken());

              return emailService
                  .sendTemplatedEmail(
                      userEntity.getEmail(),
                      "Verify your account",
                      "user-verification-email",
                      emailVariables)
                  .thenReturn(savedTokenEntity)
                  .onErrorMap(MessagingException.class, e -> e);
            });
  }

  @Override
  @Transactional(readOnly = true)
  public Mono<Boolean> validateToken(String token, Long userId) {
    return repository
        .findByUserId(userId)
        .map(tokenEntity -> tokenEntity.getToken().equals(token))
        .switchIfEmpty(Mono.just(false));
  }

  /**
   * Generates a six-digit number between 100_000 (inclusive) and 1_000_000 (exclusive).
   *
   * @return The generated number.
   */
  private String generateSixDigitNumber() {
    Random random = new Random();
    int sixDigitNumber = random.nextInt(900_000) + 100_000;
    return String.valueOf(sixDigitNumber);
  }
}
