package dev.jose.backend.api.routers;

import static org.springframework.web.reactive.function.server.RequestPredicates.accept;
import static org.springframework.web.reactive.function.server.RouterFunctions.route;

import dev.jose.backend.api.dtos.CreateUserRequestDto;
import dev.jose.backend.api.dtos.UpdateUserRequestPatchDto;
import dev.jose.backend.api.dtos.UpdateUserRequestPutDto;
import dev.jose.backend.api.dtos.UserResponseDto;
import dev.jose.backend.api.exceptions.GlobalExceptionHandler.ErrorMessage;
import dev.jose.backend.api.exceptions.GlobalExceptionHandler.ValidationErrorMessage;
import dev.jose.backend.api.handlers.UsersHandler;
import dev.jose.backend.enumerations.UserRole;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.headers.Header;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springdoc.core.annotations.RouterOperation;
import org.springdoc.core.annotations.RouterOperations;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.ServerResponse;

@Configuration
public class UsersRouter {

  public static final String USERS_RESOURCE_PATH = "/users";
  public static final String USERS_ID_RESOURCE_PATH = USERS_RESOURCE_PATH + "/{id}";

  @Bean
  @RouterOperations({
    @RouterOperation(
        path = USERS_RESOURCE_PATH,
        produces = {
          MediaType.APPLICATION_JSON_VALUE,
          MediaType.TEXT_EVENT_STREAM_VALUE,
          MediaType.APPLICATION_NDJSON_VALUE
        },
        beanClass = UsersHandler.class,
        beanMethod = "getAllUsers",
        method = RequestMethod.GET,
        operation =
            @Operation(
                tags = {"Users"},
                operationId = "getAllUsers",
                summary = "Gets all users.",
                description =
                    "Returns a List of all the \"Users\" entities in the"
                        + " database, or an empty list if there are no users",
                parameters = {
                  @Parameter(
                      name = "role",
                      schema = @Schema(implementation = UserRole.class),
                      required = false,
                      description = "Filters users by role",
                      example = "ADMIN",
                      allowEmptyValue = false)
                },
                responses = {
                  @ApiResponse(
                      responseCode = "200",
                      description = "Users retrieved successfully",
                      content = {
                        @Content(
                            schema =
                                @Schema(type = "array", implementation = UserResponseDto.class))
                      }),
                  @ApiResponse(
                      responseCode = "500",
                      description = "Internal server error",
                      content = {
                        @Content(
                            mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ErrorMessage.class))
                      })
                })),
    @RouterOperation(
        path = USERS_ID_RESOURCE_PATH,
        produces = {MediaType.APPLICATION_JSON_VALUE},
        beanClass = UsersHandler.class,
        beanMethod = "getUserById",
        method = RequestMethod.GET,
        operation =
            @Operation(
                tags = {"Users"},
                operationId = "getUserById",
                summary = "Gets a user by ID.",
                description =
                    "Gets a user by ID. Returns a 404 Not Found response if the"
                        + " user does not exist.",
                parameters = {
                  @Parameter(
                      name = "id",
                      in = ParameterIn.PATH,
                      schema = @Schema(type = "integer", format = "int64"),
                      required = true,
                      description = "ID of the user to retrieve")
                },
                responses = {
                  @ApiResponse(
                      responseCode = "200",
                      description = "User retrieved successfully",
                      content = @Content(schema = @Schema(implementation = UserResponseDto.class))),
                  @ApiResponse(
                      responseCode = "404",
                      description = "User not found",
                      content =
                          @Content(
                              schema =
                                  @Schema(
                                      implementation = ErrorMessage.class,
                                      example =
                                          """
                                          {
                                            "timestamp": "2023-03-30T15:00:00.000Z",
                                            "status": 404,
                                            "error": "Not Found",
                                            "message": "User not found",
                                            "path": "/api/v1/users/123"
                                          }
                                          """))),
                  @ApiResponse(
                      responseCode = "500",
                      description = "Internal server error",
                      content = {@Content(schema = @Schema(implementation = ErrorMessage.class))})
                })),
    @RouterOperation(
        path = USERS_RESOURCE_PATH,
        produces = {MediaType.APPLICATION_JSON_VALUE},
        beanClass = UsersHandler.class,
        beanMethod = "createUser",
        method = RequestMethod.POST,
        operation =
            @Operation(
                tags = {"Users", "Admin"},
                operationId = "createUser",
                summary = "Creates a new user account (Admin Only)",
                description =
                    "Creates a new user account with specified details. This"
                        + " endpoint is typically used by administrators to"
                        + " provision new users. Upon successful creation, a"
                        + " 201 Created response is returned, including the new"
                        + " user's ID and a 'Location' header pointing to the"
                        + " newly created user resource (e.g.,"
                        + " /api/v1/users/{id}).",
                requestBody =
                    @RequestBody(
                        description = "Details for the new user account",
                        required = true,
                        content =
                            @Content(
                                mediaType = MediaType.APPLICATION_JSON_VALUE,
                                schema =
                                    @Schema(
                                        name = "CreateUserRequest",
                                        implementation = CreateUserRequestDto.class))),
                security = {
                  @SecurityRequirement(name = "bearerAuth"),
                },
                responses = {
                  @ApiResponse(
                      responseCode = "201",
                      description = "User account created successfully",
                      content =
                          @Content(
                              mediaType = MediaType.APPLICATION_JSON_VALUE,
                              schema =
                                  @Schema(
                                      name = "UserResponse",
                                      implementation = UserResponseDto.class)),
                      headers =
                          @Header(
                              name = "Location",
                              description = "URL of the newly created user" + " resource",
                              schema = @Schema(type = "string", format = "uri"))),
                  @ApiResponse(
                      responseCode = "400",
                      description =
                          "Invalid request payload (e.g., missing fields,"
                              + " invalid email, weak password)",
                      content =
                          @Content(
                              schema = @Schema(implementation = ValidationErrorMessage.class))),
                  @ApiResponse(
                      responseCode = "401",
                      description = "Unauthorized: Not authenticated",
                      content = @Content(schema = @Schema(implementation = ErrorMessage.class))),
                  @ApiResponse(
                      responseCode = "403",
                      description = "Forbidden: Not authorized to create users",
                      content = @Content(schema = @Schema(implementation = ErrorMessage.class))),
                  @ApiResponse(
                      responseCode = "409",
                      description = "Conflict: A user with the provided email" + " already exists",
                      content = @Content(schema = @Schema(implementation = ErrorMessage.class))),
                  @ApiResponse(
                      responseCode = "500",
                      description = "Internal server error",
                      content = {@Content(schema = @Schema(implementation = ErrorMessage.class))})
                })),
    @RouterOperation(
        path = USERS_ID_RESOURCE_PATH,
        produces = {MediaType.APPLICATION_JSON_VALUE},
        beanClass = UsersHandler.class,
        beanMethod = "updateUserById",
        method = RequestMethod.PUT,
        operation =
            @Operation(
                tags = {"Users", "Admin"},
                operationId = "adminUpdateUserById",
                summary = "Updates a user's profile (Admin Only)",
                description =
                    "Updates a user's profile with the provided details. Only"
                        + " authenticated users with the role \"ADMIN\" or if"
                        + " the provided ID matches the authenticated user's ID"
                        + " can update a user. Upon successful update, a 200 OK"
                        + " response is returned, including the updated user's"
                        + " ID and a 'Location' header pointing to the updated"
                        + " user resource (e.g., /api/v1/users/{id}).",
                parameters = {
                  @Parameter(
                      name = "id",
                      in = ParameterIn.PATH,
                      required = true,
                      schema = @Schema(type = "integer", format = "int64"))
                },
                requestBody =
                    @RequestBody(
                        description = "Details for the updated user",
                        required = true,
                        content =
                            @Content(
                                mediaType = MediaType.APPLICATION_JSON_VALUE,
                                schema =
                                    @Schema(
                                        name = "UpdateUserRequest",
                                        implementation = UpdateUserRequestPutDto.class))),
                security = {
                  @SecurityRequirement(name = "bearerAuth"),
                },
                responses = {
                  @ApiResponse(
                      responseCode = "200",
                      description = "User updated successfully",
                      content =
                          @Content(
                              mediaType = MediaType.APPLICATION_JSON_VALUE,
                              schema =
                                  @Schema(
                                      name = "UserResponse",
                                      implementation = UserResponseDto.class))),
                  @ApiResponse(
                      responseCode = "400",
                      description =
                          "Invalid request payload (e.g., missing fields,"
                              + " invalid email, weak password)",
                      content =
                          @Content(
                              schema = @Schema(implementation = ValidationErrorMessage.class))),
                  @ApiResponse(
                      responseCode = "401",
                      description = "Unauthorized: Not authenticated",
                      content = @Content(schema = @Schema(implementation = ErrorMessage.class))),
                  @ApiResponse(
                      responseCode = "403",
                      description = "Forbidden: Not authorized to update users",
                      content = @Content(schema = @Schema(implementation = ErrorMessage.class))),
                  @ApiResponse(
                      responseCode = "404",
                      description = "User not found",
                      content = @Content(schema = @Schema(implementation = ErrorMessage.class))),
                  @ApiResponse(
                      responseCode = "500",
                      description = "Internal server error",
                      content = {@Content(schema = @Schema(implementation = ErrorMessage.class))})
                })),
    @RouterOperation(
        path = USERS_ID_RESOURCE_PATH,
        produces = {MediaType.APPLICATION_JSON_VALUE},
        beanClass = UsersHandler.class,
        beanMethod = "partiallyUpdateUserById",
        method = RequestMethod.PATCH,
        operation =
            @Operation(
                tags = {"Users", "Admin"},
                operationId = "partiallyUpdateUserById",
                summary = "Partially updates a user's profile.",
                description =
                    "Partially updates a user's profile with the provided"
                        + " details. Only provided fields will be applied."
                        + " Users can only update their own profile, while"
                        + " administrators can update any user profile. Upon"
                        + " successful update, a 200 OK response is returned.",
                parameters = {
                  @Parameter(
                      name = "id",
                      in = ParameterIn.PATH,
                      required = true,
                      schema = @Schema(type = "integer", format = "int64"))
                },
                requestBody =
                    @RequestBody(
                        description = "Details for the updated user",
                        required = true,
                        content =
                            @Content(
                                mediaType = MediaType.APPLICATION_JSON_VALUE,
                                schema =
                                    @Schema(
                                        name = "UpdateUserRequest",
                                        implementation = UpdateUserRequestPatchDto.class))),
                security = {
                  @SecurityRequirement(name = "bearerAuth"),
                },
                responses = {
                  @ApiResponse(
                      responseCode = "200",
                      description = "User updated successfully",
                      content =
                          @Content(
                              mediaType = MediaType.APPLICATION_JSON_VALUE,
                              schema =
                                  @Schema(
                                      name = "UserResponse",
                                      implementation = UserResponseDto.class))),
                  @ApiResponse(
                      responseCode = "400",
                      description =
                          "Invalid request payload (e.g., missing fields,"
                              + " invalid email, weak password)",
                      content =
                          @Content(
                              schema = @Schema(implementation = ValidationErrorMessage.class))),
                  @ApiResponse(
                      responseCode = "401",
                      description = "Unauthorized: Not authenticated",
                      content = @Content(schema = @Schema(implementation = ErrorMessage.class))),
                  @ApiResponse(
                      responseCode = "403",
                      description = "Forbidden: Not authorized to update users",
                      content = @Content(schema = @Schema(implementation = ErrorMessage.class))),
                  @ApiResponse(
                      responseCode = "404",
                      description = "User not found",
                      content = @Content(schema = @Schema(implementation = ErrorMessage.class))),
                  @ApiResponse(
                      responseCode = "500",
                      description = "Internal server error",
                      content = {@Content(schema = @Schema(implementation = ErrorMessage.class))})
                })),
    @RouterOperation(
        path = USERS_ID_RESOURCE_PATH,
        produces = {MediaType.APPLICATION_JSON_VALUE},
        beanClass = UsersHandler.class,
        beanMethod = "deleteUserById",
        method = RequestMethod.DELETE,
        operation =
            @Operation(
                tags = {"Users", "Admin"},
                operationId = "deleteUserById",
                summary = "Deletes a user by ID.",
                description =
                    "Deletes a user by its unique identifier. This operation is"
                        + " not reversable. It can only be performed by"
                        + " authenticated users with the role \"ADMIN\" or if"
                        + " the provided ID matches the authenticated user's"
                        + " ID. Upon success, a 201 code is returned with no"
                        + " body",
                security = {
                  @SecurityRequirement(name = "bearerAuth"),
                },
                parameters = {
                  @Parameter(
                      name = "id",
                      in = ParameterIn.PATH,
                      schema = @Schema(type = "integer", format = "int64"),
                      required = true,
                      description = "ID of the user to delete")
                },
                responses = {
                  @ApiResponse(
                      responseCode = "204",
                      description = "User deleted successfully",
                      content = {@Content(schema = @Schema(implementation = ErrorMessage.class))}),
                  @ApiResponse(
                      responseCode = "401",
                      description = "Unauthorized: Not authenticated",
                      content = @Content(schema = @Schema(implementation = ErrorMessage.class))),
                  @ApiResponse(
                      responseCode = "403",
                      description = "Forbidden: Not authorized to delete users",
                      content = @Content(schema = @Schema(implementation = ErrorMessage.class))),
                  @ApiResponse(
                      responseCode = "404",
                      description = "User not found",
                      content = @Content(schema = @Schema(implementation = ErrorMessage.class))),
                  @ApiResponse(
                      responseCode = "500",
                      description = "Internal server error",
                      content = {@Content(schema = @Schema(implementation = ErrorMessage.class))})
                }))
  })
  RouterFunction<ServerResponse> userRoutes(UsersHandler userHandler) {
    return route()
        .path(
            USERS_RESOURCE_PATH,
            b1 ->
                b1.GET(
                        accept(
                            MediaType.APPLICATION_JSON,
                            MediaType.APPLICATION_NDJSON,
                            MediaType.TEXT_EVENT_STREAM),
                        userHandler::getAllUsers)
                    .nest(
                        accept(MediaType.APPLICATION_JSON),
                        b2 ->
                            b2.GET("/{id}", userHandler::getUserById)
                                .POST(userHandler::createUser)
                                .PUT("/{id}", userHandler::updateUserById)
                                .PATCH("/{id}", userHandler::partiallyUpdateUserById)
                                .DELETE("/{id}", userHandler::deleteUserById)
                                .build())
                    .build())
        .build();
  }
}
