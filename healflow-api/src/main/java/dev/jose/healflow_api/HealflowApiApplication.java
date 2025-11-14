package dev.jose.healflow_api;

import dev.jose.healflow_api.services.MedicineService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@Slf4j
@SpringBootApplication
public class HealflowApiApplication {

  public static void main(String[] args) {
    SpringApplication.run(HealflowApiApplication.class, args);
  }

  @Bean
  CommandLineRunner commandLineRunner(MedicineService medicineService) {
    return args -> {
      log.info("Searching for medicines");
      var res = medicineService.searchMedicines(null, null, 1);
      log.info("Found {} ", res);
    };
  }
}
