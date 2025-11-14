package dev.jose.healflow_api.services;

import dev.jose.healflow_api.api.models.ProvisionUserRequestDTO;
import dev.jose.healflow_api.mappers.UserMapper;
import dev.jose.healflow_api.persistence.entities.UserEntity;
import dev.jose.healflow_api.persistence.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserProvisionServiceImpl implements UserProvisionService {

  private final UserMapper userMapper;
  private final UserRepository userRepository;

  @Override
  public String provisionUser(ProvisionUserRequestDTO request) {
    if (userRepository.existsByEmail(request.email())
        || userRepository.existsByAuthId(request.userId())) {
      throw new IllegalArgumentException("User already exists");
    }

    // TODO: actually map
    var entity =
        UserEntity.builder()
            .email(request.email())
            .authId(request.userId())
            .firstName("test")
            .lastName("test")
            .phone("test")
            .build();

    return userRepository.save(entity).getId().toString();
  }
}
