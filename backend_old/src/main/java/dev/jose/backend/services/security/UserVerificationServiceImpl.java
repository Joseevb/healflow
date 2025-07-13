package dev.jose.backend.services.security;

import dev.jose.backend.presistence.entities.UserEntity;
import dev.jose.backend.presistence.entities.VerificationTokenEntity;
import dev.jose.backend.presistence.repositories.VerificationTokenRepository;
import dev.jose.backend.services.EmailService;

import jakarta.mail.MessagingException;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Map;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class UserVerificationServiceImpl implements UserVerificationService {

    private final EmailService emailService;
    private final VerificationTokenRepository repository;

    @Value("${app.token.expiration-seconds.verification}")
    private int verificationTokenExpirationSeconds;

    @Override
    @Transactional
    public VerificationTokenEntity createAndSendVerificationToken(UserEntity userEntity)
            throws MessagingException {
        var token = generateSixDigitNumber();

        repository.deleteByUser(userEntity);

        var verificationTokenEntity =
                repository.saveAndFlush(
                        VerificationTokenEntity.builder()
                                .user(userEntity)
                                .expiresAt(
                                        Instant.now()
                                                .plusSeconds(verificationTokenExpirationSeconds))
                                .token(token)
                                .build());

        Map<String, Object> emailVariables =
                Map.of(
                        "subject",
                        "Verify your account",
                        "header",
                        "Please verify your account",
                        "userName",
                        userEntity.getFirstName(),
                        "code",
                        verificationTokenEntity.getToken());

        emailService.sendTemplatedEmail(
                userEntity.getEmail(),
                "Verify your account",
                "user-verification-email",
                emailVariables);

        return verificationTokenEntity;
    }

    @Override
    @Transactional(readOnly = true)
    public boolean validateToken(String token, Long userId) {
        return repository
                .findByUserId(userId)
                .map(tokenEntity -> tokenEntity.getToken().equals(token))
                .orElseThrow();
    }

    private String generateSixDigitNumber() {
        Random random = new Random();
        // Generate a number between 100,000 (inclusive) and 1,000,000 (exclusive)
        int sixDigitNumber = random.nextInt(900_000) + 100_000;
        return String.valueOf(sixDigitNumber);
    }
}
