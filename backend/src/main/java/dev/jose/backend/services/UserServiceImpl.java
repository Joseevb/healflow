package dev.jose.backend.services;

import dev.jose.backend.api.dtos.BaseUpdateUserRequest;
import dev.jose.backend.api.dtos.CreateUserRequestDto;
import dev.jose.backend.api.dtos.UpdateUserRequestPatchDto;
import dev.jose.backend.api.dtos.UpdateUserRequestPutDto;
import dev.jose.backend.api.dtos.UserResponseDto;
import dev.jose.backend.api.exceptions.ResourceAlreadyExistsException;
import dev.jose.backend.api.exceptions.ResourceNotFoundException;
import dev.jose.backend.api.exceptions.UnauthorizedOperationException;
import dev.jose.backend.enumerations.UserRole;
import dev.jose.backend.mappers.UserMapper;
import dev.jose.backend.presistence.entities.UserEntity;
import dev.jose.backend.presistence.repositories.UserRepository;
import dev.jose.backend.utils.ResourceValidationUtils;
import java.time.Duration;
import java.util.Optional;
import java.util.function.BiFunction;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

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
  public Flux<UserResponseDto> getAllUsers(Optional<UserRole> role) {
    return role.map(userRepository::findAllByRole)
        .orElseGet(userRepository::findAll)
        .map(userMapper::toDto)
        .delayElements(Duration.ofSeconds(1));
  }

  @Override
  @Transactional(readOnly = true)
  public Mono<UserResponseDto> getUserById(Long id) throws ResourceNotFoundException {
    return getUserEntityById(id).map(userMapper::toDto);
  }

  @Override
  @Transactional(readOnly = true)
  public Mono<UserEntity> getUserEntityById(Long id) {
    return userRepository
        .findById(id)
        .switchIfEmpty(Mono.error(new ResourceNotFoundException("User", "id", id.toString())));
  }

  @Override
  @Transactional
  public Mono<UserResponseDto> createUser(CreateUserRequestDto request) {
    return userRepository
        .findByEmail(request.email())
        .flatMap(
            _ ->
                Mono.<UserResponseDto>error(
                    new ResourceAlreadyExistsException("User", "email", request.email())))
        .switchIfEmpty(
            Mono.just(request)
                .map(userMapper::toEntity)
                .map(this::encodePassword)
                .flatMap(userRepository::save)
                .map(userMapper::toDto));
  }

  @Override
  @Transactional
  public Mono<UserResponseDto> partiallyUpdateUserById(Long id, UpdateUserRequestPatchDto request) {
    return updateUser(id, request, userMapper::updateEntity).map(userMapper::toDto);
  }

  @Override
  @Transactional
  public Mono<UserResponseDto> updateUserById(Long id, UpdateUserRequestPutDto request) {
    return updateUser(id, request, userMapper::updateEntity).map(userMapper::toDto);
  }

  @Override
  @Transactional
  public Mono<Void> deleteUserById(Long id) {
    return userRepository
        .findById(id)
        .switchIfEmpty(Mono.error(new ResourceNotFoundException("User", "id", id.toString())))
        .flatMap(userRepository::delete);
  }

  /**
   * Performs the complete user update flow including retrieval, validation, modification, and
   * persistence.
   *
   * @param <T> the type of the update request DTO
   * @param id the ID of the user to update
   * @param request the request DTO containing updated user data
   * @param mapperFunction the function to apply updates from DTO to entity
   * @return the updated user as a {@link UserResponseDto}
   * @throws ResourceNotFoundException if no user exists with the specified ID
   * @throws UnauthorizedOperationException if a non-admin tries to change role/activation status
   */
  private <T extends BaseUpdateUserRequest> Mono<UserEntity> updateUser(
      Long id, T request, BiFunction<T, UserEntity, UserEntity> mapperFunction) {
    return userRepository
        .findById(id)
        .switchIfEmpty(Mono.error(new ResourceNotFoundException("User", "id", id.toString())))
        .flatMap(foundUser -> validateUpdateUserRequest(request, foundUser))
        .flatMap(foundUser -> validateEmailUniqueness(request, foundUser))
        .map(validatedUser -> mapperFunction.apply(request, validatedUser))
        .map(this::encodePassword);
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
   * @return A {@link Mono} that emits the `currentUser` if validation passes (or no email change),
   *     or emits a {@link ResourceAlreadyExistsException} if another user already has the specified
   *     email.
   */
  private <T extends BaseUpdateUserRequest> Mono<UserEntity> validateEmailUniqueness(
      T dto, UserEntity currentUser) {
    if (dto.email() != null && !dto.email().equals(currentUser.getEmail())) {
      return ResourceValidationUtils.<String, UserEntity>validateResourceDoesNotExistReactive(
              email -> userRepository.findByEmailAndIdNot(email, currentUser.getId()),
              dto.email(),
              "email",
              "user")
          .thenReturn(currentUser);
    }
    return Mono.just(currentUser);
  }

  /**
   * Validates an update request, ensuring that non-admin users cannot change their own role or
   * activation status.
   *
   * @param <T> the type of the update request DTO
   * @param dto the update request DTO
   * @param currentUser the existing user entity being updated
   * @return A {@link Mono} that emits the `currentUser` if validation passes, or emits an {@link
   *     UnauthorizedOperationException} if validation fails.
   */
  private <T extends BaseUpdateUserRequest> Mono<UserEntity> validateUpdateUserRequest(
      T dto, UserEntity currentUser) {
    return Mono.just(currentUser)
        .flatMap(
            user -> {
              if (securityService.isAdmin()) return Mono.just(user);

              Optional.ofNullable(dto.role())
                  .filter(role -> !role.equals(currentUser.getRole()))
                  .ifPresent(
                      _ -> {
                        throw new UnauthorizedOperationException("Cannot change your own role.");
                      });

              Optional.ofNullable(dto.isActive())
                  .filter(active -> !active.equals(currentUser.isActive()))
                  .ifPresent(
                      _ -> {
                        throw new UnauthorizedOperationException(
                            "Cannot change your activation status.");
                      });

              return Mono.just(user);
            });
  }

  /**
   * Encodes the password in the provided user entity if it is not null.
   *
   * @param userEntity the user entity to encode the password for
   * @return the updated user entity with the encoded password
   */
  private UserEntity encodePassword(UserEntity userEntity) {
    Optional.ofNullable(userEntity.getPassword())
        .map(passwordEncoder::encode)
        .ifPresent(userEntity::setPassword);
    return userEntity;
  }
}
