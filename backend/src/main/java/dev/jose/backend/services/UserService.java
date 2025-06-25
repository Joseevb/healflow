package dev.jose.backend.services;

import dev.jose.backend.api.dtos.CreateUserRequestDto;
import dev.jose.backend.api.dtos.UpdateUserRequestPatchDto;
import dev.jose.backend.api.dtos.UpdateUserRequestPutDto;
import dev.jose.backend.api.dtos.UserResponseDto;
import dev.jose.backend.api.exceptions.ResourceAlreadyExistsException;
import dev.jose.backend.api.exceptions.ResourceNotFoundException;
import dev.jose.backend.api.exceptions.UnauthorizedOperationException;

import java.util.List;

public interface UserService {

    /**
     * Retrieves a list of all users registered in the system.
     *
     * @return A {@link List} of {@link UserResponseDto} objects, never {@code null} but potentially
     *     empty.
     */
    List<UserResponseDto> getAllUsers();

    /**
     * Retrieves a single user's details by their unique identifier.
     *
     * @param id The unique identifier (ID) of the user to retrieve. Must not be {@code null}.
     * @return A {@link UserResponseDto} object containing the user's details.
     * @throws ResourceNotFoundException if no user is found with the provided {@code id}.
     */
    UserResponseDto getUserById(Long id) throws ResourceNotFoundException;

    /**
     * Creates a new user in the system with administrative privileges. This method allows an
     * administrator to set all user details, including the role.
     *
     * @param request The {@link CreateUserRequestDto} containing the details for the new user. Must
     *     not be {@code null}.
     * @return A {@link UserResponseDto} object representing the newly created user.
     * @throws ResourceAlreadyExistsException if a user with the provided email already exists.
     */
    UserResponseDto adminCreateUser(CreateUserRequestDto request)
            throws ResourceAlreadyExistsException;

    /**
     * Partially updates an existing user's profile based on their ID, typically performed by an
     * administrator. This method allows an administrator to update any field, including the user's
     * role. Fields not provided in the request will remain unchanged.
     *
     * @param id The unique identifier (ID) of the user to update. Must not be {@code null}.
     * @param request The {@link UpdateUserRequestPatchDto} containing the fields to be updated.
     *     Only provided fields will be applied. Must not be {@code null}.
     * @return A {@link UserResponseDto} object representing the updated user.
     * @throws ResourceNotFoundException if no user is found with the provided {@code id}.
     */
    UserResponseDto adminPartiallyUpdateUserById(Long id, UpdateUserRequestPatchDto request)
            throws ResourceNotFoundException;

    /**
     * Fully updates an existing user's profile based on their ID, typically performed by an
     * administrator. This method allows an administrator to update any field, including the user's
     * role.
     *
     * @param id The unique identifier (ID) of the user to update. Must not be {@code null}.
     * @param request The {@link UpdateUserRequestPutDto} containing the fields to be updated. All
     *     fields must be provided. Must not be {@code null}.
     * @return A {@link UserResponseDto} object representing the updated user.
     * @throws ResourceNotFoundException if no user is found with the provided {@code id}.
     */
    UserResponseDto adminUpdateUserById(Long id, UpdateUserRequestPutDto request);

    /**
     * Partially updates the currently authenticated user's own profile. This method restricts users
     * from changing sensitive fields like their role. Fields not provided in the request will
     * remain unchanged.
     *
     * @param request The {@link UpdateUserRequestPatchDto} containing the fields to be updated.
     *     Only provided fields will be applied. Must not be {@code null}.
     * @return A {@link UserResponseDto} object representing the updated user.
     * @throws ResourceNotFoundException if the logged-in user's profile cannot be found (unlikely,
     *     but defensive).
     * @throws UnauthorizedOperationException if the user attempts to update forbidden fields (e.g.,
     *     role).
     */
    UserResponseDto partiallyUpdateLoggedUser(UpdateUserRequestPatchDto request)
            throws ResourceNotFoundException, UnauthorizedOperationException;

    /**
     * Deletes the currently authenticated user's own profile. This operation typically requires
     * explicit confirmation from the user.
     *
     * @throws ResourceNotFoundException if the logged-in user's profile cannot be found (unlikely).
     */
    void deleteLoggedUser() throws ResourceNotFoundException;

    /**
     * Deletes a user by their unique identifier, typically performed by an administrator.
     *
     * @param id The unique identifier (ID) of the user to delete. Must not be {@code null}.
     * @throws ResourceNotFoundException if no user is found with the provided {@code id}.
     */
    void adminDeleteUserById(Long id) throws ResourceNotFoundException;
}
