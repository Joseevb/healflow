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

@Mapper(
        componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface UserMapper {

    UserResponseDto toDto(UserEntity entity);

    @Mapping(target = "role", constant = "java(dev.jose.backend.enumerations.UserRole.USER)")
    CreateUserRequestDto toDto(RegisterUserRequestDto data);

    UserEntity toEntity(CreateUserRequestDto data);

    UserEntity updateEntity(UpdateUserRequestPatchDto data, @MappingTarget UserEntity entity);

    UserEntity updateEntity(UpdateUserRequestPutDto data, @MappingTarget UserEntity entity);
}
