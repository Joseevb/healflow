package dev.jose.healflow_api.persistence.entities;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Table(name = "specialist_types")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SpecialistTypeEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column(name = "name", nullable = false, unique = true, length = 100)
  private String name;

  @Column(name = "description", length = 500)
  private String description;

  @Column(name = "icon", length = 50)
  private String icon;

  @OneToMany(mappedBy = "specialistType", cascade = CascadeType.ALL)
  @Builder.Default
  private List<SpecialistEntity> specialists = new ArrayList<>();
}
