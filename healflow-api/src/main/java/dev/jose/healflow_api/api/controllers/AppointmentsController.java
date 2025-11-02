package dev.jose.healflow_api.api.controllers;

import dev.jose.healflow_api.api.docs.AppointmentsApi;
import dev.jose.healflow_api.api.models.AppointmentResponseDto;
import dev.jose.healflow_api.api.models.CreateAppointmentRequestDto;
import dev.jose.healflow_api.api.models.UpdateAppointmentRequestDto;
import dev.jose.healflow_api.services.AppointmentService;
import java.net.URI;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

@RestController
@RequiredArgsConstructor
public class AppointmentsController implements AppointmentsApi {

  private final AppointmentService appointmentService;

  @Override
  public ResponseEntity<List<AppointmentResponseDto>> getUserAppointments(UUID userId) {
    return ResponseEntity.ok(appointmentService.getUserAppointments(userId));
  }

  @Override
  public ResponseEntity<List<AppointmentResponseDto>> getUpcomingAppointments(UUID userId) {
    return ResponseEntity.ok(appointmentService.getUpcomingAppointments(userId));
  }

  @Override
  public ResponseEntity<List<AppointmentResponseDto>> getPastAppointments(UUID userId) {
    return ResponseEntity.ok(appointmentService.getPastAppointments(userId));
  }

  @Override
  public ResponseEntity<AppointmentResponseDto> getAppointmentById(UUID id, UUID userId) {
    return ResponseEntity.ok(appointmentService.getAppointmentById(id, userId));
  }

  @Override
  public ResponseEntity<AppointmentResponseDto> createAppointment(
      UUID userId, CreateAppointmentRequestDto request, UriComponentsBuilder uriBuilder) {
    var res = appointmentService.createAppointment(userId, request);
    String location = uriBuilder.path("/{id}").buildAndExpand(res.id()).toUriString();

    return ResponseEntity.created(URI.create(location)).body(res);
  }

  @Override
  public ResponseEntity<AppointmentResponseDto> updateAppointment(
      UUID id, UUID userId, UpdateAppointmentRequestDto request) {
    return ResponseEntity.ok(appointmentService.updateAppointment(id, userId, request));
  }

  @Override
  public ResponseEntity<Void> cancelAppointment(UUID id, UUID userId, String reason) {
    appointmentService.cancelAppointment(id, userId, reason);
    return ResponseEntity.noContent().build();
  }
}
