package com.tjw.poketeam.server_java.badges.model;

import java.util.ArrayList;
import java.util.List;

public class SnapshotPayload {
    private String teamId; // optional
    private List<SnapshotPokemon> pokemon = new ArrayList<>();

    public SnapshotPayload() {}

    public SnapshotPayload(String teamId, List<SnapshotPokemon> pokemon) {
        this.teamId = teamId;
        if (pokemon != null) this.pokemon = pokemon;
    }

    public String getTeamId() { return teamId; }
    public void setTeamId(String teamId) { this.teamId = teamId; }

    public List<SnapshotPokemon> getPokemon() { return pokemon; }
    public void setPokemon(List<SnapshotPokemon> pokemon) { this.pokemon = pokemon; }
}
