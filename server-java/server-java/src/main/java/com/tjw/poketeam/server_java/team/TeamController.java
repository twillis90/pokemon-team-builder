package com.tjw.poketeam.server_java.team;

import com.tjw.poketeam.server_java.team.dto.TeamDTO;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping
public class TeamController {

    private final TeamService teamService;

    public TeamController(TeamService teamService) {
        this.teamService = teamService;
    }

    // Stubbed auth: require "X-User-Id" header to match the path userId
    @GetMapping("/users/{userId}/teams")
    public List<TeamDTO> listUserTeams(
            @PathVariable String userId,
            @RequestHeader(value = "X-User-Id", required = false) String headerUserId
    ) {
        if (headerUserId == null || headerUserId.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing X-User-Id header");
        }
        if (!userId.equals(headerUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User ID mismatch");
        }
        return teamService.listUserTeams(userId);
    }

    @PostMapping("/users/{userId}/teams")
    @ResponseStatus(HttpStatus.CREATED)
    public TeamDTO createTeam(
            @PathVariable String userId,
            @RequestHeader(value = "X-User-Id", required = false) String headerUserId,
            @RequestBody TeamDTO request
    ) {
        if (headerUserId == null || headerUserId.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing X-User-Id header");
        }
        if (!userId.equals(headerUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User ID mismatch");
        }
        // ensure consistency even if client omits or sends a different userId
        request.setUserId(userId);
        return teamService.createTeam(userId, request);
    }
    @PostMapping("/teams/{teamId}/pokemon")
    public TeamDTO addPokemon(
            @PathVariable String teamId,
            @RequestHeader(value = "X-User-Id", required = false) String headerUserId,
            @RequestBody com.tjw.poketeam.server_java.team.dto.TeamPokemonDTO request
    ) {
        if (headerUserId == null || headerUserId.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing X-User-Id header");
        }
        return teamService.addPokemonToTeam(headerUserId, teamId, request);
    }

    @DeleteMapping("/teams/{teamId}/pokemon/{pokemonId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removePokemon(
            @PathVariable String teamId,
            @PathVariable Integer pokemonId,
            @RequestHeader(value = "X-User-Id", required = false) String headerUserId
    ) {
        if (headerUserId == null || headerUserId.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing X-User-Id header");
        }
        teamService.removePokemonFromTeam(headerUserId, teamId, pokemonId);
    }

    @PatchMapping("/teams/{teamId}")
    public TeamDTO renameTeam(
            @PathVariable String teamId,
            @RequestHeader(value = "X-User-Id", required = false) String headerUserId,
            @RequestBody com.tjw.poketeam.server_java.team.dto.TeamRenameRequest request
    ) {
        if (headerUserId == null || headerUserId.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing X-User-Id header");
        }
        if (request == null || request.getName() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Body.name is required");
        }
        return teamService.renameTeam(headerUserId, teamId, request.getName());
    }

    @DeleteMapping("/teams/{teamId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTeam(
            @PathVariable String teamId,
            @RequestHeader(value = "X-User-Id", required = false) String headerUserId
    ) {
        if (headerUserId == null || headerUserId.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing X-User-Id header");
        }
        teamService.deleteTeam(headerUserId, teamId);
    }


}
