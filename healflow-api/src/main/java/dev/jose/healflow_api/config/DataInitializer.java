package dev.jose.healflow_api.config;

import dev.jose.healflow_api.enumerations.AppointmentStatus;
import dev.jose.healflow_api.persistence.entities.AppointmentEntity;
import dev.jose.healflow_api.persistence.entities.SpecialistAvailabilityEntity;
import dev.jose.healflow_api.persistence.entities.SpecialistEntity;
import dev.jose.healflow_api.persistence.entities.SpecialistTypeEntity;
import dev.jose.healflow_api.persistence.entities.UserEntity;
import dev.jose.healflow_api.persistence.repositories.AppointmentRepository;
import dev.jose.healflow_api.persistence.repositories.SpecialistAvailabilityRepository;
import dev.jose.healflow_api.persistence.repositories.SpecialistRepository;
import dev.jose.healflow_api.persistence.repositories.SpecialistTypeRepository;
import dev.jose.healflow_api.persistence.repositories.UserRepository;
import java.time.DayOfWeek;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class DataInitializer {

  @Bean
  @Profile("dev")
  CommandLineRunner initDatabase(
      UserRepository userRepository,
      SpecialistTypeRepository specialistTypeRepository,
      SpecialistRepository specialistRepository,
      SpecialistAvailabilityRepository availabilityRepository,
      AppointmentRepository appointmentRepository) {

    return _ -> {
      log.info("Initializing database with mock data...");

      // Create Users
      UserEntity user1 =
          UserEntity.builder()
              .email("john.doe@email.com")
              .firstName("John")
              .lastName("Doe")
              .phone("+1-555-0100")
              .dateOfBirth(Instant.parse("1990-05-15T00:00:00Z"))
              .authId(UUID.randomUUID().toString())
              .build();

      UserEntity user2 =
          UserEntity.builder()
              .email("jane.smith@email.com")
              .firstName("Jane")
              .lastName("Smith")
              .phone("+1-555-0101")
              .dateOfBirth(Instant.parse("1985-08-22T00:00:00Z"))
              .authId(UUID.randomUUID().toString())
              .build();

      userRepository.saveAll(List.of(user1, user2));
      log.info("Created {} users", 2);

      // Create Specialist Types
      SpecialistTypeEntity cardiology =
          SpecialistTypeEntity.builder()
              .name("Cardiology")
              .description("Heart and cardiovascular system specialists")
              .icon("heart")
              .build();

      SpecialistTypeEntity dentistry =
          SpecialistTypeEntity.builder()
              .name("Dentistry")
              .description("Dental care and oral health specialists")
              .icon("tooth")
              .build();

      SpecialistTypeEntity generalPractice =
          SpecialistTypeEntity.builder()
              .name("General Practice")
              .description("General medical care and consultations")
              .icon("stethoscope")
              .build();

      SpecialistTypeEntity dermatology =
          SpecialistTypeEntity.builder()
              .name("Dermatology")
              .description("Skin, hair, and nail care specialists")
              .icon("hand")
              .build();

      specialistTypeRepository.saveAll(
          List.of(cardiology, dentistry, generalPractice, dermatology));
      log.info("Created {} specialist types", 4);

      // Create Specialists
      SpecialistEntity drJohnson =
          SpecialistEntity.builder()
              .firstName("Sarah")
              .lastName("Johnson")
              .email("sarah.johnson@hospital.com")
              .phone("+1-555-0200")
              .licenseNumber("MD-12345")
              .specialistType(cardiology)
              .consultationDurationMinutes((short) 30)
              .build();

      SpecialistEntity drChen =
          SpecialistEntity.builder()
              .firstName("Michael")
              .lastName("Chen")
              .email("michael.chen@dental.com")
              .phone("+1-555-0201")
              .licenseNumber("DDS-67890")
              .specialistType(dentistry)
              .consultationDurationMinutes((short) 45)
              .build();

      SpecialistEntity drBrown =
          SpecialistEntity.builder()
              .firstName("Emily")
              .lastName("Brown")
              .email("emily.brown@clinic.com")
              .phone("+1-555-0202")
              .licenseNumber("MD-11111")
              .specialistType(generalPractice)
              .consultationDurationMinutes((short) 20)
              .build();

      specialistRepository.saveAll(List.of(drJohnson, drChen, drBrown));
      log.info("Created {} specialists", 3);

      // Create Availabilities (Monday to Friday, 9 AM to 5 PM)
      List<SpecialistAvailabilityEntity> availabilities = new ArrayList<>();

      for (DayOfWeek day : DayOfWeek.values()) {
        if (day == DayOfWeek.SATURDAY || day == DayOfWeek.SUNDAY) {
          continue;
        }

        // Dr. Johnson - Morning shift
        availabilities.add(
            SpecialistAvailabilityEntity.builder()
                .specialist(drJohnson)
                .dayOfWeek(day)
                .startTime(LocalTime.of(9, 0))
                .endTime(LocalTime.of(12, 0))
                .build());

        // Dr. Johnson - Afternoon shift
        availabilities.add(
            SpecialistAvailabilityEntity.builder()
                .specialist(drJohnson)
                .dayOfWeek(day)
                .startTime(LocalTime.of(13, 0))
                .endTime(LocalTime.of(17, 0))
                .build());

        // Dr. Chen - Full day
        availabilities.add(
            SpecialistAvailabilityEntity.builder()
                .specialist(drChen)
                .dayOfWeek(day)
                .startTime(LocalTime.of(9, 0))
                .endTime(LocalTime.of(17, 0))
                .build());

        // Dr. Brown - Full day
        availabilities.add(
            SpecialistAvailabilityEntity.builder()
                .specialist(drBrown)
                .dayOfWeek(day)
                .startTime(LocalTime.of(9, 0))
                .endTime(LocalTime.of(17, 0))
                .build());
      }

      availabilityRepository.saveAll(availabilities);
      log.info("Created {} availability slots", availabilities.size());

      // Create Appointments
      List<AppointmentEntity> appointments = new ArrayList<>();
      Random random = new Random();
      Instant now = Instant.now();

      // Past appointments
      for (int i = 1; i <= 5; i++) {
        Instant pastDate = now.minus(i * 7L, ChronoUnit.DAYS);
        LocalDateTime pastDateTime =
            LocalDateTime.ofInstant(pastDate, ZoneId.systemDefault())
                .withHour(10 + i)
                .withMinute(0)
                .withSecond(0)
                .withNano(0);

        appointments.add(
            AppointmentEntity.builder()
                .client(user1)
                .specialist(random.nextBoolean() ? drJohnson : drBrown)
                .appointmentDate(pastDateTime.atZone(ZoneId.systemDefault()).toInstant())
                .durationMinutes((short) 30)
                .status(AppointmentStatus.COMPLETED)
                .notes("Regular checkup")
                .build());
      }

      // Upcoming appointments
      for (int i = 1; i <= 3; i++) {
        Instant futureDate = now.plus(i * 7L, ChronoUnit.DAYS);
        LocalDateTime futureDateTime =
            LocalDateTime.ofInstant(futureDate, ZoneId.systemDefault())
                .withHour(14)
                .withMinute(0)
                .withSecond(0)
                .withNano(0);

        // Skip weekends
        while (futureDateTime.getDayOfWeek() == DayOfWeek.SATURDAY
            || futureDateTime.getDayOfWeek() == DayOfWeek.SUNDAY) {
          futureDateTime = futureDateTime.plusDays(1);
        }

        appointments.add(
            AppointmentEntity.builder()
                .client(user1)
                .specialist(i % 2 == 0 ? drChen : drJohnson)
                .appointmentDate(futureDateTime.atZone(ZoneId.systemDefault()).toInstant())
                .durationMinutes((short) 30)
                .status(i == 1 ? AppointmentStatus.CONFIRMED : AppointmentStatus.PENDING)
                .notes("Follow-up appointment")
                .build());
      }

      appointmentRepository.saveAll(appointments);
      log.info("Created {} appointments", appointments.size());

      log.info("Database initialization completed successfully!");
      log.info("Mock user credentials:");
      log.info("  - Email: john.doe@email.com (User ID: {})", user1.getId());
      log.info("  - Email: jane.smith@email.com (User ID: {})", user2.getId());
    };
  }
}
