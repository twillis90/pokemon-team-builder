package com.tjw.poketeam.server_java.team.dto;

import java.util.List;

public class TeamPokemonDTO {
    private Integer id;
    private String name;
    private String sprite;
    private List<String> types;

    public TeamPokemonDTO() {}

    public TeamPokemonDTO(Integer id, String name, String sprite, List<String> types) {
        this.id = id;
        this.name = name;
        this.sprite = sprite;
        this.types = types;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSprite() { return sprite; }
    public void setSprite(String sprite) { this.sprite = sprite; }

    public List<String> getTypes() { return types; }
    public void setTypes(List<String> types) { this.types = types; }
}
