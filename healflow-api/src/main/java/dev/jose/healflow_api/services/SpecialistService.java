package dev.jose.healflow_api.services;

import dev.jose.healflow_api.api.models.DayScheduleResponseDto;
import dev.jose.healflow_api.api.models.SpecialistResponseDto;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface SpecialistService {

  /**
   * Returns available specialists
   *
   * @return List of active specialists
   */
  List<SpecialistResponseDto> getAvailableSpecialists();

  /**
   * Returns booking data for a specific specialist
   *
   * @param specialistId Specialist unique identifier
   * @param startDate Start date for the schedule
   * @param endDate End date for the schedule
   * @return List of day schedules
   */
  List<DayScheduleResponseDto> getSpecialistBookingData(
      UUID specialistId, Instant startDate, Instant endDate);
}
