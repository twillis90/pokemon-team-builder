package com.tjw.poketeam.server_java.badges;

import com.tjw.poketeam.server_java.badges.dto.EvaluateResultDTO;
import com.tjw.poketeam.server_java.badges.dto.HallOfFameEntryDTO;
import com.tjw.poketeam.server_java.badges.dto.UserBadgeDTO;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping
public class BadgesController {

    private final HallOfFameService hallOfFameService;
    private final UserBadgeService userBadgeService;
    private final EvaluateService evaluateService;

    public BadgesController(HallOfFameService hallOfFameService,
                            UserBadgeService userBadgeService,
                            EvaluateService evaluateService) {
        this.hallOfFameService = hallOfFameService;
        this.userBadgeService = userBadgeService;
        this.evaluateService = evaluateService;
    }

    @GetMapping("/users/{userId}/hof")
    public List<HallOfFameEntryDTO> listUserHof(
            @PathVariable String userId,
            @RequestHeader(value = "X-User-Id", required = false) String headerUserId
    ) {
        if (headerUserId == null || headerUserId.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing X-User-Id header");
        }
        if (!userId.equals(headerUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User ID mismatch");
        }
        return hallOfFameService.listUserHof(userId);
    }

    @GetMapping("/users/{userId}/badges")
    public List<UserBadgeDTO> listUserBadges(
            @PathVariable String userId,
            @RequestHeader(value = "X-User-Id", required = false) String headerUserId
    ) {
        if (headerUserId == null || headerUserId.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing X-User-Id header");
        }
        if (!userId.equals(headerUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User ID mismatch");
        }
        return userBadgeService.listUserBadges(userId);
    }

    @PostMapping("/teams/{teamId}/evaluate")
    public EvaluateResultDTO evaluate(
            @PathVariable String teamId,
            @RequestHeader(value = "X-User-Id", required = false) String headerUserId
    ) {
        if (headerUserId == null || headerUserId.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing X-User-Id header");
        }
        return evaluateService.evaluateTeam(headerUserId, teamId);
    }
}
