package dev.jose.healflow_api.persistence.repositories;

import dev.jose.healflow_api.persistence.entities.UserEntity;
import dev.jose.healflow_api.persistence.entities.UserMedicinesEntity;
import dev.jose.healflow_api.persistence.entities.UserMedicinesEntity.UserMedicineId;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserMedicinesRepository
    extends JpaRepository<UserMedicinesEntity, UserMedicineId> {

  List<UserMedicinesEntity> findByUser(UserEntity user);
}
