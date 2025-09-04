package com.tjw.poketeam.server_java.team;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class TeamPokemonId implements Serializable {

    @Column(name = "team_id", length = 64, nullable = false)
    private String teamId;

    @Column(name = "pokemon_id", nullable = false)
    private Integer pokemonId;

    public TeamPokemonId() { }

    public TeamPokemonId(String teamId, Integer pokemonId) {
        this.teamId = teamId;
        this.pokemonId = pokemonId;
    }

    public String getTeamId() { return teamId; }
    public void setTeamId(String teamId) { this.teamId = teamId; }

    public Integer getPokemonId() { return pokemonId; }
    public void setPokemonId(Integer pokemonId) { this.pokemonId = pokemonId; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof TeamPokemonId that)) return false;
        return Objects.equals(teamId, that.teamId) &&
                Objects.equals(pokemonId, that.pokemonId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(teamId, pokemonId);
    }
}
