package dev.jose.backend.services;

import dev.jose.backend.api.dtos.BaseUpdateUserRequest;
import dev.jose.backend.api.dtos.CreateUserRequestDto;
import dev.jose.backend.api.dtos.UpdateUserRequestPatchDto;
import dev.jose.backend.api.dtos.UpdateUserRequestPutDto;
import dev.jose.backend.api.dtos.UserResponseDto;
import dev.jose.backend.api.exceptions.ResourceNotFoundException;
import dev.jose.backend.api.exceptions.UnauthorizedOperationException;
import dev.jose.backend.mappers.UserMapper;
import dev.jose.backend.presistence.entities.UserEntity;
import dev.jose.backend.presistence.repositories.UserRepository;
import dev.jose.backend.utils.JpaUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.function.BiConsumer;
import java.util.function.Function;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;
    private final UserRepository userRepository;
    private final SecurityService securityService;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public List<UserResponseDto> getAllUsers() {
        return userRepository.findAll().stream().map(userMapper::toDto).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponseDto getUserById(Long id) throws ResourceNotFoundException {
        return userMapper.toDto(getUserEntityById(id));
    }

    @Override
    @Transactional(readOnly = true)
    public UserEntity getUserEntityById(Long id) throws ResourceNotFoundException {
        return userRepository
                .findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id.toString()));
    }

    @Override
    @Transactional
    public UserResponseDto createUser(CreateUserRequestDto request) {
        return performUserCreation(request, userMapper::toEntity);
    }

    @Override
    @Transactional
    public UserResponseDto partiallyUpdateUserById(Long id, UpdateUserRequestPatchDto request) {
        return performUserUpdate(
                id, request, userMapper::updateEntity, this::validateEmailUniqueness);
    }

    @Override
    @Transactional
    public UserResponseDto updateUserById(Long id, UpdateUserRequestPutDto request) {
        log.info("Updating user with ID {} with request {}", id, request);
        var user =
                performUserUpdate(
                        id, request, userMapper::updateEntity, this::validateEmailUniqueness);
        log.info("Updated user: {}", user);
        return user;
    }

    @Override
    @Transactional
    public void deleteUserById(Long id) {
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
    private <T extends BaseUpdateUserRequest> UserResponseDto performUserUpdate(
            Long id,
            T updateRequestDto,
            BiConsumer<T, UserEntity> mapperFunction,
            BiConsumer<T, UserEntity> preUpdateValidator) {

        return userRepository
                .findById(id)
                .map(foundUser -> validateUpdateUserRequest(updateRequestDto, foundUser))
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
     * Validates the update request and throws an exception if the request is not valid.
     *
     * <p>This method checks if the user is an administrator and if the provided request is valid.
     * If the user is not an administrator, the method checks if the provided request is valid and
     * if the user's role and activation status are not changed.
     *
     * @param <T> the type of the update request DTO
     * @param dto the update request DTO containing the email to validate
     * @param currentUser the existing user entity being updated
     * @throws ValidationException if another user already has the specified email address
     */
    private <T extends BaseUpdateUserRequest> UserEntity validateUpdateUserRequest(
            T dto, UserEntity currentUser) {

        if (!securityService.isAdmin()) {
            Optional.ofNullable(dto.role())
                    .filter(role -> !role.equals(currentUser.getRole()))
                    .ifPresent(
                            role -> {
                                throw new UnauthorizedOperationException(
                                        "Cannot change your own role.");
                            });

            Optional.ofNullable(dto.isActive())
                    .filter(active -> !active.equals(currentUser.isActive()))
                    .ifPresent(
                            active -> {
                                throw new UnauthorizedOperationException(
                                        "Cannot change your activation status.");
                            });
        }

        return currentUser;
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
        Optional.ofNullable(userEntity.getPassword())
                .map(passwordEncoder::encode)
                .ifPresent(userEntity::setPassword);
        return userEntity;
    }
}
