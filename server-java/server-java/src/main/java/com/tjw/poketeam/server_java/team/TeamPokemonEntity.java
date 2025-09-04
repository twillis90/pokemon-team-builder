package com.tjw.poketeam.server_java.team;

import jakarta.persistence.*;
import java.util.List;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "team_pokemon")
public class TeamPokemonEntity {

    @EmbeddedId
    private TeamPokemonId id;

    @Column(name = "name", length = 60, nullable = false)
    private String name;

    @Column(name = "sprite", length = 300, nullable = false)
    private String sprite;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "types", columnDefinition = "jsonb", nullable = false)
    private List<String> types;

    public TeamPokemonEntity() {}

    public TeamPokemonEntity(TeamPokemonId id, String name, String sprite, List<String> types) {
        this.id = id;
        this.name = name;
        this.sprite = sprite;
        this.types = types;
    }

    public TeamPokemonEntity(String teamId, Integer pokemonId, String name, String sprite, List<String> types) {
        this(new TeamPokemonId(teamId, pokemonId), name, sprite, types);
    }

    public TeamPokemonId getId() { return id; }
    public void setId(TeamPokemonId id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSprite() { return sprite; }
    public void setSprite(String sprite) { this.sprite = sprite; }

    public List<String> getTypes() { return types; }
    public void setTypes(List<String> types) { this.types = types; }

    @Transient
    public String getTeamId() { return id != null ? id.getTeamId() : null; }

    @Transient
    public Integer getPokemonId() { return id != null ? id.getPokemonId() : null; }
}
