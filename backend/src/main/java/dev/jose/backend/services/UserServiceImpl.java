package dev.jose.backend.services;

import dev.jose.backend.api.dtos.BaseUpdateUserRequest;
import dev.jose.backend.api.dtos.CreateUserRequestDto;
import dev.jose.backend.api.dtos.UpdateUserRequestPatchDto;
import dev.jose.backend.api.dtos.UpdateUserRequestPutDto;
import dev.jose.backend.api.dtos.UserResponseDto;
import dev.jose.backend.api.exceptions.ResourceNotFoundException;
import dev.jose.backend.mappers.UserMapper;
import dev.jose.backend.presistence.entities.UserEntity;
import dev.jose.backend.presistence.repositories.UserRepository;
import dev.jose.backend.utils.JpaUtils;

import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.function.BiConsumer;
import java.util.function.Function;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public List<UserResponseDto> getAllUsers() {
        return userRepository.findAll().stream().map(userMapper::toDto).toList();
    }

    @Override
    public UserResponseDto getUserById(Long id) throws ResourceNotFoundException {
        return userRepository
                .findById(id)
                .map(userMapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id.toString()));
    }

    @Override
    public UserResponseDto adminCreateUser(CreateUserRequestDto request) {
        return performUserCreation(request, userMapper::toEntity);
    }

    @Override
    public UserResponseDto adminPartiallyUpdateUserById(
            Long id, UpdateUserRequestPatchDto request) {
        return performUserUpdate(
                id, request, userMapper::updateEntity, this::validateEmailUniqueness);
    }

    @Override
    public UserResponseDto adminUpdateUserById(Long id, UpdateUserRequestPutDto request) {
        return performUserUpdate(
                id, request, userMapper::updateEntity, this::validateEmailUniqueness);
    }

    @Override
    public UserResponseDto partiallyUpdateLoggedUser(UpdateUserRequestPatchDto request) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'partiallyUpdateLoggedUser'");
    }

    @Override
    public void deleteLoggedUser() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'deleteLoggedUser'");
    }

    @Override
    public void adminDeleteUserById(Long id) {
        userRepository
                .findById(id)
                .ifPresentOrElse(
                        userRepository::delete,
                        () -> {
                            throw new ResourceNotFoundException("User", "id", id.toString());
                        });
    }

    /**
     * Performs the complete user creation flow including validation, entity creation, persistence,
     * and DTO mapping.
     *
     * <p>This method orchestrates the user creation process by:
     *
     * <ol>
     *   <li>Validating the request and creating the entity using the provided mapper
     *   <li>Persisting the entity to the database
     *   <li>Converting the persisted entity back to a response DTO
     * </ol>
     *
     * @param createRequestDto the request DTO containing user data to be created
     * @param mapperFunction the function to convert the request DTO to a {@link UserEntity}
     * @return the created user as a {@link UserResponseDto}
     * @throws ValidationException if email validation fails (email already exists)
     * @throws DataAccessException if database operations fail
     * @throws NoSuchElementException if the Optional chain fails unexpectedly
     */
    private UserResponseDto performUserCreation(
            CreateUserRequestDto createRequestDto,
            Function<CreateUserRequestDto, UserEntity> mapperFunction) {
        return Optional.of(createRequestDto)
                .map(dto -> validateAndCreate(dto, mapperFunction))
                .map(this::encodePassword)
                .map(userRepository::save)
                .map(userMapper::toDto)
                .get();
    }

    /**
     * Validates the create request and creates a new UserEntity.
     *
     * <p>This method performs email uniqueness validation before creating the entity. It ensures
     * that no user with the same email address already exists in the system.
     *
     * @param createRequestDto the request DTO containing user data to validate and convert
     * @param mapperFunction the function to convert the validated request DTO to a {@link
     *     UserEntity}
     * @return a new {@link UserEntity} ready for persistence
     * @throws ValidationException if a user with the same email already exists
     * @throws IllegalArgumentException if the request DTO contains invalid data
     */
    private UserEntity validateAndCreate(
            CreateUserRequestDto createRequestDto,
            Function<CreateUserRequestDto, UserEntity> mapperFunction) {
        JpaUtils.validateResourceDoesNotExist(
                userRepository::findByEmail, createRequestDto.email(), "email", "user");
        return mapperFunction.apply(createRequestDto);
    }

    /**
     * Validates that the email address in the update request is unique, excluding the current user.
     *
     * <p>This method ensures that when updating a user's email, no other user in the system already
     * has that email address. The current user is excluded from this check to allow users to keep
     * their existing email unchanged.
     *
     * @param <T> the type of the update request DTO, must extend {@link BaseUpdateUserRequest}
     * @param dto the update request DTO containing the email to validate
     * @param currentUser the existing user entity being updated
     * @throws ValidationException if another user already has the specified email address
     */
    private <T extends BaseUpdateUserRequest> void validateEmailUniqueness(
            T dto, UserEntity currentUser) {
        JpaUtils.validateResourceDoesNotExist(
                email -> userRepository.findByEmailAndIdNot(dto.email(), currentUser.getId()),
                dto.email(),
                "email",
                "user");
    }

    /**
     * Performs the complete user update flow including retrieval, validation, modification, and
     * persistence.
     *
     * <p>This method orchestrates the user update process by:
     *
     * <ol>
     *   <li>Finding the user by ID
     *   <li>Applying validation and updates to the found user
     *   <li>Persisting the updated entity to the database
     *   <li>Converting the updated entity to a response DTO
     * </ol>
     *
     * @param <T> the type of the update request DTO
     * @param id the ID of the user to update
     * @param updateRequestDto the request DTO containing updated user data
     * @param mapperFunction the function to apply updates from DTO to entity
     * @param preUpdateValidator the function to validate the update request before applying changes
     * @return the updated user as a {@link UserResponseDto}
     * @throws ResourceNotFoundException if no user exists with the specified ID
     * @throws ValidationException if validation fails during the update process
     * @throws DataAccessException if database operations fail
     */
    private <T> UserResponseDto performUserUpdate(
            Long id,
            T updateRequestDto,
            BiConsumer<T, UserEntity> mapperFunction,
            BiConsumer<T, UserEntity> preUpdateValidator) {
        return userRepository
                .findById(id)
                .map(
                        foundUser ->
                                applyUpdateAndValidate(
                                        updateRequestDto,
                                        foundUser,
                                        mapperFunction,
                                        preUpdateValidator))
                .map(this::encodePassword)
                .map(userRepository::save)
                .map(userMapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id.toString()));
    }

    /**
     * Applies validation and update operations to a user entity.
     *
     * <p>This method executes the pre-update validation first, then applies the actual updates to
     * the user entity. The validation ensures data integrity before modifying the entity state.
     *
     * @param <T> the type of the update request DTO
     * @param updateRequestDto the request DTO containing updated user data
     * @param foundUser the existing user entity to be updated
     * @param mapperFunction the function to apply updates from DTO to entity
     * @param preUpdateValidator the function to validate the update request before applying changes
     * @return the updated {@link UserEntity} ready for persistence
     * @throws ValidationException if validation fails
     * @throws IllegalArgumentException if the update request contains invalid data
     */
    private <T> UserEntity applyUpdateAndValidate(
            T updateRequestDto,
            UserEntity foundUser,
            BiConsumer<T, UserEntity> mapperFunction,
            BiConsumer<T, UserEntity> preUpdateValidator) {
        preUpdateValidator.accept(updateRequestDto, foundUser);
        mapperFunction.accept(updateRequestDto, foundUser);
        return foundUser;
    }

    private UserEntity encodePassword(UserEntity userEntity) {
        userEntity.setPassword(passwordEncoder.encode(userEntity.getPassword()));
        return userEntity;
    }
}
