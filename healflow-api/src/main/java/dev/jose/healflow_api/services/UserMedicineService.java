package dev.jose.healflow_api.services;

import dev.jose.healflow_api.api.models.AddMedicineToUserRequestDTO;
import dev.jose.healflow_api.api.models.UserMedicinesResponseDTO;
import java.util.List;
import java.util.UUID;

public interface UserMedicineService {

  List<UserMedicinesResponseDTO> getUserMedicines(UUID userId);

  UserMedicinesResponseDTO addMedicineToUser(AddMedicineToUserRequestDTO request);
}
