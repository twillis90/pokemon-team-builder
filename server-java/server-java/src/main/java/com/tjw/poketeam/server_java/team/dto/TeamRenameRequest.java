package com.tjw.poketeam.server_java.team.dto;

public class TeamRenameRequest {
    private String name;

    public TeamRenameRequest() {}

    public TeamRenameRequest(String name) { this.name = name; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}
