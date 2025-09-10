package com.tjw.poketeam.server_java.badges;

import com.tjw.poketeam.server_java.badges.dto.UserBadgeDTO;

public final class UserBadgeMapper {
    private UserBadgeMapper() {}

    public static UserBadgeDTO toDto(UserBadgeEntity e) {
        return new UserBadgeDTO(
                e.getId(),
                e.getName(),
                e.getDescription(),
                e.getEarnedAt(),
                e.getCount(),
                e.getBadgeVersion(),
                e.getHofEntryId()
        );
    }
}
