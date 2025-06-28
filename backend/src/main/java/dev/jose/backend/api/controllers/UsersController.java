package dev.jose.backend.api.controllers;

import dev.jose.backend.api.UsersApi;
import dev.jose.backend.api.dtos.CreateUserRequestDto;
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
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
public class UsersController implements UsersApi {

    private final UserService userService;

    @Override
    public ResponseEntity<List<UserResponseDto>> getAllUsers(
            @RequestParam Optional<UserRole> role) {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @Override
    public ResponseEntity<UserResponseDto> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @Override
    public ResponseEntity<UserResponseDto> createUser(@RequestBody CreateUserRequestDto request) {
        var response = userService.createUser(request);
        var location =
                ServletUriComponentsBuilder.fromCurrentRequestUri()
                        .pathSegment(response.id().toString())
                        .build()
                        .toUri();

        return ResponseEntity.created(location).body(response);
    }

    @Override
    public ResponseEntity<UserResponseDto> updateUserById(
            @PathVariable Long id, @RequestBody UpdateUserRequestPutDto request) {
        return ResponseEntity.ok(userService.updateUserById(id, request));
    }

    @Override
    public ResponseEntity<Void> deleteUserById(
            @PathVariable(name = "id", required = true) Long id) {
        userService.deleteUserById(id);
        return ResponseEntity.noContent().build();
    }
}
