package dev.jose.backend.presistence.repositories;

import dev.jose.backend.presistence.entities.UserEntity;
import dev.jose.backend.presistence.entities.VerificationTokenEntity;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VerificationTokenRepository extends JpaRepository<VerificationTokenEntity, Long> {
    Optional<VerificationTokenEntity> findByToken(String token);

    Optional<VerificationTokenEntity> findByUserId(Long userId);

    void deleteByUser(UserEntity user);
}
