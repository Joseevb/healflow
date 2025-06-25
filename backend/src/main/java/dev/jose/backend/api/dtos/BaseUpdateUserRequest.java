package dev.jose.backend.api.dtos;

/**
 * This interface is a base for common methods in both {@link UpdateUserRequestPatchDto } and {@link
 * UpdateUserRequestPutDto}
 */
public interface BaseUpdateUserRequest {
    String email();
}
