package com.tjw.poketeam.server_java.team;

import com.tjw.poketeam.server_java.team.dto.TeamDTO;
import com.tjw.poketeam.server_java.team.dto.TeamPokemonDTO;
import com.tjw.poketeam.server_java.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

@Service
public class TeamService {

    private final TeamRepository teamRepository;
    private final TeamPokemonRepository teamPokemonRepository;
    private final UserRepository userRepository;
    private static final int MAX_TEAMS = 8;

    public TeamService(
            TeamRepository teamRepository,
            TeamPokemonRepository teamPokemonRepository,
            UserRepository userRepository // NEW
    ) {
        this.teamRepository = teamRepository;
        this.teamPokemonRepository = teamPokemonRepository;
        this.userRepository = userRepository; // NEW
    }

    @Transactional(readOnly = true)
    public List<TeamDTO> listUserTeams(String userId) {
        var teams = teamRepository.findAllByUserId(userId);
        List<TeamDTO> result = new ArrayList<>(teams.size());
        for (TeamEntity team : teams) {
            var mons = teamPokemonRepository.findAllByIdTeamId(team.getId());
            result.add(TeamMapper.toDto(team, mons));
        }
        return result;
    }

    // NEW: create a team for a user (validates and inserts rows)
    @Transactional
    public TeamDTO createTeam(String userId, TeamDTO request) {
        if (!userRepository.existsById(userId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found: " + userId);
        }
        if (request == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Body is required");
        }
        if (request.getId() == null || request.getId().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Team id is required");
        }
        if (request.getName() == null || request.getName().isBlank() || request.getName().length() > 30) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Team name must be 1–30 characters");
        }
        // If body contains userId, enforce it matches path userId
        if (request.getUserId() != null && !userId.equals(request.getUserId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Body.userId must match path userId");
        }
        if (teamRepository.existsById(request.getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Team id already exists");
        }
        long existing = teamRepository.countByUserId(userId);
        if (existing >= MAX_TEAMS) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Max teams reached (8)");
        }


        // Validate pokemon list (≤ 6 and no duplicate ids)
        List<TeamPokemonDTO> mons = request.getPokemon() != null ? request.getPokemon() : Collections.emptyList();
        if (mons.size() > 6) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Team cannot exceed 6 Pokémon");
        }
        Set<Integer> ids = new HashSet<>();
        for (TeamPokemonDTO m : mons) {
            if (m.getId() == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Each Pokémon must have an id");
            }
            if (!ids.add(m.getId())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Duplicate Pokémon id: " + m.getId());
            }
            if (m.getName() == null || m.getName().isBlank()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Each Pokémon must have a name");
            }
            if (m.getSprite() == null || m.getSprite().isBlank()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Each Pokémon must have a sprite URL");
            }
            if (m.getTypes() == null || m.getTypes().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Each Pokémon must have at least 1 type");
            }
        }

        // Insert team
        TeamEntity team = new TeamEntity(request.getId(), userId, request.getName());
        teamRepository.save(team);

        // Insert mons (if any)
        List<TeamPokemonEntity> savedMons = new ArrayList<>(mons.size());
        for (TeamPokemonDTO m : mons) {
            TeamPokemonEntity row = new TeamPokemonEntity(
                    request.getId(),
                    m.getId(),
                    m.getName(),
                    m.getSprite(),
                    m.getTypes()
            );
            savedMons.add(teamPokemonRepository.save(row));
        }

        // Return DTO from saved rows
        return TeamMapper.toDto(team, savedMons);
    }
    @Transactional
    public TeamDTO addPokemonToTeam(String requesterUserId, String teamId, TeamPokemonDTO m) {
        if (m == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Body is required");
        }
        // find team and authorize
        TeamEntity team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Team not found: " + teamId));

        if (!team.getUserId().equals(requesterUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your team");
        }

        // business rules
        long size = teamPokemonRepository.countByIdTeamId(teamId);
        if (size >= 6) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Team already has 6 Pokémon");
        }
        if (m.getId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Pokémon id is required");
        }
        if (teamPokemonRepository.existsByIdTeamIdAndIdPokemonId(teamId, m.getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Pokémon already in team: " + m.getId());
        }
        if (m.getName() == null || m.getName().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Pokémon name is required");
        }
        if (m.getSprite() == null || m.getSprite().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Pokémon sprite is required");
        }
        if (m.getTypes() == null || m.getTypes().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Pokémon types required");
        }

        // insert row
        TeamPokemonEntity row = new TeamPokemonEntity(
                teamId, m.getId(), m.getName(), m.getSprite(), m.getTypes()
        );
        teamPokemonRepository.save(row);

        // return updated team
        var mons = teamPokemonRepository.findAllByIdTeamId(teamId);
        return TeamMapper.toDto(team, mons);
    }
    @Transactional
    public void removePokemonFromTeam(String requesterUserId, String teamId, Integer pokemonId) {
        if (pokemonId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "pokemonId is required");
        }

        // find team + authorize
        TeamEntity team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Team not found: " + teamId));

        if (!team.getUserId().equals(requesterUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your team");
        }

        // ensure the row exists
        boolean exists = teamPokemonRepository.existsByIdTeamIdAndIdPokemonId(teamId, pokemonId);
        if (!exists) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Pokémon not in team: " + pokemonId);
        }

        // delete
        teamPokemonRepository.deleteByIdTeamIdAndIdPokemonId(teamId, pokemonId);
    }

    @Transactional
    public TeamDTO renameTeam(String requesterUserId, String teamId, String newName) {
        if (newName == null || newName.isBlank() || newName.length() > 30) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Team name must be 1–30 characters");
        }

        TeamEntity team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Team not found: " + teamId));

        if (!team.getUserId().equals(requesterUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your team");
        }

        team.setName(newName);
        teamRepository.save(team);

        var mons = teamPokemonRepository.findAllByIdTeamId(teamId);
        return TeamMapper.toDto(team, mons);
    }

    @Transactional
    public void deleteTeam(String requesterUserId, String teamId) {
        TeamEntity team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Team not found: " + teamId));

        if (!team.getUserId().equals(requesterUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your team");
        }

        teamRepository.deleteById(teamId);
    }


}
