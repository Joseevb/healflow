package dev.jose.healflow_api.services;

import dev.jose.healflow_api.api.models.ProvisionUserRequestDTO;

public interface UserProvisionService {

  /**
   * Provisions a new user.
   *
   * @param request the request containing the user's information
   */
  String provisionUser(ProvisionUserRequestDTO request);
}
