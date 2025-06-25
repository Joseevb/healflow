package dev.jose.backend.api.dtos;

import dev.jose.backend.enumerations.UserRole;

import lombok.Builder;

import java.time.OffsetDateTime;

@Builder
public record UserResponseDto(
        Long id,
        String email,
        String firstName,
        String lastName,
        UserRole role,
        OffsetDateTime createdAt,
        OffsetDateTime lastModifiedAt) {}
