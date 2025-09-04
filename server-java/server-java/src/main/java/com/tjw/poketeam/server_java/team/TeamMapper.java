package com.tjw.poketeam.server_java.team;

import com.tjw.poketeam.server_java.team.dto.TeamDTO;
import com.tjw.poketeam.server_java.team.dto.TeamPokemonDTO;

import java.util.List;
import java.util.stream.Collectors;

public final class TeamMapper {
    private TeamMapper() {}

    public static TeamPokemonDTO toDto(TeamPokemonEntity e) {
        return new TeamPokemonDTO(
                e.getPokemonId(),
                e.getName(),
                e.getSprite(),
                e.getTypes()
        );
    }

    public static List<TeamPokemonDTO> toPokemonDtoList(List<TeamPokemonEntity> list) {
        return list.stream().map(TeamMapper::toDto).collect(Collectors.toList());
    }

    public static TeamDTO toDto(TeamEntity team, List<TeamPokemonEntity> mons) {
        return new TeamDTO(
                team.getId(),
                team.getUserId(),
                team.getName(),
                toPokemonDtoList(mons)
        );
    }
}
