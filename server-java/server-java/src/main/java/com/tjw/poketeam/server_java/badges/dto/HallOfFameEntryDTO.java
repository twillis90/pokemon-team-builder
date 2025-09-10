package com.tjw.poketeam.server_java.badges.dto;

import com.tjw.poketeam.server_java.team.dto.TeamPokemonDTO;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class HallOfFameEntryDTO {
    private UUID id;
    private String userId;
    private String teamName;
    private OffsetDateTime earnedAt;
    private int powerScore;
    private List<String> badges = new ArrayList<>();
    private SnapshotDTO snapshot = new SnapshotDTO();

    public HallOfFameEntryDTO() {}

    public HallOfFameEntryDTO(UUID id, String userId, String teamName, OffsetDateTime earnedAt,
                              int powerScore, List<String> badges, SnapshotDTO snapshot) {
        this.id = id;
        this.userId = userId;
        this.teamName = teamName;
        this.earnedAt = earnedAt;
        this.powerScore = powerScore;
        if (badges != null) this.badges = badges;
        if (snapshot != null) this.snapshot = snapshot;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getTeamName() { return teamName; }
    public void setTeamName(String teamName) { this.teamName = teamName; }

    public OffsetDateTime getEarnedAt() { return earnedAt; }
    public void setEarnedAt(OffsetDateTime earnedAt) { this.earnedAt = earnedAt; }

    public int getPowerScore() { return powerScore; }
    public void setPowerScore(int powerScore) { this.powerScore = powerScore; }

    public List<String> getBadges() { return badges; }
    public void setBadges(List<String> badges) { this.badges = badges; }

    public SnapshotDTO getSnapshot() { return snapshot; }
    public void setSnapshot(SnapshotDTO snapshot) { this.snapshot = snapshot; }

    public static class SnapshotDTO {
        private String teamId;
        private List<TeamPokemonDTO> pokemon = new ArrayList<>();

        public SnapshotDTO() {}

        public SnapshotDTO(String teamId, List<TeamPokemonDTO> pokemon) {
            this.teamId = teamId;
            if (pokemon != null) this.pokemon = pokemon;
        }

        public String getTeamId() { return teamId; }
        public void setTeamId(String teamId) { this.teamId = teamId; }

        public List<TeamPokemonDTO> getPokemon() { return pokemon; }
        public void setPokemon(List<TeamPokemonDTO> pokemon) { this.pokemon = pokemon; }
    }
}
