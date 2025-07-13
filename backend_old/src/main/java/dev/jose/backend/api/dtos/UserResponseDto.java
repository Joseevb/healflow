package dev.jose.backend.api.dtos;

import dev.jose.backend.enumerations.UserRole;

import io.swagger.v3.oas.annotations.media.Schema;

import lombok.Builder;

import java.time.Instant;

@Schema(
        name = "UserResponse",
        example =
                """
                {
                    "id": 1,
                    "email": "user@example.com",
                    "first_name": "John",
                    "last_name": "Doe",
                    "role": "USER",
                    "is_active": false,
                    "created_at": "2023-03-30T15:00:00.000Z",
                    "last_modified_at": "2023-03-30T15:00:00.000Z"
                }
                """)
@Builder
public record UserResponseDto(
        Long id,
        String email,
        String firstName,
        String lastName,
        UserRole role,
        boolean isActive,
        Instant createdAt,
        Instant lastModifiedAt) {}
