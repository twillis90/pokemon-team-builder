package com.tjw.poketeam.server_java.team;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeamPokemonRepository extends JpaRepository<TeamPokemonEntity, TeamPokemonId> {

    // Get all Pokémon rows for a given team
    List<TeamPokemonEntity> findAllByIdTeamId(String teamId);

    // Do we already have this Pokémon in the team?
    boolean existsByIdTeamIdAndIdPokemonId(String teamId, Integer pokemonId);

    // How many Pokémon are in the team (for enforcing <= 6)
    long countByIdTeamId(String teamId);

    // Remove one Pokémon from the team
    void deleteByIdTeamIdAndIdPokemonId(String teamId, Integer pokemonId);
}
