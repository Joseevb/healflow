package dev.jose.backend.api.controllers;

import static dev.jose.backend.utils.LocationUtils.buildLocationUri;

import dev.jose.backend.api.AuthApi;
import dev.jose.backend.api.dtos.LoginRequestDto;
import dev.jose.backend.api.dtos.LoginResponseDto;
import dev.jose.backend.api.dtos.RegisterUserRequestDto;
import dev.jose.backend.api.dtos.UserResponseDto;
import dev.jose.backend.api.dtos.VerifyUserRequestDto;
import dev.jose.backend.services.security.AuthService;

import jakarta.mail.MessagingException;
import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

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
            @Valid @RequestBody RegisterUserRequestDto register) throws MessagingException {
        var createdUser = authService.register(register);
        var location = buildLocationUri("/api/v1/users", createdUser.id());

        return ResponseEntity.created(location).body(createdUser);
    }

    @Override
    public ResponseEntity<Void> verifyAccount(VerifyUserRequestDto token) {
        authService.verifyAccount(token.token());
        return ResponseEntity.ok().build();
    }
}
