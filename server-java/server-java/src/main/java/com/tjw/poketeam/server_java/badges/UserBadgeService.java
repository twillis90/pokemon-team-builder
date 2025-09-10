package com.tjw.poketeam.server_java.badges;

import com.tjw.poketeam.server_java.badges.dto.UserBadgeDTO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserBadgeService {

    private final UserBadgeRepository repo;

    public UserBadgeService(UserBadgeRepository repo) {
        this.repo = repo;
    }

    @Transactional(readOnly = true)
    public List<UserBadgeDTO> listUserBadges(String userId) {
        return repo.findAllByUserIdOrderByEarnedAtDesc(userId)
                .stream()
                .map(UserBadgeMapper::toDto)
                .toList();
    }
}
