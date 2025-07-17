package dev.jose.backend.api.dtos;

import dev.jose.backend.enumerations.UserRole;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

@Schema(
    name = "LoginResponse",
    example =
        """
                {
                    "userId": 1,
                    "role": "USER",
                    "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
                    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
                }
        """)
@Builder
public record LoginResponseDto(Long userId, UserRole role, String jwt, String refreshToken) {}
