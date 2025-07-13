package dev.jose.backend.api.controllers;

import static dev.jose.backend.utils.LocationUtils.buildLocationUriFromCurrentRequest;

import dev.jose.backend.api.UsersApi;
import dev.jose.backend.api.dtos.CreateUserRequestDto;
import dev.jose.backend.api.dtos.UpdateUserRequestPatchDto;
import dev.jose.backend.api.dtos.UpdateUserRequestPutDto;
import dev.jose.backend.api.dtos.UserResponseDto;
import dev.jose.backend.enumerations.UserRole;
import dev.jose.backend.services.UserService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Optional;

@RestController
@RequiredArgsConstructor
public class UsersController implements UsersApi {

    private final UserService userService;

    @Override
    public ResponseEntity<Flux<UserResponseDto>> getAllUsers(
            @RequestParam Optional<UserRole> role) {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @Override
    public Mono<ResponseEntity<UserResponseDto>> getUserById(@PathVariable Long id) {
        return userService.getUserById(id).map(ResponseEntity::ok);
    }

    @Override
    public Mono<ResponseEntity<UserResponseDto>> createUser(
            @RequestBody CreateUserRequestDto request) {
        return userService
                .createUser(request)
                .map(
                        response -> {
                            var location = buildLocationUriFromCurrentRequest(response.id());
                            return ResponseEntity.created(location).body(response);
                        });
    }

    @Override
    public Mono<ResponseEntity<UserResponseDto>> updateUserById(
            @PathVariable Long id, @RequestBody UpdateUserRequestPutDto request) {
        return userService.updateUserById(id, request).map(ResponseEntity::ok);
    }

    @Override
    public Mono<ResponseEntity<UserResponseDto>> partiallyUpdateUserById(
            Long id, UpdateUserRequestPatchDto request) {
        return userService.partiallyUpdateUserById(id, request).map(ResponseEntity::ok);
    }

    @Override
    public Mono<ResponseEntity<Void>> deleteUserById(@PathVariable(required = true) Long id) {
        userService.deleteUserById(id);
        return Mono.just(ResponseEntity.noContent().build());
    }
}
