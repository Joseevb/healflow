package dev.jose.backend.mappers;

import dev.jose.backend.api.dtos.CreateUserRequestDto;
import dev.jose.backend.api.dtos.RegisterUserRequestDto;
import dev.jose.backend.api.dtos.UpdateUserRequestPatchDto;
import dev.jose.backend.api.dtos.UpdateUserRequestPutDto;
import dev.jose.backend.api.dtos.UserResponseDto;
import dev.jose.backend.presistence.entities.UserEntity;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

@Mapper(
        componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserMapper {

    @Mapping(target = "isActive", source = "entity.active")
    UserResponseDto toDto(UserEntity entity);

    @Mapping(target = "role", constant = "USER")
    CreateUserRequestDto toDto(RegisterUserRequestDto data);

    UserEntity toEntity(CreateUserRequestDto data);

    @Mapping(target = "active", source = "data.isActive")
    UserEntity updateEntity(UpdateUserRequestPatchDto data, @MappingTarget UserEntity entity);

    @Mapping(target = "active", source = "data.isActive")
    UserEntity updateEntity(UpdateUserRequestPutDto data, @MappingTarget UserEntity entity);
}
