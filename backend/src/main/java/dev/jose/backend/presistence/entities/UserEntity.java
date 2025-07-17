package dev.jose.backend.presistence.entities;

import dev.jose.backend.enumerations.UserRole;
import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

@Data
@Table(name = "users")
@Builder
@Accessors(chain = true)
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
@AllArgsConstructor
public class UserEntity {

  @Id private Long id;

  @Column("email")
  private String email;

  @Column("password")
  private String password;

  @Column("first_name")
  private String firstName;

  @Column("last_name")
  private String lastName;

  @Column("role")
  private UserRole role;

  @Column("is_active")
  @Builder.Default
  private boolean isActive = false;

  @Column("created_at")
  @CreatedDate
  private Instant createdAt;

  @Column("last_modified_at")
  @LastModifiedDate
  private Instant lastModifiedAt;
}
