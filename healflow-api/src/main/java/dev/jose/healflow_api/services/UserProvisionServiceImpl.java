package dev.jose.healflow_api.services;

import dev.jose.healflow_api.api.models.AddMedicineToUserRequestDTO;
import dev.jose.healflow_api.api.models.ProvisionUserRequestDTO;
import dev.jose.healflow_api.api.models.ValidateAuthUserIdsDTO;
import dev.jose.healflow_api.exceptions.AuthUserIdValidationException;
import dev.jose.healflow_api.persistence.entities.UserEntity;
import dev.jose.healflow_api.persistence.repositories.SpecialistRepository;
import dev.jose.healflow_api.persistence.repositories.UserRepository;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserProvisionServiceImpl implements UserProvisionService {

  private final UserRepository userRepository;
  private final SpecialistRepository specialistRepository;

  // TODO: Remove
  private final MedicineService medicineService;
  private final UserMedicineService userMedicineService;

  @Override
  @Transactional
  public String provisionUser(ProvisionUserRequestDTO request) {
    if (userRepository.existsByEmail(request.email())
        || userRepository.existsByAuthId(request.userId())) {
      throw new IllegalArgumentException("User already exists");
    }

    var entity =
        specialistRepository
            .findById(request.specialistId())
            .map(
                primarySpecialist ->
                    UserEntity.builder()
                        .email(request.email())
                        .authId(request.userId())
                        .firstName("test")
                        .lastName("test")
                        .phone("test")
                        .primarySpecialist(primarySpecialist)
                        .build())
            .orElseThrow();

    // Persist first to obtain generated id
    var saved = userRepository.save(entity);

    // Now attach medicines to the persisted user
    addMedicineToUser(saved);
    return saved.getId().toString();
  }

  // TODO: Remove this method
  private void addMedicineToUser(UserEntity user) {
    medicineService
        .searchMedicines(null, "Human", 1, Map.of("nameOfMedicine", "Ibuprofen"))
        .getData()
        .forEach(
            m ->
                userMedicineService.addMedicineToUser(
                    AddMedicineToUserRequestDTO.builder()
                        .userId(user.getId())
                        .medicineId(m.getId())
                        .dosage("1")
                        .frequency("daily")
                        .startDate(java.time.LocalDateTime.now())
                        .endDate(java.time.LocalDateTime.now().plusDays(7))
                        .build()));
  }

  @Override
  public void validateUserIds(ValidateAuthUserIdsDTO userIds) {
    var invalidIds =
        userIds.ids().stream().filter(id -> !userRepository.existsByAuthId(id)).toList();

    if (!invalidIds.isEmpty()) {
      throw new AuthUserIdValidationException(invalidIds);
    }
  }
}
