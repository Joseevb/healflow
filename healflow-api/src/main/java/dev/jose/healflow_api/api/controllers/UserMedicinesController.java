package dev.jose.healflow_api.api.controllers;

import dev.jose.healflow_api.api.docs.UserMedicinesApi;
import dev.jose.healflow_api.api.models.UserMedicinesResponseDTO;
import dev.jose.healflow_api.services.UserMedicineService;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class UserMedicinesController implements UserMedicinesApi {

  private final UserMedicineService userMedicineService;

  @Override
  public ResponseEntity<List<UserMedicinesResponseDTO>> getUserMedicines(UUID userId) {
    return ResponseEntity.ok(userMedicineService.getUserMedicines(userId));
  }
}
