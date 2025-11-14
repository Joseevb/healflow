package dev.jose.healflow_api.services;

import dev.jose.medicines.api.MedicinesApi;
import dev.jose.medicines.api.MedicinesApi.GetMedicinesRequest;
import dev.jose.medicines.api.StatisticsApi;
import dev.jose.medicines.model.FieldValuesResponseDTO;
import dev.jose.medicines.model.MedicineDTO;
import dev.jose.medicines.model.PaginatedMedicinesResponseDTO;
import dev.jose.medicines.model.StatsResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MedicineServiceImpl implements MedicineService {

  private final MedicinesApi medicinesApi;
  private final StatisticsApi statisticsApi;

  private static final int STARTING_PAGE = 1;
  private static final int PAGE_SIZE = 50;

  @Override
  public PaginatedMedicinesResponseDTO searchMedicines(
      String search, String category, Integer page) {
    var params =
        new GetMedicinesRequest()
            .search(search)
            .category(category)
            .pageSize(PAGE_SIZE)
            .page(page >= STARTING_PAGE ? page : STARTING_PAGE);

    return medicinesApi.getMedicines(params);
  }

  @Override
  public MedicineDTO getMedicineById(String id) {
    return medicinesApi.getMedicinesById(id);
  }

  @Override
  public StatsResponseDTO getStats() {
    return statisticsApi.getMedicinesStats();
  }

  @Override
  public FieldValuesResponseDTO getFieldValues(String fieldName) {
    return medicinesApi.getMedicinesFieldsByFieldName(fieldName);
  }
}
