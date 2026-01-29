package dev.jose.healflow_api.api.models;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import lombok.Builder;

@Schema(name = "UserMedicinesResponse", description = "User medicines response")
@Builder
public record UserMedicinesResponseDTO(
    String medicineName,
    String dosage,
    String frequency,
    LocalDateTime startDate,
    LocalDateTime endDate) {}
