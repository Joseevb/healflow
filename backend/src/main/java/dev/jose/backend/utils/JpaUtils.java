package dev.jose.backend.utils;

import dev.jose.backend.api.exceptions.ResourceAlreadyExistsException;

import lombok.experimental.UtilityClass;

import java.util.Optional;
import java.util.function.Function;

@UtilityClass
public class JpaUtils {

    /**
     * Validates that a resource does not already exist based on a given unique field and its value.
     * If a resource is found, a {@link ResourceAlreadyExistsException} is thrown. This method is
     * designed to be called before creating a new resource or updating a unique field.
     *
     * @param lookupFunction A function representing the repository method to find a user by a
     *     unique field (e.g., userRepository::findByEmail).
     * @param fieldValue The value of the unique field to check against (e.g., the email address).
     * @param fieldName The name of the field being checked (e.g., "email"). Used in the exception
     *     message.
     * @param resourceName the name of the resource being checked (e.g., "user"). Used in the
     *     exception message.
     * @param <T> The type of the field value (e.g., String).
     * @param <E> The type of the entity being searched (e.g., UserEntity).
     * @throws ResourceAlreadyExistsException if a user with the specified field value already
     *     exists.
     */
    public <T, E> void validateResourceDoesNotExist(
            Function<T, Optional<E>> lookupFunction,
            T fieldValue,
            String fieldName,
            String resourceName) {
        lookupFunction
                .apply(fieldValue)
                .ifPresent(
                        existingResource -> {
                            throw new ResourceAlreadyExistsException(
                                    resourceName, fieldName, fieldValue.toString());
                        });
    }
}
