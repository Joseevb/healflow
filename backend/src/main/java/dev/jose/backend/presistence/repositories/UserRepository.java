package dev.jose.backend.presistence.repositories;

import dev.jose.backend.enumerations.UserRole;
import dev.jose.backend.presistence.entities.UserEntity;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, Long> {

    Optional<UserEntity> findByEmail(String email);

    /**
     * Finds a user by email, excluding the user with the given ID. Useful for checking uniqueness
     * when updating an existing user's email.
     *
     * @param email The email to search for.
     * @param id The ID of the user to exclude from the search (i.e., the user currently being
     *     updated).
     * @return An Optional containing the UserEntity if a different user with the same email is
     *     found, or Optional.empty() if no such user exists.
     */
    Optional<UserEntity> findByEmailAndIdNot(String email, Long id);

    List<UserEntity> findAllByRole(UserRole role);
}
