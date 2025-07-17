package dev.jose.backend.enumerations;

import java.util.Optional;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum UserRole {
  DOCTOR("Doctor"),
  ADMIN("Admin"),
  USER("User");

  private final String displayName;

  /**
   * Converts a string representation (matching enum constant names, case-insensitive) to a UserRole
   * enum. Throws IllegalArgumentException if not found. Example: "ADMIN" -> UserRole.ADMIN
   *
   * @param roleName The string representation of the role (e.g., "ADMIN", "user")
   * @return The corresponding UserRole enum.
   * @throws IllegalArgumentException if no enum constant with the specified name is found.
   */
  public static UserRole fromStringName(String roleName) {
    return UserRole.valueOf(roleName.toUpperCase());
  }

  /**
   * Converts a human-readable string representation (matching the displayName field,
   * case-insensitive) to a UserRole enum. Returns Optional.empty() if not found. Example: "Admin"
   * -> UserRole.ADMIN
   *
   * @param roleDisplayName The human-readable string (e.g., "Doctor", "User")
   * @return An Optional containing the UserRole enum, or empty if not found.
   */
  public static Optional<UserRole> fromDisplayName(String roleDisplayName) {
    for (UserRole role : UserRole.values()) {
      if (role.getDisplayName().equalsIgnoreCase(roleDisplayName)) {
        return Optional.of(role);
      }
    }
    return Optional.empty();
  }
}
