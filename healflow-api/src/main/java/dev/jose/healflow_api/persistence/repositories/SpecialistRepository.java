package dev.jose.healflow_api.persistence.repositories;

import dev.jose.healflow_api.persistence.entities.SpecialistEntity;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface SpecialistRepository extends JpaRepository<SpecialistEntity, UUID> {
  List<SpecialistEntity> findByIsActiveTrue();

  @Query(
      "SELECT s FROM SpecialistEntity s WHERE s.specialistType.id = :typeId AND s.isActive = true")
  List<SpecialistEntity> findActiveBySpecialistTypeId(@Param("typeId") UUID typeId);
}
