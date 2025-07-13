package dev.jose.backend.presistence.entities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.Instant;

@Table(name = "verification_tokens")
@Data
@Builder
@Accessors(chain = true)
@AllArgsConstructor
@NoArgsConstructor
public class VerificationTokenEntity {

    @Id private Long id;

    @Column("token")
    private String token;

    @Column("user_id")
    private UserEntity user;

    @Column("expires_at")
    private Instant expiresAt;
}
