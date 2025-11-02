package dev.jose.healflow_api.api.controllers;

import dev.jose.healflow_api.api.docs.SpecialistsApi;
import dev.jose.healflow_api.api.models.DayScheduleResponseDto;
import dev.jose.healflow_api.api.models.SpecialistResponseDto;
import dev.jose.healflow_api.services.SpecialistService;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class SpecialistsController implements SpecialistsApi {

  private final SpecialistService specialistService;

  @Override
  public ResponseEntity<List<SpecialistResponseDto>> getAvailableSpecialists() {
    return ResponseEntity.ok(specialistService.getAvailableSpecialists());
  }

  @Override
  public ResponseEntity<List<DayScheduleResponseDto>> getSpecialistBookingData(
      UUID specialistId, Instant startDate, Instant endDate) {
    return ResponseEntity.ok(
        specialistService.getSpecialistBookingData(specialistId, startDate, endDate));
  }
}
