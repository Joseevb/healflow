package dev.jose.backend.presistence.repositories;

import dev.jose.backend.presistence.entities.UserEntity;
import dev.jose.backend.presistence.entities.VerificationTokenEntity;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import reactor.core.publisher.Mono;

public interface VerificationTokenRepository
    extends R2dbcRepository<VerificationTokenEntity, Long> {
  Mono<VerificationTokenEntity> findByToken(String token);

  Mono<VerificationTokenEntity> findByUserId(Long userId);

  Mono<Void> deleteByUser(UserEntity user);
}
