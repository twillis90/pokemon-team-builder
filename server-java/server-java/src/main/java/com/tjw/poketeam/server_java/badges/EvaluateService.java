package com.tjw.poketeam.server_java.badges;

import com.tjw.poketeam.server_java.badges.dto.EvaluateResultDTO;
import com.tjw.poketeam.server_java.badges.dto.HallOfFameEntryDTO;
import com.tjw.poketeam.server_java.badges.dto.UserBadgeDTO;
import com.tjw.poketeam.server_java.badges.model.SnapshotPayload;
import com.tjw.poketeam.server_java.badges.model.SnapshotPokemon;
import com.tjw.poketeam.server_java.team.TeamEntity;
import com.tjw.poketeam.server_java.team.TeamPokemonEntity;
import com.tjw.poketeam.server_java.team.TeamPokemonRepository;
import com.tjw.poketeam.server_java.team.TeamRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class EvaluateService {

    private static final int BADGE_VERSION = 1;

    private final TeamRepository teamRepository;
    private final TeamPokemonRepository teamPokemonRepository;
    private final HallOfFameEntryRepository hofRepo;
    private final UserBadgeRepository badgeRepo;

    public EvaluateService(TeamRepository teamRepository,
                           TeamPokemonRepository teamPokemonRepository,
                           HallOfFameEntryRepository hofRepo,
                           UserBadgeRepository badgeRepo) {
        this.teamRepository = teamRepository;
        this.teamPokemonRepository = teamPokemonRepository;
        this.hofRepo = hofRepo;
        this.badgeRepo = badgeRepo;
    }

    @Transactional
    public EvaluateResultDTO evaluateTeam(String requesterUserId, String teamId) {
        // 1) find team + authorise
        TeamEntity team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Team not found: " + teamId));

        if (!team.getUserId().equals(requesterUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your team");
        }

        // 2) load roster
        List<TeamPokemonEntity> roster = teamPokemonRepository.findAllByIdTeamId(teamId);
        int size = roster.size();

        // 3) starter score (we'll evolve this later)
        int powerScore = size * 100;

        // 4) decide which badges to award on THIS evaluation
        List<BadgeSpec> toAward = new ArrayList<>();
        long existingAnyBadge = badgeRepo.countByUserId(requesterUserId);
        if (existingAnyBadge == 0) {
            toAward.add(new BadgeSpec("First Team", "Created and evaluated your first team"));
        }
        if (size == 6) {
            toAward.add(new BadgeSpec("Full Squad", "Built a full team of 6 Pokémon"));
        }

        // 5) If nothing to award, just return the score (no DB writes, no HOF entry)
        if (toAward.isEmpty()) {
            return new EvaluateResultDTO(powerScore, List.of(), null);
        }

        // 6) Create HOF snapshot from current roster
        SnapshotPayload snapshot = new SnapshotPayload(
                team.getId(),
                roster.stream()
                        .map(e -> new SnapshotPokemon(e.getPokemonId(), e.getName(), e.getSprite(), e.getTypes()))
                        .toList()
        );

        String[] badgeNames = toAward.stream().map(b -> b.name).toArray(String[]::new);

        HallOfFameEntryEntity hof = new HallOfFameEntryEntity(
                requesterUserId,
                team.getName(),
                powerScore,
                badgeNames,
                snapshot
        );
        hof = hofRepo.save(hof); // get UUID

        // 7) Upsert user_badges for each award (increment count if exists)
        OffsetDateTime now = OffsetDateTime.now();
        List<UserBadgeDTO> earnedDtos = new ArrayList<>(toAward.size());
        for (BadgeSpec b : toAward) {
            var existing = badgeRepo.findByUserIdAndNameAndBadgeVersion(requesterUserId, b.name, BADGE_VERSION)
                    .orElse(null);
            if (existing == null) {
                var created = new UserBadgeEntity(
                        requesterUserId,
                        b.name,
                        b.desc,
                        1,
                        BADGE_VERSION,
                        hof.getId(),
                        now
                );
                created = badgeRepo.save(created);
                earnedDtos.add(UserBadgeMapper.toDto(created));
            } else {
                existing.setCount(existing.getCount() + 1);
                existing.setHofEntryId(hof.getId());
                existing.setEarnedAt(now);
                var updated = badgeRepo.save(existing);
                earnedDtos.add(UserBadgeMapper.toDto(updated));
            }
        }

        // 8) Return result with the snapshot we just created
        HallOfFameEntryDTO hofDto = HallOfFameMapper.toDto(hof);
        return new EvaluateResultDTO(powerScore, earnedDtos, hofDto);
    }

    private record BadgeSpec(String name, String desc) {}
}
