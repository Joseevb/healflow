package dev.jose.healflow_api.services;

import dev.jose.medicines.model.FieldValuesResponseDTO;
import dev.jose.medicines.model.MedicineDTO;
import dev.jose.medicines.model.PaginatedMedicinesResponseDTO;
import dev.jose.medicines.model.StatsResponseDTO;

public interface MedicineService {
  /**
   * Searches for medicines based on the provided search criteria.
   *
   * @param search the search term to filter medicines by name or description (optional)
   * @param category the category to filter medicines by (optional)
   * @param page the page number for pagination (optional, starts from 0)
   * @return a paginated response containing the list of medicines matching the search criteria
   */
  PaginatedMedicinesResponseDTO searchMedicines(String search, String category, Integer page);

  /**
   * Retrieves a specific medicine by its unique identifier.
   *
   * @param id the unique identifier of the medicine
   * @return the medicine details for the given ID
   */
  MedicineDTO getMedicineById(String id);

  /**
   * Retrieves statistical information about medicines.
   *
   * @return statistics response containing various metrics about medicines
   */
  StatsResponseDTO getStats();

  /**
   * Retrieves the possible values for a specific field in medicines.
   *
   * @param fieldName the name of the field to get values for
   * @return a response containing the field values
   */
  FieldValuesResponseDTO getFieldValues(String fieldName);
}
