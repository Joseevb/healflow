package dev.jose.healflow_api.services;

import dev.jose.healflow_api.api.models.AddMedicineToUserRequestDTO;
import dev.jose.healflow_api.api.models.UserMedicinesResponseDTO;
import dev.jose.healflow_api.exceptions.NotFoundException;
import dev.jose.healflow_api.mappers.UserMapper;
import dev.jose.healflow_api.persistence.entities.UserEntity;
import dev.jose.healflow_api.persistence.repositories.UserMedicinesRepository;
import dev.jose.healflow_api.persistence.repositories.UserRepository;
import dev.jose.medicines.model.MedicineDTO;
import java.util.Collection;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserMedicineServiceImpl implements UserMedicineService {

  private final UserRepository userRepository;
  private final MedicineService medicineService;
  private final UserMedicinesRepository userMedicinesRepository;
  private final UserMapper userMapper;

  @Override
  @Transactional
  // @Transactional(readOnly = true)
  public List<UserMedicinesResponseDTO> getUserMedicines(UUID userId) {
    return userRepository.findById(userId).map(userMedicinesRepository::findByUser).stream()
        .flatMap(Collection::stream)
        .map(
            entity -> {
              addMedicineToUser(
                  AddMedicineToUserRequestDTO.builder()
                      .userId(userId)
                      .dosage("1")
                      .medicineId(entity.getId().getMedicineId())
                      .frequency("daily")
                      .startDate(java.time.LocalDateTime.now())
                      .endDate(java.time.LocalDateTime.now().plusDays(7))
                      .build());
              return UserMedicinesResponseDTO.builder()
                  .medicineName(
                      medicineService
                          .getMedicineById(entity.getId().getMedicineId())
                          .getNameOfMedicine())
                  .dosage(entity.getDosage())
                  .frequency(entity.getFrequency())
                  .startDate(entity.getStartDate())
                  .endDate(entity.getEndDate())
                  .build();
            })
        .toList();
  }

  @Override
  @Transactional
  public UserMedicinesResponseDTO addMedicineToUser(AddMedicineToUserRequestDTO request) {
    UserEntity user =
        userRepository
            .findById(request.userId())
            .orElseThrow(() -> new NotFoundException("User", "id", request.userId()));

    MedicineDTO medicine = medicineService.getMedicineById(request.medicineId());

    var entity = userMapper.toUserMedicinesEntity(request, medicine, user);

    userMedicinesRepository.save(entity);

    return userMapper.toUserMedicinesResponseDTO(entity, medicine);
  }
}
