package dev.jose.healflow_api.persistence.repositories;

import dev.jose.healflow_api.persistence.entities.SpecialistTypeEntity;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SpecialistTypeRepository extends JpaRepository<SpecialistTypeEntity, UUID> {
  Optional<SpecialistTypeEntity> findByName(String name);

  boolean existsByName(String name);
}
