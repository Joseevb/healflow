package dev.jose.healflow_api.api.docs;

import dev.jose.healflow_api.api.models.UserMedicinesResponseDTO;
import dev.jose.healflow_api.api.models.errors.ApiProblemDetail;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestMapping;

@Tag(name = "User Medicines", description = "User medicines management API")
@RequestMapping("/user-medicines")
public interface UserMedicinesApi {

  @Operation(
      operationId = "getUserMedicines",
      summary = "Get user medicines",
      description = "Returns list of medicines for a user",
      security = {@SecurityRequirement(name = "Bearer Auth")},
      tags = {"User Medicines"})
  @ApiResponses({
    @ApiResponse(
        responseCode = "200",
        description = "List of medicines",
        content =
            @io.swagger.v3.oas.annotations.media.Content(
                array =
                    @io.swagger.v3.oas.annotations.media.ArraySchema(
                        schema =
                            @io.swagger.v3.oas.annotations.media.Schema(
                                implementation = UserMedicinesResponseDTO.class)))),
    @ApiResponse(
        responseCode = "401",
        description = "Unauthorized",
        content =
            @io.swagger.v3.oas.annotations.media.Content(
                schema =
                    @io.swagger.v3.oas.annotations.media.Schema(
                        implementation = ApiProblemDetail.class))),
    @ApiResponse(
        responseCode = "404",
        description = "User not found",
        content =
            @io.swagger.v3.oas.annotations.media.Content(
                schema =
                    @io.swagger.v3.oas.annotations.media.Schema(
                        implementation = ApiProblemDetail.class))),
    @ApiResponse(
        responseCode = "500",
        description = "Internal server error",
        content =
            @io.swagger.v3.oas.annotations.media.Content(
                schema =
                    @io.swagger.v3.oas.annotations.media.Schema(
                        implementation = ApiProblemDetail.class)))
  })
  @GetMapping
  ResponseEntity<List<UserMedicinesResponseDTO>> getUserMedicines(
      @Parameter(hidden = true) @RequestAttribute UUID userId);
}
