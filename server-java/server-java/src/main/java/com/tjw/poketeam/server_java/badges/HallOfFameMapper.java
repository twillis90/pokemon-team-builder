package com.tjw.poketeam.server_java.badges;

import com.tjw.poketeam.server_java.badges.dto.HallOfFameEntryDTO;
import com.tjw.poketeam.server_java.badges.model.SnapshotPayload;
import com.tjw.poketeam.server_java.badges.model.SnapshotPokemon;
import com.tjw.poketeam.server_java.team.dto.TeamPokemonDTO;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public final class HallOfFameMapper {
    private HallOfFameMapper() {}

    public static HallOfFameEntryDTO toDto(HallOfFameEntryEntity e) {
        List<String> badgeList = e.getBadges() == null
                ? List.of()
                : Arrays.asList(e.getBadges());

        var snapDto = toSnapshotDto(e.getSnapshot());

        return new HallOfFameEntryDTO(
                e.getId(),
                e.getUserId(),
                e.getTeamName(),
                e.getEarnedAt(),
                e.getPowerScore(),
                badgeList,
                snapDto
        );
    }

    private static HallOfFameEntryDTO.SnapshotDTO toSnapshotDto(SnapshotPayload snap) {
        if (snap == null) return new HallOfFameEntryDTO.SnapshotDTO();

        List<TeamPokemonDTO> mons = snap.getPokemon() == null
                ? List.of()
                : snap.getPokemon().stream().map(HallOfFameMapper::toTeamPokemonDto).collect(Collectors.toList());

        return new HallOfFameEntryDTO.SnapshotDTO(snap.getTeamId(), mons);
    }

    private static TeamPokemonDTO toTeamPokemonDto(SnapshotPokemon p) {
        if (p == null) return new TeamPokemonDTO();
        return new TeamPokemonDTO(p.getId(), p.getName(), p.getSprite(), p.getTypes());
    }
}
