package com.tjw.poketeam.server_java.team.dto;

import java.util.ArrayList;
import java.util.List;

public class TeamDTO {
    private String id;
    private String userId;
    private String name;
    private List<TeamPokemonDTO> pokemon = new ArrayList<>();

    public TeamDTO() {}

    public TeamDTO(String id, String userId, String name, List<TeamPokemonDTO> pokemon) {
        this.id = id;
        this.userId = userId;
        this.name = name;
        if (pokemon != null) this.pokemon = pokemon;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public List<TeamPokemonDTO> getPokemon() { return pokemon; }
    public void setPokemon(List<TeamPokemonDTO> pokemon) { this.pokemon = pokemon; }
}
