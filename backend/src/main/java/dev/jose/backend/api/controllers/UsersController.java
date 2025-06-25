package dev.jose.backend.api.controllers;

import dev.jose.backend.api.dtos.UserResponseDto;
import dev.jose.backend.enumerations.UserRole;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.OffsetDateTime;
import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UsersController {

    @GetMapping
    public ResponseEntity<List<UserResponseDto>> getAllUsers() {
        return ResponseEntity.ok(
                List.of(
                        UserResponseDto.builder()
                                .id(1L)
                                .email("jose@jose.com")
                                .firstName("Jose")
                                .lastName("Perez")
                                .role(UserRole.DOCTOR)
                                .createdAt(OffsetDateTime.now())
                                .lastModifiedAt(OffsetDateTime.now())
                                .build()));
    }
}
