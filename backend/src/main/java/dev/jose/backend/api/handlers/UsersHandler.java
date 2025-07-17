package dev.jose.backend.api.handlers;

import static dev.jose.backend.utils.ExceptionUtils.safeRun;
import static dev.jose.backend.utils.LocationUtils.buildLocationUriFromCurrentRequest;
import static dev.jose.backend.utils.ResourceValidationUtils.validateResource;

import dev.jose.backend.api.dtos.CreateUserRequestDto;
import dev.jose.backend.api.dtos.UpdateUserRequestPatchDto;
import dev.jose.backend.api.dtos.UpdateUserRequestPutDto;
import dev.jose.backend.api.dtos.UserResponseDto;
import dev.jose.backend.api.exceptions.InvalidParameterFormatException;
import dev.jose.backend.enumerations.UserRole;
import dev.jose.backend.services.UserService;
import jakarta.validation.Validator;
import java.util.Arrays;
import java.util.Optional;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Mono;

@Slf4j
@Component
@RequiredArgsConstructor
public class UsersHandler {

  private final Validator validator;
  private final UserService userService;

  public Mono<ServerResponse> getAllUsers(ServerRequest request) {
    Optional<UserRole> role =
        safeRun(
            () -> request.queryParam("role").map(UserRole::valueOf),
            (_, _) ->
                new InvalidParameterFormatException(
                    Arrays.stream(UserRole.values())
                        .map(UserRole::name)
                        .collect(Collectors.joining(" ")),
                    "string"));
    MediaType contentType =
        request.headers().accept().stream()
            .filter(
                mediaType ->
                    mediaType.equals(MediaType.APPLICATION_NDJSON)
                        || mediaType.equals(MediaType.TEXT_EVENT_STREAM)
                        || mediaType.equals(MediaType.APPLICATION_JSON))
            .findFirst()
            .orElse(MediaType.APPLICATION_JSON);

    return ServerResponse.ok()
        .contentType(contentType)
        .body(userService.getAllUsers(role), UserResponseDto.class);
  }

  public Mono<ServerResponse> getUserById(ServerRequest request) {
    Long id =
        safeRun(
            () -> Long.valueOf(request.pathVariable("id")),
            (_, _) -> new InvalidParameterFormatException("long", "string"));
    return userService
        .getUserById(id)
        .flatMap(
            userDto ->
                ServerResponse.ok().contentType(MediaType.APPLICATION_JSON).bodyValue(userDto))
        .switchIfEmpty(ServerResponse.notFound().build());
  }

  @PreAuthorize("hasRole('ADMIN')")
  public Mono<ServerResponse> createUser(ServerRequest request) {
    return request
        .bodyToMono(CreateUserRequestDto.class)
        .flatMap(
            reqDto ->
                validateResource(reqDto, validator)
                    .then(
                        userService
                            .createUser(reqDto)
                            .flatMap(
                                response ->
                                    buildLocationUriFromCurrentRequest(
                                            request.exchange(), response.id())
                                        .flatMap(
                                            location ->
                                                ServerResponse.created(location)
                                                    .contentType(MediaType.APPLICATION_JSON)
                                                    .bodyValue(response)))));
  }

  @PreAuthorize("hasRole('ADMIN')")
  public Mono<ServerResponse> updateUserById(ServerRequest request) {
    Long id =
        safeRun(
            () -> Long.valueOf(request.pathVariable("id")),
            (_, _) -> new InvalidParameterFormatException("long", "string"));
    return request
        .bodyToMono(UpdateUserRequestPutDto.class)
        .flatMap(
            reqDto ->
                validateResource(reqDto, validator)
                    .then(
                        userService
                            .updateUserById(id, reqDto)
                            .flatMap(
                                userDto ->
                                    ServerResponse.ok()
                                        .contentType(MediaType.APPLICATION_JSON)
                                        .bodyValue(userDto))
                            .switchIfEmpty(ServerResponse.notFound().build())));
  }

  @PreAuthorize("hasRole('ADMIN') or authentication.principal.id == #id")
  public Mono<ServerResponse> partiallyUpdateUserById(ServerRequest request) {
    Long id =
        safeRun(
            () -> Long.valueOf(request.pathVariable("id")),
            (_, _) -> new InvalidParameterFormatException("long", "string"));
    return request
        .bodyToMono(UpdateUserRequestPatchDto.class)
        .flatMap(
            reqDto ->
                validateResource(reqDto, validator)
                    .then(
                        userService
                            .partiallyUpdateUserById(id, reqDto)
                            .flatMap(
                                userDto ->
                                    ServerResponse.ok()
                                        .contentType(MediaType.APPLICATION_JSON)
                                        .bodyValue(userDto))
                            .switchIfEmpty(ServerResponse.notFound().build())));
  }

  @PreAuthorize("hasRole('ADMIN') or authentication.principal.id == #id")
  public Mono<ServerResponse> deleteUserById(ServerRequest request) {
    Long id = Long.valueOf(request.pathVariable("id"));
    return userService
        .deleteUserById(id)
        .then(ServerResponse.noContent().build())
        .switchIfEmpty(ServerResponse.notFound().build());
  }
}
