package dev.jose.backend.api.dtos;

import dev.jose.backend.enumerations.UserRole;

/**
 * This interface is a base for common methods in both {@link UpdateUserRequestPatchDto } and {@link
 * UpdateUserRequestPutDto}
 */
public sealed interface BaseUpdateUserRequest
    permits UpdateUserRequestPatchDto, UpdateUserRequestPutDto {
  String email();

  UserRole role();

  boolean isActive();
}
