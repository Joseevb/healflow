package dev.jose.backend.api.controllers;

import dev.jose.backend.api.AuthApi;
import dev.jose.backend.api.dtos.LoginRequestDto;
import dev.jose.backend.api.dtos.LoginResponseDto;
import dev.jose.backend.api.dtos.RegisterUserRequestDto;
import dev.jose.backend.api.dtos.UserResponseDto;
import dev.jose.backend.services.AuthService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

@RestController
@RequiredArgsConstructor
public class AuthController implements AuthApi {

    private final AuthService authService;

    @Override
    public ResponseEntity<LoginResponseDto> login(@Valid @RequestBody LoginRequestDto login) {
        return ResponseEntity.ok(authService.login(login));
    }

    @Override
    public ResponseEntity<UserResponseDto> register(
            @Valid @RequestBody RegisterUserRequestDto register) {
        var createdUser = authService.register(register);

        var location =
                UriComponentsBuilder.fromPath("/api/v1")
                        .path("/users")
                        .pathSegment(createdUser.id().toString())
                        .build()
                        .toUri();

        return ResponseEntity.created(location).body(createdUser);
    }
}
