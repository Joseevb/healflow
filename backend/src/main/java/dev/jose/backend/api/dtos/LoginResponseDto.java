package dev.jose.backend.api.dtos;

import dev.jose.backend.enumerations.UserRole;

import lombok.Builder;

@Builder
public record LoginResponseDto(Long userId, UserRole role, String jwt, String refreshToken) {}
